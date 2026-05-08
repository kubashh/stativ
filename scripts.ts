import indexHtml from "./template/app/index.html";

const mainPath = `./src/main.ts`;

if (process.argv[2] === `dev`) {
  if (process.argv.includes(`--build`)) {
    await Bun.$`cd template && bun run build`;
  } else {
    await dev();
  }
} else if (process.argv[2] === `build`) {
  if (process.argv.includes(`--elements`)) {
    await buildElements();
  } else {
    await build({
      isPublish: process.argv.includes(`--pub`),
      isClear: process.argv.includes(`--clear`),
    });
  }
}

async function dev() {
  // await build({});
  const { url } = Bun.serve({
    routes: {
      "/": indexHtml,
    },
  });

  console.log(`> Server running at ${url}`);
}

async function build({ isPublish = false, isClear = false, emitTypes = false }: ScriptsBuildProps) {
  if (isPublish) {
    isClear = true;
    emitTypes = true;
  }

  await Promise.all([
    Bun.build({
      entrypoints: [mainPath],
      outdir: `.`,
      naming: `./index.js`,
    }),
    Bun.spawn([
      `tsc`,
      mainPath,
      `--outFile`,
      `./index.d.ts`,
      `--declaration`,
      `--emitDeclarationOnly`,
      // `--outDir`,
      // `.`,
      `--ignoreConfig`,
    ]).exited,
  ]);
}

async function buildElements() {
  const keys = [
    `a`,
    `abbr`,
    `address`,
    `area`,
    `article`,
    `aside`,
    `audio`,
    `b`,
    `base`,
    `bdi`,
    `bdo`,
    `blockquote`,
    `body`,
    `br`,
    `button`,
    `canvas`,
    `caption`,
    `cite`,
    `code`,
    `col`,
    `colgroup`,
    `data`,
    `datalist`,
    `dd`,
    `del`,
    `details`,
    `dfn`,
    `dialog`,
    `div`,
    `dl`,
    `dt`,
    `em`,
    `embed`,
    `fieldset`,
    `figcaption`,
    `figure`,
    `footer`,
    `form`,
    `h1`,
    `h2`,
    `h3`,
    `h4`,
    `h5`,
    `h6`,
    `head`,
    `header`,
    `hgroup`,
    `hr`,
    `html`,
    `i`,
    `iframe`,
    `img`,
    `input`,
    `ins`,
    `kbd`,
    `label`,
    `legend`,
    `li`,
    `link`,
    `main`,
    `map`,
    `mark`,
    `menu`,
    `meta`,
    `meter`,
    `nav`,
    `noscript`,
    `object`,
    `ol`,
    `optgroup`,
    `option`,
    `output`,
    `section`,
    `select`,
    `source`,
    `span`,
    `sub`,
    `summary`,
    `sup`,
    `table`,
    `tbody`,
    `td`,
    `template`,
    `textarea`,
    `tfoot`,
    `th`,
    `thead`,
    `time`,
    `title`,
    `tr`,
    `track`,
    `u`,
    `ul`,
    `video`,
    `wbr`,
  ];

  let buf = ``;
  for (const key of keys) {
    buf += `export function ${key}(props: Stativ.ElemetProps, ...children: Stativ.Element[]): Stativ.Element {
  return ["${key}", props, ...children];
}\n\n`;
  }

  await Bun.write(`./src/elements.ts`, buf.slice(0, -1));
}

type ScriptsBuildProps = {
  isPublish?: boolean;
  isClear?: boolean;
  emitTypes?: boolean;
};
