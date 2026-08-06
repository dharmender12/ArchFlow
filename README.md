<div align="center">

# ArchFlow

### Understand your codebase at a glance.

<img src="./assets/archflow-logo.jpg" alt="ArchFlow logo" width="480" />

Interactive architecture maps, dependency graphs, health insights, security checks,
and blast-radius analysis for real-world codebases.

[Try ArchFlow](https://dharmender-github-io.vercel.app/) · [Report an issue](https://github.com/dharmender12/ArchFlow/issues) · [Request a feature](https://github.com/dharmender12/ArchFlow/issues/new)

</div>

---

## What is ArchFlow?

ArchFlow helps developers understand unfamiliar repositories without manually tracing
files and imports. Point it at a GitHub repository, local folder, ZIP archive, Markdown
vault, or the current VS Code workspace and explore the resulting architecture map.

ArchFlow is privacy-first: local projects are analyzed on your machine and are not
uploaded to an ArchFlow server.

## Features

- Interactive dependency graph with multiple visualization modes
- Blast-radius analysis for understanding change impact
- Health score based on coupling, cycles, dead code, and security findings
- Security checks for secrets, injection risks, dangerous execution, XSS, and debug code
- Pattern and anti-pattern detection
- Function-level call graph and duplicate-code analysis
- Layer-violation and architecture-diagram views
- Code ownership and activity heatmap from Git history
- Markdown links and Obsidian wiki-link graphs
- JSON, Markdown, text, SVG, and PDF exports
- GitHub pull-request impact analysis
- Offline local-file analysis with custom exclude patterns
- GitHub Action card for repository health summaries
- VS Code extension with native workspace discovery

## Use ArchFlow online

Open [ArchFlow](https://dharmender-github-io.vercel.app/) and paste a public GitHub
repository such as:

```text
facebook/react
```

You can also analyze private repositories by providing a GitHub token locally in the
app. Tokens are kept in browser memory and are not sent to ArchFlow servers.

## Analyze a local folder

1. Open ArchFlow.
2. Select **Open Folder** or **Open ZIP**.
3. Choose a project directory or archive.
4. Explore the graph, health score, security findings, and exports.

Generated directories, dependencies, caches, and common build output are excluded by
default. You can add your own patterns such as `uploads/**` or `**/cache/**`.

## ArchFlow for VS Code

The repository includes an extension scaffold that keeps the existing analyzer and UI
as the source of truth while adding VS Code integration.

### Run from source

1. Open this repository in VS Code.
2. Press `F5` to launch the Extension Development Host.
3. Run `ArchFlow: Open Architecture Map`.
4. Click **Analyze Workspace** to analyze the open folder directly from VS Code.

The extension reads workspace files through the VS Code API and sends them into the
existing local-folder analysis flow. The analyzer itself is not duplicated.

### Install from a VSIX

```bash
npm install --global @vscode/vsce
vsce package
code --install-extension archflow-vscode-0.1.0.vsix
```

## Supported languages

ArchFlow supports JavaScript, TypeScript, JSX/TSX, Python, Java, Go, Ruby, PHP, Rust,
C/C++, C#, Swift, Kotlin, Scala, Elixir, Lua, Bash, Pascal, HTML, Vue, Svelte, CSS,
Markdown, JSON, YAML, XML, SQL, Terraform, and many related text formats.

Tree-sitter grammars are vendored locally for supported languages, allowing local
analysis to work without installing runtime dependencies.

## GitHub Action card

The [`card/`](./card/) package provides a GitHub Action that generates an SVG health
card for a repository. It uses the same analysis pipeline and can optionally add a
thermal-receipt-style pull-request comment.

See [card/README.md](./card/README.md) for configuration and examples.

## Development

ArchFlow is intentionally lightweight. The browser application is a checked-in
`index.html` with vendored runtime dependencies, so it does not require a frontend
build step.

Run the test suite with:

```bash
node --test tests/*.test.mjs tests/*.smoke.js
```

The analyzer is kept as the shared source of truth for the browser app, VS Code
integration, tests, and GitHub Action.

## Privacy and security

- Local files are processed locally.
- No ArchFlow backend receives analyzed source code.
- GitHub requests are made directly from the app when you analyze a repository URL.
- Do not commit tokens, private keys, `.env` files, or other credentials.
- Review generated reports before sharing them publicly.

## Contributing

Issues and pull requests are welcome. Before opening a pull request:

1. Keep analyzer behavior covered by regression tests.
2. Preserve the browser, VS Code, and GitHub Action analysis contract.
3. Run the full test suite.
4. Avoid adding dependencies unless they are necessary and documented.

## License

ArchFlow is released under the [MIT License](./LICENSE).
