'use strict';

const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');
const vscode = require('vscode');

const IGNORED_DIRECTORIES = new Set([
  '.git', 'node_modules', 'vendor', 'dist', 'build', 'out', 'coverage',
  '.next', '.nuxt', '.turbo', '.vercel', '.local', '.cache',
  '__pycache__', '.pytest_cache', '.mypy_cache', '.venv', 'venv',
  'target', 'bin', 'obj', 'playwright-report', 'test-results',
]);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.bmp', '.woff', '.woff2',
  '.ttf', '.eot', '.otf', '.pdf', '.zip', '.tar', '.gz', '.rar', '.7z',
  '.exe', '.dll', '.so', '.dylib', '.bin', '.dat', '.db', '.sqlite', '.mp3',
  '.mp4', '.wav', '.avi', '.mov', '.webm',
]);

function isWorkspaceTextFile(name) {
  const lower = name.toLowerCase();
  const base = path.basename(lower);
  if (BINARY_EXTENSIONS.has(path.extname(lower))) return false;
  return !base.startsWith('.') || ['.env', '.gitignore', '.gitattributes', '.gitmodules'].includes(base);
}

async function collectWorkspaceFiles(workspaceRoot, onProgress) {
  const files = [];
  const rootName = path.basename(workspaceRoot);

  async function visit(directory, relativeDirectory) {
    const entries = await fs.promises.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name.toLowerCase())) continue;
      const absolutePath = path.join(directory, entry.name);
      const relativePath = relativeDirectory ? path.join(relativeDirectory, entry.name) : entry.name;
      if (entry.isDirectory()) {
        await visit(absolutePath, relativePath);
      } else if (entry.isFile() && isWorkspaceTextFile(entry.name)) {
        try {
          const content = await fs.promises.readFile(absolutePath, 'utf8');
          files.push({ path: relativePath.split(path.sep).join('/'), name: entry.name, content });
          if (files.length % 50 === 0 && onProgress) onProgress(files.length);
        } catch {
          // Ignore files VS Code cannot read; the browser folder flow behaves similarly.
        }
      }
    }
  }

  await visit(workspaceRoot, '');
  return { rootName, files };
}

function assetUri(webview, extensionPath, relativePath) {
  return webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, relativePath))).toString();
}

