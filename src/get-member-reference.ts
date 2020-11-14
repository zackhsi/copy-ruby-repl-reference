import * as vscode from 'vscode';
import { Range, Position } from 'vscode';

import { NamespaceBuilder } from './namespace-builder';

export default function getMemberReference() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return;
  }

  const {document, selection} = editor;

  const currentWordSelection = document.getWordRangeAtPosition(selection.active);
  if (!currentWordSelection) {
    return;
  }

  const currentLineNumber = selection.start.line;
  const currentLine = document.lineAt(currentLineNumber);

  const linesUpToSelection = document.getText(new Range(
    new Position(0, 0),
    new Position(currentLineNumber, currentLine.text.length),
  ));
  const builder = new NamespaceBuilder(linesUpToSelection);
  return builder.build();
}