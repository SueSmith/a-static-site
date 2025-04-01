const fs = require("fs");
const filepath = "./edge/fastly.toml";
const data = fs.readFileSync(filepath);

// ⚠️ This file writes a Fastly TOML config for your project 🚨

if (data.toString().indexOf(process.env.GITHUB_REPOSITORY) < 0) {
  try {
    fs.writeFileSync(
      filepath,
      `# This file describes a Fastly Compute package. To learn more visit:
# https://developer.fastly.com/reference/fastly-toml/
# Glitch will write this file on project start and publish
# If you change your Glitch project name this file will be overwritten, see TODO.md

authors = ["Glitch"]
description = "Fastly in Glitch"
language = "javascript"
manifest_version = 2
service_id = ""
name = "` +
        process.env.GITHUB_REPOSITORY +
        `"

[scripts]
  build = "npm run build"

[setup.backends."github"] 
  address = "` +
        process.env.GITHUB_USER + `.github.io`"
  description = "GitHub backend"
  port = 443`
    );

    // Bin any previous built versions from remix
//    fs.rmSync("./edge/bin", { recursive: true, force: true });
//    fs.rmSync("./edge/pkg", { recursive: true, force: true });
  } catch (error) {
    console.log(error);
  }
}
