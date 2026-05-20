export async function dev(options: DevOptions) {
  const { url } = Bun.serve({
    routes: {
      "/": options.entry,
    },
  });

  console.log(`> Server running at ${url}`);
}

type DevOptions = {
  entry: Bun.HTMLBundle;
};
