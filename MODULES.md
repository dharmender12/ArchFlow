# ArchLens Modules

## card/analyze.js
- Language: javascript
- Depends on:
  - card/lib/analysis.js
  - path
- Depended on by:
  - none
- Unresolved imports:
  - path

## card/index.js
- Language: javascript
- Depends on:
  - card/lib/analysis.js
  - card/lib/git.js
  - card/lib/inputs.js
  - card/lib/pr.js
  - card/lib/state.js
  - card/render/card.js
  - card/render/receipt-md.js
  - fs
  - path
- Depended on by:
  - none
- Unresolved imports:
  - fs
  - path

## card/lib/analysis.js
- Language: javascript
- Depends on:
  - card/lib/analyzer.js
  - card/lib/collect.js
  - card/lib/exclude.js
  - card/lib/state.js
  - fs
  - path
- Depended on by:
  - card/analyze.js
  - card/index.js
- Unresolved imports:
  - fs
  - path

## card/lib/analyzer.js
- Language: javascript
- Depends on:
  - fs
  - path
  - vm
- Depended on by:
  - card/lib/analysis.js
- Unresolved imports:
  - fs
  - path
  - vm

## card/lib/collect.js
- Language: javascript
- Depends on:
  - card/lib/exclude.js
  - fs
  - path
- Depended on by:
  - card/lib/analysis.js
- Unresolved imports:
  - fs
  - path

## card/lib/exclude.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - card/lib/analysis.js
  - card/lib/collect.js
- Unresolved imports: none

## card/lib/git.js
- Language: javascript
- Depends on:
  - child_process
- Depended on by:
  - card/index.js
- Unresolved imports:
  - child_process

## card/lib/inputs.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - card/index.js
- Unresolved imports: none

## card/lib/pr.js
- Language: javascript
- Depends on:
  - https
- Depended on by:
  - card/index.js
- Unresolved imports:
  - https

## card/lib/state.js
- Language: javascript
- Depends on:
  - fs
  - path
- Depended on by:
  - card/index.js
  - card/lib/analysis.js
- Unresolved imports:
  - fs
  - path

## card/render/card.js
- Language: javascript
- Depends on:
  - card/render/styles.js
- Depended on by:
  - card/index.js
  - card/render/receipt.js
- Unresolved imports: none

## card/render/receipt-md.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - card/index.js
- Unresolved imports: none

## card/render/receipt.js
- Language: javascript
- Depends on:
  - card/render/card.js
  - card/render/theme.js
- Depended on by:
  - none
- Unresolved imports: none

## card/render/sparkline.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - card/render/styles.js
- Unresolved imports: none

## card/render/styles.js
- Language: javascript
- Depends on:
  - card/render/sparkline.js
  - card/render/theme.js
- Depended on by:
  - card/render/card.js
- Unresolved imports: none

## card/render/theme.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - card/render/receipt.js
  - card/render/styles.js
- Unresolved imports: none

## extension/extension.js
- Language: javascript
- Depends on:
  - node:fs
  - node:path
  - vscode
- Depended on by:
  - none
- Unresolved imports:
  - node:fs
  - node:path
  - vscode

## tests/fixtures/golden-world/src/app.js
- Language: javascript
- Depends on:
  - tests/fixtures/golden-world/src/math.js
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/golden-world/src/main.py
- Language: python
- Depends on:
  - service.hydrate
- Depended on by:
  - none
- Unresolved imports:
  - service.hydrate

## tests/fixtures/golden-world/src/math.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - tests/fixtures/golden-world/src/app.js
- Unresolved imports: none

## tests/fixtures/golden-world/src/service.py
- Language: python
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/security-precision-world/.claude/hooks/pre-commit.py
- Language: python
- Depends on:
  - subprocess
- Depended on by:
  - none
- Unresolved imports:
  - subprocess

## tests/fixtures/security-precision-world/api/import.py
- Language: python
- Depends on:
  - subprocess
- Depended on by:
  - none
- Unresolved imports:
  - subprocess

## tests/fixtures/security-precision-world/app/api/invoices/route.ts
- Language: typescript
- Depends on:
  - next/server
- Depended on by:
  - none
- Unresolved imports:
  - next/server

## tests/fixtures/security-precision-world/app/api/orders/route.ts
- Language: typescript
- Depends on:
  - next/server
- Depended on by:
  - none
- Unresolved imports:
  - next/server