function rewriteLocalAssets(html, webview, projectRoot) {
  // ArchFlow is intentionally dependency-free at runtime. Rewrite only local
  // assets; external GitHub URLs and data URLs remain untouched.
  return html.replace(/(src|href)=(['"])(\.\/[^'"]+)\2/g, (match, attribute, quote, relativePath) => {
    return `${attribute}=${quote}${assetUri(webview, projectRoot, relativePath.slice(2))}${quote}`;
  }).replace(/url\((['"]?)(\.\/[^)'" ]+)\1\)/g, (match, quote, relativePath) => {
    return `url(${quote}${assetUri(webview, projectRoot, relativePath.slice(2))}${quote})`;
  });
}

function createWebviewContent(projectRoot, webview) {
  const indexPath = path.join(projectRoot, 'index.html');
  const html = fs.readFileSync(indexPath, 'utf8');
  const nonce = `${Date.now()}${Math.random().toString(16).slice(2)}`;
  const content = rewriteLocalAssets(html, webview, projectRoot);
  const logoUri = assetUri(webview, projectRoot, 'assets/archflow-logo-transparent.svg');
  const csp = [
    "default-src 'none'",
    `img-src ${webview.cspSource} https: data:`,
    `font-src ${webview.cspSource} data:`,
    `style-src ${webview.cspSource} 'unsafe-inline'`,
    // The existing single-file app uses Babel and a worker generated from its
    // document. Keep this compatible with the browser app during phase 1.
    `script-src ${webview.cspSource} 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval'`,
    `worker-src ${webview.cspSource} blob:`,
    `connect-src ${webview.cspSource} https:`,
  ].join('; ');

  const toolbar = `
    <img src="${logoUri}" alt="ArchFlow" width="156" height="39" style="position:fixed;left:14px;top:6px;z-index:10000;object-fit:contain">
    <div id="archflow-extension-toolbar" aria-label="ArchFlow workspace controls">
      <button data-archflow-action="workspace" aria-label="Analyze Workspace" title="Analyze Workspace"><span class="archflow-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0ZM8.5 11.25h5M11 8.75v5"/></svg></span><span>Analyze Workspace</span></button>
      <button data-archflow-action="health" aria-label="Health" title="Health"><span class="archflow-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/></svg></span><span>Health</span></button>
      <button data-archflow-action="issues" aria-label="Issues" title="Issues"><span class="archflow-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5m0 3h.01"/></svg></span><span>Issues</span></button>
      <button data-archflow-action="branch-diff" aria-label="Compare Git branch" title="Compare Git branch"><span class="archflow-action-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3v12a4 4 0 1 0 4 4h4a4 4 0 1 0 4-4V7M6 7h8a4 4 0 0 1 4 4"/><circle cx="6" cy="3" r="2"/><circle cx="18" cy="19" r="2"/></svg></span><span>Compare</span></button>
    </div>
    <div id="archflow-extension-status" role="status" aria-live="polite"></div>
    <script>
      (function(){
        var api=typeof acquireVsCodeApi==='function'?acquireVsCodeApi():null;
        var status=document.getElementById('archflow-extension-status');
        document.documentElement.classList.add('archflow-vscode');
        var style=document.createElement('style');
        style.textContent='\
          #archflow-extension-toolbar{position:fixed;top:7px;left:50%;transform:translateX(-50%);z-index:10001;display:flex;gap:4px;align-items:center;padding:4px;background:color-mix(in srgb,var(--bg1) 92%,transparent);border:1px solid var(--border);border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.01);font:11px sans-serif}\\
          #archflow-extension-toolbar button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:30px;padding:6px 10px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--t1);font:600 10px sans-serif;cursor:pointer;white-space:nowrap;transition:background .16s ease,border-color .16s ease,color .16s ease,transform .16s ease}\\
          #archflow-extension-toolbar button:hover{background:var(--accbg);border-color:var(--acc);color:var(--acc);transform:translateY(-1px)}\\
          #archflow-extension-toolbar button:focus-visible{outline:2px solid var(--acc);outline-offset:2px}\\
          .archflow-action-icon{display:inline-flex;width:15px;height:15px;color:currentColor}\\
          .archflow-action-icon svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\\
          #archflow-extension-status{position:fixed;top:56px;right:16px;z-index:10001;min-height:24px;padding:5px 9px;border:1px solid var(--border);border-radius:8px;background:var(--bg1);box-shadow:0 2px 8px rgba(0,0,0,.01);color:var(--t2);font:10px sans-serif;white-space:nowrap;pointer-events:none}\\
          #archflow-extension-status:empty{display:none}\\
          .repo-input-group,.mobile-source-controls,.topbar>.logo,.mobile-brand-row .logo,\
          button[aria-label="Open local folder"],button[title="Open local folder"],\
          button[aria-label="Open ZIP archive"],button[title="Open ZIP archive"],\
          button[aria-label="Edit exclude patterns"],button[title^="Edit exclude patterns"],\
          .refresh-btn,.reset-btn,input[type="file"]{display:none!important}\
          .archflow-vscode .sidebar,.archflow-vscode .right-panel{display:none!important}\
          .archflow-vscode .canvas-area{width:100%!important}\
          .archflow-vscode .mobile-panel-actions{display:none!important}\
          .archflow-vscode .mobile-bottom-nav{display:grid!important;pointer-events:auto!important;z-index:10002!important}\
          .archflow-vscode.archflow-health-open .sidebar,.archflow-vscode.archflow-explorer-open .sidebar{display:flex!important;position:fixed!important;left:12px;top:60px;bottom:12px;width:280px!important;min-width:280px!important;z-index:9998;box-shadow:0 4px 14px rgba(0,0,0,.01)}\
          .archflow-vscode.archflow-health-open .sidebar .sidebar-scroll{display:none!important}\
          .archflow-vscode.archflow-insights-open .right-panel{display:flex!important;position:fixed!important;right:12px;top:60px;bottom:12px;width:380px!important;z-index:9998;box-shadow:0 4px 14px rgba(0,0,0,.01)}\
          @media(max-width:800px){#archflow-extension-toolbar{left:10px;right:10px;transform:none;justify-content:center}#archflow-extension-toolbar button{flex:1;padding-left:6px;padding-right:6px}#archflow-extension-toolbar button span:last-child{display:none}#archflow-extension-status{right:10px}.archflow-vscode.archflow-health-open .sidebar,.archflow-vscode.archflow-explorer-open .sidebar,.archflow-vscode.archflow-insights-open .right-panel{left:12px;right:12px;width:auto!important;min-width:0!important}}\
        ';
        document.head.appendChild(style);
        function rewriteVisibleText(){
          var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
          var node;
          while(node=walker.nextNode()){
            var parent=node.parentElement;
            if(!parent||parent.closest('script,style,textarea'))continue;
            var value=node.nodeValue;
            var updated=value.replace(/CODEFLOW/g,'ARCHFLOW').replace(/CodeFlow/g,'ArchFlow')
              .replace('Enter a GitHub URL, open a folder, or load a ZIP archive','Use Analyze Workspace to inspect the open VS Code folder')
              .replace('Analyze a repo or open a folder','Analyze the current VS Code workspace');
            if(updated!==value)node.nodeValue=updated;
          }
        }
        rewriteVisibleText();
        if(window.MutationObserver)new MutationObserver(rewriteVisibleText).observe(document.body,{childList:true,subtree:true});
        window.addEventListener('message',function(event){
          var message=event.data||{};
          if(message.type==='archflow-status'&&status)status.textContent=message.text||'';
          if(message.type==='archflow-branch-diff')window.dispatchEvent(new CustomEvent('archflow-branch-diff',{detail:message}));
          if(message.type==='archflow-load-workspace'){
            var input=document.querySelector('input[webkitdirectory]');
            if(!input){if(status)status.textContent='Folder input is not ready';return;}
            var transfer=new DataTransfer();
            (message.files||[]).forEach(function(item){
              var file=new File([item.content||''],item.name||'file',{type:'text/plain'});
              try{Object.defineProperty(file,'webkitRelativePath',{value:(message.rootName||'workspace')+'/'+item.path});}catch(e){}
              transfer.items.add(file);
            });
            input.files=transfer.files;
            input.dispatchEvent(new Event('change',{bubbles:true}));
          }
        });
        // showDirectoryPicker is blocked inside VS Code webviews. Redirect the
        // existing app's Open Folder controls to the native workspace bridge.
        document.addEventListener('click',function(event){
          var target=event.target&&event.target.closest?event.target.closest('button[aria-label="Open local folder"],button[title="Open local folder"]'):null;
          if(target){
            event.preventDefault();
            event.stopPropagation();
            if(api)api.postMessage({type:'archflow-action',action:'workspace'});
          }
        },true);
        document.querySelectorAll('[data-archflow-action]').forEach(function(button){
          button.addEventListener('click',function(){
            var action=button.getAttribute('data-archflow-action');
            if(action==='canvas'){
              document.documentElement.classList.remove('archflow-health-open','archflow-explorer-open','archflow-insights-open');
              return;
            }
            if(action==='explorer'){
              var explorerOpening=!document.documentElement.classList.contains('archflow-explorer-open');
              document.documentElement.classList.toggle('archflow-explorer-open');
              document.documentElement.classList.remove('archflow-health-open','archflow-insights-open');
              document.querySelectorAll('.sidebar .sidebar-section').forEach(function(section){section.style.display='';});
              return;
            }
            if(action==='insights'){
              document.documentElement.classList.toggle('archflow-insights-open');
              document.documentElement.classList.remove('archflow-health-open','archflow-explorer-open');
              if(document.documentElement.classList.contains('archflow-insights-open')){
                setTimeout(function(){var tab=document.querySelector('.right-panel .panel-tab');if(tab)tab.click();},0);
              }
              return;
            }
            if(action==='branch-diff'){
              if(api)api.postMessage({type:'archflow-action',action:'branch-diff'});
              return;
            }
            if(action==='health'){
              var opening=!document.documentElement.classList.contains('archflow-health-open');
              document.documentElement.classList.toggle('archflow-health-open');
              document.documentElement.classList.remove('archflow-insights-open');
              document.querySelectorAll('.sidebar .sidebar-section').forEach(function(section,index){
                section.style.display=opening?(index===0?'block':'none'):'';
              });
              return;
            }
            if(action==='issues'){
              document.documentElement.classList.toggle('archflow-insights-open');
              document.documentElement.classList.remove('archflow-health-open');
              if(document.documentElement.classList.contains('archflow-insights-open')){
                setTimeout(function(){var tab=document.querySelector('.right-panel .panel-tab');if(tab)tab.click();},0);
              }
              return;
            }
            if(api)api.postMessage({type:'archflow-action',action:action});
          });
        });
        if(api)api.postMessage({type:'archflow-ready'});
      }());
    </script>`;

  return content.replace('<head>', `<head><meta http-equiv="Content-Security-Policy" content="${csp}">`)
    .replace('</body>', `${toolbar}</body>`)
    .replace(/<script(\s|>)/g, `<script nonce="${nonce}"$1`);
}

function refreshPanel(panel, projectRoot) {
  panel.__archflowReady = false;
  panel.__archflowPendingWorkspace = null;
  panel.webview.html = createWebviewContent(projectRoot, panel.webview);
}

async function sendWorkspaceToPanel(panel, workspaceFolder) {
  if (!workspaceFolder) {
    vscode.window.showInformationMessage('Open a workspace folder before analyzing it.');
    return;
  }
  panel.__archflowWorkspaceLoaded = true;
  panel.webview.postMessage({ type: 'archflow-status', text: 'Reading workspace...' });
  try {
    const result = await collectWorkspaceFiles(workspaceFolder, (count) => {
      panel.webview.postMessage({ type: 'archflow-status', text: `Reading workspace... ${count} files` });
    });
    if (!result.files.length) {
      vscode.window.showWarningMessage('ArchFlow found no readable text files in this workspace.');
      return;
    }
    panel.webview.postMessage({ type: 'archflow-status', text: `Loading ${result.files.length} files...` });
    await panel.webview.postMessage({
      type: 'archflow-load-workspace',
      rootName: result.rootName,
      files: result.files,
    });
  } catch (error) {
    vscode.window.showErrorMessage(`ArchFlow could not read the workspace: ${error.message || error}`);
  }
}

function requestWorkspaceAnalysis(panel, workspaceFolder) {
  if (!panel.__archflowReady) {
    panel.__archflowPendingWorkspace = workspaceFolder;
    return;
  }
  sendWorkspaceToPanel(panel, workspaceFolder);
}

async function compareWorkspaceBranch(panel, workspaceFolder) {
  if (!workspaceFolder) {
    vscode.window.showInformationMessage('Open a workspace folder before comparing branches.');
    return;
  }
  const branch = await vscode.window.showInputBox({
    prompt: 'Compare the current workspace with a Git branch',
    placeHolder: 'main',
    value: 'main',
  });
  if (!branch) return;
  try {
    const output = childProcess.execFileSync(
      'git',
      ['diff', '--name-status', `${branch}...HEAD`],
      { cwd: workspaceFolder, encoding: 'utf8' },
    );
    const changes = output.split(/\r?\n/).filter(Boolean).map((line) => {
      const parts = line.split(/\t+/);
      return { status: parts[0], path: parts[parts.length - 1] };
    });
    panel.webview.postMessage({ type: 'archflow-branch-diff', branch, changes });
    vscode.window.setStatusBarMessage(`ArchFlow compared with ${branch}`, 2500);
  } catch (error) {
    vscode.window.showErrorMessage(`ArchFlow could not compare branches: ${error.message || error}`);
  }
}

function openArchitectureMap(context, workspaceFolder) {
  const projectRoot = context.extensionPath;
  const panel = vscode.window.createWebviewPanel(
    'archflowArchitectureMap',
    'ArchFlow Architecture Map',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(projectRoot)],
      retainContextWhenHidden: true,
    },
  );

  refreshPanel(panel, projectRoot);
  panel.__archflowWorkspaceLoaded = false;
  panel.webview.onDidReceiveMessage((message) => {
    if (!message) return;
    if (message.type === 'archflow-ready') {
      panel.__archflowReady = true;
      if (panel.__archflowPendingWorkspace) {
        const pending = panel.__archflowPendingWorkspace;
        panel.__archflowPendingWorkspace = null;
        sendWorkspaceToPanel(panel, pending);
      }
      return;
    }
    if (message.type !== 'archflow-action') return;
    if (message.action === 'refresh') {
      refreshPanel(panel, projectRoot);
      vscode.window.setStatusBarMessage('ArchFlow refreshed', 2000);
    } else if (message.action === 'workspace') {
      requestWorkspaceAnalysis(panel, workspaceFolder);
    } else if (message.action === 'branch-diff') {
      compareWorkspaceBranch(panel, workspaceFolder);
    }
  }, undefined, context.subscriptions);

  return panel;
}

function activate(context) {
  let currentPanel;
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  let refreshTimer;
  const scheduleWorkspaceRefresh = () => {
    if (!currentPanel || !currentPanel.__archflowReady || !currentPanel.__archflowWorkspaceLoaded || !workspaceFolder) return;
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      requestWorkspaceAnalysis(currentPanel, workspaceFolder);
    }, 700);
  };
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(scheduleWorkspaceRefresh),
    vscode.workspace.onDidCreateFiles(scheduleWorkspaceRefresh),
    vscode.workspace.onDidDeleteFiles(scheduleWorkspaceRefresh),
    { dispose: () => clearTimeout(refreshTimer) },
  );
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('archflow.dashboard', new ArchFlowViewProvider()),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('archflow.openArchitectureMap', () => {
      currentPanel = openArchitectureMap(context, workspaceFolder);
    }),
    vscode.commands.registerCommand('archflow.refreshArchitectureMap', () => {
      if (!currentPanel) {
        vscode.window.showInformationMessage('Open the ArchFlow Architecture Map first.');
        return;
      }
      refreshPanel(currentPanel, context.extensionPath);
    }),
    vscode.commands.registerCommand('archflow.analyzeWorkspace', async () => {
      if (!currentPanel) currentPanel = openArchitectureMap(context, workspaceFolder);
      requestWorkspaceAnalysis(currentPanel, workspaceFolder);
    }),
    vscode.commands.registerCommand('archflow.compareBranch', async () => {
      if (!currentPanel) currentPanel = openArchitectureMap(context, workspaceFolder);
      compareWorkspaceBranch(currentPanel, workspaceFolder);
    }),
  );

  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  status.text = '$(graph) ArchFlow';
  status.tooltip = 'Open ArchFlow Architecture Map';
  status.command = 'archflow.openArchitectureMap';
  status.show();
  context.subscriptions.push(status);
}

function deactivate() {}

class ArchFlowViewProvider {
  resolveWebviewView(webviewView) {
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = `<!doctype html>
      <html><body style="font-family:var(--vscode-font-family);padding:14px;color:var(--vscode-foreground)">
        <h3 style="margin:0 0 8px">ArchFlow</h3>
        <p style="opacity:.75;font-size:12px;line-height:1.5">Explore your workspace architecture, dependencies, health, and security insights.</p>
        <button data-action="open" style="width:100%;margin:5px 0;padding:7px">Open Architecture Map</button>
        <button data-action="workspace" style="width:100%;margin:5px 0;padding:7px">Analyze Current Workspace</button>
        <script>
          const api=acquireVsCodeApi();
          document.querySelectorAll('[data-action]').forEach((button)=>button.addEventListener('click',()=>api.postMessage({action:button.dataset.action})));
        </script>
      </body></html>`;
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.action === 'open') vscode.commands.executeCommand('archflow.openArchitectureMap');
      if (message.action === 'workspace') vscode.commands.executeCommand('archflow.analyzeWorkspace');
    });
  }
}

module.exports = { activate, deactivate, createWebviewContent, rewriteLocalAssets };
