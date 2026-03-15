const vscode = require('vscode');
const { analyzeCode } = require('./analyzer');
const { getWebviewContent } = require('./webview');

// Supported Languages 

const SUPPORTED_LANGUAGES = {
  javascript:  { label: 'JavaScript',  icon: '' },
  typescript:  { label: 'TypeScript',  icon: '' },
  python:      { label: 'Python',      icon: '' },
  java:        { label: 'Java',        icon: '' },
  c:           { label: 'C',           icon: ''  },
  cpp:         { label: 'C++',         icon: ''  },
};

const WHEN_CLAUSE = Object.keys(SUPPORTED_LANGUAGES)
  .map(l => `editorLangId == ${l}`)
  .join(' || ');

// Decoration Types 

const decorationTypes = {
  low:      vscode.window.createTextEditorDecorationType({ after: { color: '#22c55e99', margin: '0 0 0 16px', fontStyle: 'italic', fontSize: '11px' }, borderLeft: '2px solid #22c55e40' }),
  medium:   vscode.window.createTextEditorDecorationType({ after: { color: '#f59e0b99', margin: '0 0 0 16px', fontStyle: 'italic', fontSize: '11px' }, borderLeft: '2px solid #f59e0b40' }),
  high:     vscode.window.createTextEditorDecorationType({ after: { color: '#f9731699', margin: '0 0 0 16px', fontStyle: 'italic', fontSize: '11px' }, borderLeft: '2px solid #f9731640' }),
  critical: vscode.window.createTextEditorDecorationType({ after: { color: '#ef444499', margin: '0 0 0 16px', fontStyle: 'italic', fontSize: '11px' }, borderLeft: '2px solid #ef444440' }),
};

// Activate 

function activate(context) {
  console.log('Complexity Analyzer (multi-language) is active!');

  context.subscriptions.push(
    vscode.commands.registerCommand('complexityAnalyzer.analyze', () => runAnalysis(context, false)),
    vscode.commands.registerCommand('complexityAnalyzer.analyzeSelection', () => runAnalysis(context, true))
  );
}

//Main Runner

function runAnalysis(context, selectionOnly) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { vscode.window.showErrorMessage(' No active editor found!'); return; }

  const langId = editor.document.languageId;
  console.log('Detected language: ',langId);
  if (!SUPPORTED_LANGUAGES[langId]) {
    const supported = Object.values(SUPPORTED_LANGUAGES).map(l => l.label).join(', ');
    vscode.window.showWarningMessage(`Complexity Analyzer supports: ${supported}`);
    return;
  }

  let code, startLine = 0;
  if (selectionOnly && !editor.selection.isEmpty) {
    code = editor.document.getText(editor.selection);
    startLine = editor.selection.start.line;
  } else {
    code = editor.document.getText();
  }

  if (!code.trim()) { vscode.window.showWarningMessage('No code to analyze!'); return; }

  const result = analyzeCode(code, langId);

  // Adjust line numbers for selection
  if (selectionOnly && startLine > 0) {
    result.functions.forEach(fn => {
      fn.startLine += startLine;
      fn.endLine += startLine;
      fn.steps.forEach(s => s.lineNum += startLine);
    });
    result.steps.forEach(s => s.lineNum += startLine);
  }

  const config = vscode.workspace.getConfiguration('complexityAnalyzer');
  if (!result || !result.steps) {
  vscode.window.showErrorMessage('Analysis failed — could not parse code structure.');
  return;
}
if (config.get('showInlineDecorations', true)) applyDecorations(editor, result);
  if (config.get('showInlineDecorations', true)) applyDecorations(editor, result);

  showWebviewPanel(context, result, langId);
}

// Decorations 

function applyDecorations(editor, result) {
  const byType = { low: [], medium: [], high: [], critical: [] };

  for (const step of result.steps || []) {
    const lineIndex = step.lineNum - 1;
    if (lineIndex < 0 || lineIndex >= editor.document.lineCount) continue;
    const line = editor.document.lineAt(lineIndex);
    const range = new vscode.Range(lineIndex, line.range.end.character, lineIndex, line.range.end.character);
    const decoration = { range, renderOptions: { after: { contentText: ` ← ${step.complexity} (${step.label})` } } };
    const sev = step.severity || 'medium';
    if (byType[sev]) byType[sev].push(decoration);
  }

  for (const [type, decs] of Object.entries(byType)) {
    editor.setDecorations(decorationTypes[type], decs);
  }
}

//Webview Panel 

let currentPanel = null;

function showWebviewPanel(context, result, langId) {
  const col = vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.One;
  const langInfo = SUPPORTED_LANGUAGES[langId];

  if (currentPanel) {
    currentPanel.reveal(col);
  } else {
    currentPanel = vscode.window.createWebviewPanel(
      'complexityAnalyzer',
      `Complexity — ${langInfo.label}`,
      col,
      { enableScripts: true, retainContextWhenHidden: true }
    );
    currentPanel.onDidDispose(() => {
      currentPanel = null;
      if (vscode.window.activeTextEditor) {
        for (const d of Object.values(decorationTypes)) editor.setDecorations(d, []);
      }
    }, null, context.subscriptions);
  }

  currentPanel.title = `${langInfo.icon} ${langInfo.label} Complexity`;
  currentPanel.webview.html = getWebviewContent(result, langInfo);
}

function deactivate() {
  for (const d of Object.values(decorationTypes)) d.dispose();
}

module.exports = { activate, deactivate };
