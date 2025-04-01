import { resolve } from "path";
import { defineConfig } from "vite";

import handlebars from "vite-plugin-handlebars";
const geoip = require("geoip-lite");
const { Resolver } = require("node:dns").promises;
const resolver = new Resolver();

let getip = async function () {
  const addresses = await resolver.resolve4(
    "http://" + process.env.GITHUB_USER + ".glitch.me/" + process.env.GITHUB_REPOSITORY
  );
  let geoinfo = geoip.lookup(addresses[0]);
  return (
    "This website is being served from " + geoinfo.city + " " + geoinfo.country 
  );
};

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  return {
    plugins: [
      handlebars({
        context: {
          origin: await getip(),
        },
      }),
    ],
    build: {
      cssCodeSplit: false,
      outDir: "build",
    },
    server: {
      host: "127.0.0.1",
      port: 3000,
      strictPort: true,
      hmr: {
        overlay: false,
      },
    },
  };
});
