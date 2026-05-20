import fs from "fs";

export async function build(options: BuildOptions) {
  console.log(options);
  const buildConfig: Bun.BuildConfig = {
    entrypoints: [options.entry || `./app/index.html`],
    outdir: options.outdir || `./dist`,
    // @ts-ignore
    // plugins: options.tailwindcss ? [(await import("bun-plugin-tailwind")).default] : undefined,
    minify: !options.dev,
    target: `browser`,
    define: {
      "process.env.NODE_ENV": `"production"`,
    },
  };

  // Cleaning
  if (options.clearPrev !== false) {
    fs.rmSync(options.outdir || `./dist`, {
      recursive: true,
      force: true,
    });
  }

  // Build all the HTML files
  const { outputs } = await Bun.build(buildConfig);

  // Minify & adjust html for each entry
  if (!options.dev) {
    outputs.forEach(async (output) => {
      if (output.path.endsWith(`.html`)) {
        await Bun.write(output.path, minifyHtml(await output.text()));
      }
    });
  }
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

type BuildOptions = {
  entry?: string;
  outdir?: string;
  tailwindcss?: boolean;
  clearPrev?: boolean;
  dev?: boolean;
};
