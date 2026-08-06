import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const host = await readFile(join(root, 'extension/extension.js'), 'utf8');

assert.equal(manifest.main, './extension/extension.js');
assert.equal(manifest.name, 'archflow-vscode');
assert.equal(manifest.displayName, 'ArchFlow');
assert.ok(manifest.contributes.commands.some((command) => command.command === 'archflow.openArchitectureMap'));
assert.ok(manifest.contributes.commands.some((command) => command.command === 'archflow.refreshArchitectureMap'));
assert.ok(manifest.contributes.commands.some((command) => command.command === 'archflow.analyzeWorkspace'));
assert.ok(!manifest.contributes.commands.some((command) => command.command.includes('Browser')));
assert.match(host, /createWebviewPanel/);
assert.match(host, /rewriteLocalAssets/);
assert.match(host, /archflow-action/);
assert.match(host, /archflow-load-workspace/);
assert.match(host, /collectWorkspaceFiles/);
assert.match(host, /archflow-ready/);
assert.doesNotMatch(host, /openArchitectureMapInBrowser/);