## tests/fixtures/security-precision-world/app/api/users/route.ts
- Language: typescript
- Depends on:
  - next/server
- Depended on by:
  - none
- Unresolved imports:
  - next/server

## tests/fixtures/security-precision-world/app/mixed-render.tsx
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/security-precision-world/app/page.tsx
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/security-precision-world/app/profile-card.tsx
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/security-precision-world/components/dashboard.tsx
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/security-precision-world/lib/auth.ts
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/security-precision-world/lib/csp.ts
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/security-precision-world/lib/db.ts
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/security-precision-world/lib/dynamic.ts
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/security-precision-world/lib/runner.ts
- Language: typescript
- Depends on:
  - child_process
- Depended on by:
  - none
- Unresolved imports:
  - child_process

## tests/fixtures/security-precision-world/lib/search.ts
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/security-precision-world/server/logger.ts
- Language: typescript
- Depends on:
  - node:child_process
- Depended on by:
  - none
- Unresolved imports:
  - node:child_process

## tests/fixtures/security-precision-world/test/client-ip.test.ts
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/a-backend/apiClient.ts
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - tests/fixtures/web-app-world/a-backend/youtube/analyzer.ts
- Unresolved imports: none

## tests/fixtures/web-app-world/a-backend/routes/api.ts
- Language: typescript
- Depends on:
  - tests/fixtures/web-app-world/a-backend/youtube/analyzer.ts
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/a-backend/src/config/index.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/a-backend/src/middleware/index.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/a-backend/src/routes/index.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/a-backend/youtube/analyzer.ts
- Language: typescript
- Depends on:
  - tests/fixtures/web-app-world/a-backend/apiClient.ts
- Depended on by:
  - tests/fixtures/web-app-world/a-backend/routes/api.ts
- Unresolved imports: none

## tests/fixtures/web-app-world/about/index.tsx
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/middleware/auth.ts
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/src/app/global-error.tsx
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/src/app/layout.tsx
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/src/app/page.tsx
- Language: typescript
- Depends on:
  - tests/fixtures/web-app-world/src/components/LandingPage.tsx
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/src/components/LandingPage.tsx
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - tests/fixtures/web-app-world/src/app/page.tsx
- Unresolved imports: none

## tests/fixtures/web-app-world/src/hooks/index.ts
- Language: typescript
- Depends on:
  - ./useAuth
- Depended on by:
  - none
- Unresolved imports:
  - ./useAuth

## tests/fixtures/web-app-world/src/platforms/youtube/schema/index.ts
- Language: typescript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## tests/fixtures/web-app-world/src/ui/components/index.ts
- Language: typescript
- Depends on:
  - ./Button
- Depended on by:
  - none
- Unresolved imports:
  - ./Button

## tests/html-inline-script-analysis.smoke.js
- Language: javascript
- Depends on:
  - node:assert/strict
  - node:fs
  - node:path
  - node:vm
- Depended on by:
  - none
- Unresolved imports:
  - node:assert/strict
  - node:fs
  - node:path
  - node:vm

## vendor/3d-force-graph/3d-force-graph.min.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## vendor/acorn/acorn.min.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## vendor/babel/babel.min.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## vendor/d3-sankey/d3-sankey.min.js
- Language: javascript
- Depends on:
  - d3-array
  - d3-shape
- Depended on by:
  - none
- Unresolved imports:
  - d3-array
  - d3-shape

## vendor/d3/d3.min.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## vendor/jspdf/jspdf.umd.min.js
- Language: javascript
- Depends on:
  - canvg
  - dompurify
  - html2canvas
  - worker_threads
- Depended on by:
  - none
- Unresolved imports:
  - worker_threads
  - html2canvas
  - dompurify
  - canvg

## vendor/jsrsasign/jsrsasign-all-min.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## vendor/jszip/jszip.min.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## vendor/mermaid/mermaid.min.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## vendor/react-dom/react-dom.production.min.js
- Language: javascript
- Depends on:
  - react
- Depended on by:
  - none
- Unresolved imports:
  - react

## vendor/react/react.production.min.js
- Language: javascript
- Depends on:
  - none
- Depended on by:
  - none
- Unresolved imports: none

## vendor/tree-sitter/tree-sitter.js
- Language: javascript
- Depends on:
  - fs
  - path
- Depended on by:
  - none
- Unresolved imports:
  - fs
  - path
