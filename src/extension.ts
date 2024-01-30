// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "toolboxts" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('toolboxts.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from toolboxts!');
		let panel = vscode.window.createWebviewPanel(
			'toolbox',
			'visual studio toolbox extension',
			vscode.ViewColumn.One,
			{enableScripts: true}
		);
		panel.webview.html = getWebviewContent();
		panel.webview.onDidReceiveMessage(message => {
			switch(message.command)
			{
				case 'alert': 
					vscode.window.showInformationMessage(message.text);
					return;
			}
		});
	});
	
	let disp2 = vscode.commands.registerCommand('toolboxts.myCommand', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('no text editor is active');
			return;
		}
		
		const selection = editor.selection;
		let text = editor.document.getText(selection);
		
		// modify the text
		let lines = text.split('\n');
		lines = lines.map((line, index) => line.trim() + ' ' + (index + 1));
		text = lines.join('\n');
		
		// replace the selection
		await editor.edit(editBuilder => {
			editBuilder.replace(selection, text);
		});
		
		vscode.window.showInformationMessage('text has been modified');
	});
	
	let disp3 = vscode.commands.registerCommand('toolboxts.myCounterCommand', async () => {
		
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('no text editor is active');
			return;
		}
		
		const selection = editor.selection;
		let text = editor.document.getText(selection);
		
		// add the counter
		let counter = 1;

		// start a new edit operation
		await editor.edit(editBuilder => {
			// iterate over each selection
			editor.selections.forEach(selection => {
				// get text
				let text = editor.document.getText(selection);
				
				// modify
				text += ' ' + counter++;
				
				// replace the selection
				editBuilder.replace(selection, text);
			});
		});
		
		vscode.window.showInformationMessage('text has been modified');

	});
	
	context.subscriptions.push(disposable);
	context.subscriptions.push(disp2);
	context.subscriptions.push(disp3);
}

function getWebviewContent()
{
	return `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>cat coding</title>
			<script>
				const vscode = acquireVsCodeApi();
				let cont = 0;
				document.addEventListener('DOMContentLoaded', () => {
					const p1 = document.getElementById('p1');
					p1.style.color = 'yellow';
				});
			</script>
		</head>
		<body>
			<h1>visual studio code</h1>
			<p id='p1'>testing extension</p>
			
			<button onclick="return bla_call();">
				bla hier
			</button>
			
			<script>
				function bla_call() {
					vscode.postMessage({command: 'alert', text: 'ik ben hier '+cont}); 
					cont += 1;
					return;
				}
			</script>

		</body>
		</html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}