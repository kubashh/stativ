import fs from "fs";

await build();

async function build() {
  const plugin = await import("bun-plugin-tailwind");
  const buildConfig: Bun.BuildConfig = {
    entrypoints: [`./app/index.html`],
    outdir: `./dist`,
    plugins: [plugin.default],
    minify: true,
    target: `browser`,
    define: {
      "process.env.NODE_ENV": `"production"`,
    },
  };

  // Cleaning
  fs.rmSync(`./dist`, {
    recursive: true,
    force: true,
  });

  // Build all the HTML files
  const { outputs } = await Bun.build(buildConfig);

  // Minify & adjust html for each entry
  outputs.forEach(async (output) => {
    if (output.path.endsWith(`.html`)) {
      await Bun.write(output.path, minifyHtml(await output.text()));
    }
  });
}

function minifyHtml(text: string) {
  return text
    .replaceAll(`\n`, ` `)
    .replaceAll(/\s{2,}/g, ` `)
    .replaceAll(/ > | >|> /g, `>`)
    .replaceAll(/ < | <|< /g, `<`)
    .replaceAll(/ ; | ;|; /g, `;`)
    .replaceAll(/ { | {|{ /g, `{`)
    .replaceAll(/ } | }|} /g, `}`)
    .replaceAll(/ " | "|" /g, `"`)
    .replaceAll(/ , | ,|, /g, `,`);
}
