#  Complexity Analyzer

**Step-by-step time & space complexity analysis for Java, Python, C, C++, JavaScript & TypeScript code — right inside VS Code.**

No extensions like this explain the *why* behind complexity. This one does.

---
##  Download Extension

Download the latest version here:

https://github.com/chaithra-p-codes/complexity-analyzer/releases

## Features

-  **Line-by-line analysis** — see exactly which line contributes to complexity and why
-  **Inline decorations** — complexity hints appear right next to your code
-  **Beautiful panel** — a dark-themed analysis panel with severity colors
-  **Optimization tips** — actionable suggestions to reduce complexity
-  Detects: `for`, `while`, `.forEach`, `.map`, `.filter`, `.reduce`, `.sort`, recursion, HashMaps, nested loops, and more

---

## Usage

### Analyze whole file
- Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
- Or: Right-click → ** Analyze Time Complexity**

### Analyze selected code
- Select any block of code
- Right-click → ** Analyze Selected Code**

---

## Example

```javascript
function findDuplicates(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {      // O(n)
    for (let j = i + 1; j < arr.length; j++) { // O(n^2) — nested!
      if (arr[i] === arr[j]) {
        result.push(arr[i]);
      }
    }
  }
  return result;
}
```

**Output:** `O(n²)` with step-by-step explanation and tip: *"Use a Set for O(n) solution"*

---

## Detected Patterns

| Pattern | Complexity |
|---|---|
| Single loop (`for`, `while`, `.map`, etc.) | O(n) |
| Nested loops | O(n²) |
| Triple nested loops | O(n³) |
| `.sort()` | O(n log n) |
| Recursive functions | O(2^n) |
| `Map` / `Set` lookups | O(1) |
| `.indexOf()`, `.includes()` | O(n) |
| Binary search pattern | O(log n) |

---

## Settings

| Setting | Default | Description |
|---|---|---|
| `complexityAnalyzer.showInlineDecorations` | `true` | Show hints inline in editor |
| `complexityAnalyzer.highlightLines` | `true` | Highlight contributing lines |

---

##  Installation

### Install the Extension

1. Go to the Releases page

https://github.com/chaithra-p-codes/complexity-analyzer/releases

2. Download the file:

complexity-analyzer-1.0.0.vsix

3. Open VS Code

4. Go to Extensions

5. Click the ⋯ (three dots) menu in the Extensions panel

6. Select "Install from VSIX"

7. Choose the downloaded .vsix file

The Complexity Analyzer extension will now be installed in VS Code.

## Built With

- **JavaScript** — zero dependencies, pure Node.js + VS Code API
- **VS Code Extension API** — decorations, webview panels, commands
- **Custom AST-like parser** — regex + brace-depth tracking

---

## Author
**Chaithra P**
- LinkedIn: https://www.linkedin.com/in/chaithra-p-codes 
- Extension: [Complexity Analyzer on VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=YOUR_PUBLISHER_ID.complexity-analyzer)
