const { readFileSync } = require("fs");
const getOptions = require("loader-utils").getOptions;
const validateOptions = require("schema-utils");
const ts = require("typescript");

const appendClassName = require("./collect").appendClassName;

const schema = {
  type: "object",
  properties: {
    config: { type: "string" },
    collect: { type: "boolean" }
  }
};

const re = /Tw\(\)[\n \w.\(\)]*\$\(\)/g;

const getJsSrc = src => {
  const options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
  return ts.transpileModule(src, options).outputText;
};

const getTw = options => {
  const tsSrc = readFileSync(options.config, "utf-8");
  const jsSrc = getJsSrc(tsSrc);
  const m = new module.constructor();
  m._compile(jsSrc, "tw");
  return m.exports.Tw;
};

module.exports = function(source) {
  const options = getOptions(this);
  validateOptions(schema, options, "Typed Tailwind Loader");
  if (!globalThis.Tw) {
    globalThis.Tw = getTw(options);
  }
  let newSource = source;
  [...source.matchAll(re)].forEach(match => {
    const str = Function(`"use strict";return (${match[0]})`)();
    if (options.collect) {
      str.split(" ").forEach(className => {
        appendClassName(className);
      });
    }
    newSource = newSource.replace(match[0], `"${str}"`);
  });
  return newSource;
};
