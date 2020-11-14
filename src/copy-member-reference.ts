import * as vscode from 'vscode';
import * as clipboardy from 'clipboardy';

import getMemberReference from './get-member-reference';

export default function copyMemberReference() {
  const memberReference = getMemberReference();
  if (!memberReference) {
    vscode.window.showInformationMessage('Failed to find member reference', {modal: true});
    return;
  }

  clipboardy.writeSync(memberReference);

  vscode.window.showInformationMessage(`${memberReference} copied to clipboard`, {modal: true});
}
