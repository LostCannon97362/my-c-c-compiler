import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.compileCOrCpp', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor or file.');
      return;
    }

    const fileUri = editor.document.uri;
    const filePath = fileUri.fsPath;
    const fileExt = path.extname(filePath).toLowerCase();

    if (fileExt !== '.c' && fileExt !== '.cpp' && fileExt !== '.cc') {
      vscode.window.showErrorMessage('Not a C/C++ source file.');
      return;
    }

    let compiler = fileExt === '.c' ? 'gcc' : 'g++';
    let exeName = filePath.replace(/\.(c|cpp|cc)$/i, '');
    let outputFlag = process.platform === 'win32' ? '-o "' + exeName + '.exe"' : '-o "' + exeName + '"';

    const compileCmd = `${compiler} "${filePath}" ${outputFlag}`;
    const terminal = vscode.window.terminals.length > 0
      ? vscode.window.terminals[0]
      : vscode.window.createTerminal("C/C++ Compiler");

    terminal.show();
    terminal.sendText(compileCmd);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}