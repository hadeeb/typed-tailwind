const { readFileSync } = require("fs");
const ts = require("typescript");
const { createFilter } = require("rollup-pluginutils");

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

function typedtailwind(options = {}) {
  const Tw = getTw(options);

  const filter = createFilter(
    options.include || ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    options.exclude || "node_modules/**"
  );

  return {
    name: "typed-tailwind",
    transform(code, id) {
      if (!filter(id)) return null;
      let convertedCode = code;
      [...code.matchAll(re)].forEach(match => {
        const str = Function("Tw", `"use strict";return (${match[0]})`)(Tw);
        convertedCode = convertedCode.replace(match[0], `"${str}"`);
      });
      return {
        code: convertedCode
      };
    }
  };
}

module.exports.typedtailwind = typedtailwind;
