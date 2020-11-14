// import * as vscode from 'vscode';

import { PathParser, Member } from "./path-parser";

export class NamespaceBuilder {
  source: string;
  parser: PathParser;

  constructor(source: string) {
    this.source = source;
    this.parser = new PathParser(source);
  }

  build() : string {
    const members = this.parser.parse();
    if (members.length === 0) {
      return '';
    }

    const [first, ...others] : Array<Member> = members;
    const parts = others.map(member => [member.separator, member.name]);
    return [first.name].concat(...parts).join('');
  }
}