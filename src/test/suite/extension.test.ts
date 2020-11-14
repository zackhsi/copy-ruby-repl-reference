import * as assert from "assert";
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";

import { NamespaceBuilder } from "../../namespace-builder";

suite("NamespaceBuilder", () => {
  function namespaceEquals(source: string, expected: string) {
    let builder = new NamespaceBuilder(source);
    let result = builder.build();
    assert.deepEqual(result, expected);
  }

  test("handles simple module", () => {
    namespaceEquals("module Mod", "Mod");
  });

  test("handles simple class", () => {
    namespaceEquals("class Klass", "Klass");
  });

  test("handles inherited class", () => {
    namespaceEquals("class Klass < Base", "Klass");
  });

  test("handles nested members", () => {
    let source = ["module Mod", "  class Klass"].join("\n");
    namespaceEquals(source, "Mod::Klass");
  });

  test("handles namespaces", () => {
    let source = ["module Mod::SubMod", "  class Klass"].join("\n");
    namespaceEquals(source, "Mod::SubMod::Klass");
  });

  test("handles instance methods", () => {
    let source = ["module Mod", "  class Klass", "    def instance_m"].join(
      "\n"
    );
    namespaceEquals(source, "Mod::Klass#instance_m");
  });

  test("handles class methods", () => {
    let source = ["module Mod", "  class Klass", "    def self.class_m"].join(
      "\n"
    );
    namespaceEquals(source, "Mod::Klass.class_m");
  });

  test("handles inline private class methods", () => {
    let source = [
      "module Mod",
      "  class Klass",
      "    private_class_method def self.class_m",
    ].join("\n");
    namespaceEquals(source, "Mod::Klass.class_m");
  });

  test("handles class methods under `class << self`", () => {
    let source = [
      "module Mod",
      "  class Klass",
      "    class << self",
      "      def class_m",
    ].join("\n");
    namespaceEquals(source, "Mod::Klass.class_m");
  });

  test("handles class methods under `class << self` with extra noise", () => {
    let source = [
      "module Mod",
      "  class Klass",
      '    SOMETHING = "AAA"',
      "    class << self",
      '      ELSE = "AAA"',
      "      def class_m",
    ].join("\n");
    namespaceEquals(source, "Mod::Klass.class_m");
  });

  test("handles constants", () => {
    let source = ["module Mod", "  class Klass", '    A_CONSTANT = "aaa"'].join(
      "\n"
    );
    namespaceEquals(source, "Mod::Klass::A_CONSTANT");
  });

  test("handles dynamic class assignments", () => {
    let source = [
      "module Mod",
      "  class Klass",
      "    DynKlass = Class.new",
    ].join("\n");
    namespaceEquals(source, "Mod::Klass::DynKlass");
  });

  test("ignores previous class on the same level", () => {
    let source = [
      "module Mod",
      "  class FirstKlass",
      "  end",
      "  class LastKlass",
    ].join("\n");
    namespaceEquals(source, "Mod::LastKlass");
  });

  test("ignores constant on the same level of class", () => {
    let source = ["module Mod", "  CONSTANT = 123", "  class LastKlass"].join(
      "\n"
    );
    namespaceEquals(source, "Mod::LastKlass");
  });

  test("ignores constant on the same level of instance method", () => {
    let source = [
      "module Mod",
      "  class Klass",
      "    CONSTANT = 123",
      "    def instance_m",
    ].join("\n");
    namespaceEquals(source, "Mod::Klass#instance_m");
  });

  test("properly handles dedents", () => {
    let source = [
      "module Mod",
      "  class Klass",
      "    def method",
      '      other_var = "bbb"',
      "    end",
      "    def other_method",
    ].join("\n");
    namespaceEquals(source, "Mod::Klass#other_method");
  });

  test("ignores comments", () => {
    let source = ["module Mod", "  // class Comment", "  class Klass"].join(
      "\n"
    );
    namespaceEquals(source, "Mod::Klass");
  });

  test("ignores empty", () => {
    namespaceEquals("", "");
  });
});

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));
  });
});
