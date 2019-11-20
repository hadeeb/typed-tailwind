const path = require("path");
const test = require("ava").default;
const { rollup } = require("rollup");
const { typedtailwind } = require("..");

test("rollup-plugin", async function(t) {
  const bundle = await rollup({
    input: path.resolve(__dirname, "fixture.js"),
    plugins: [
      typedtailwind({
        config: path.resolve(__dirname, "Tw.js")
      })
    ]
  });
  const result = await bundle.generate({ format: "cjs" });
  t.deepEqual(
    result.output[0].code,
    `'use strict';\n\n` + `module.exports = "block relative";\n`
  );
});
