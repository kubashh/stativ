import { build } from "./build/build";
import { dev } from "./dev/dev";

export async function cli() {
  if (process.argv[2] === `build`) {
    await build({
      entry: arg(`--entry`),
      outdir: arg(`--outdir`),
      tailwindcss: flag(`--tailwind`),
      clearPrev: !flag(`--no-clear-prev`),
      dev: flag(`--dev`),
    });
  } else if (process.argv[2] === `dev`) {
    await dev({
      entry: (await import(process.argv[3] || `./src/app/index.html`)).default, // It may break!!!
    });
  }
  process.exit();
}

function flag(flag: string) {
  return process.argv.includes(flag);
}

function arg(name: string) {
  const flag = process.argv.find((arg) => arg.startsWith(name));
  return flag ? flag.split(`=`)[1]! : undefined;
}
