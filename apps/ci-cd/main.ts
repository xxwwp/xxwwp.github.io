import child_process = require("node:child_process");

const command = [
  `git clone xxx`, //
  `npm install`,
  `npm run build`,
  `gh-pages -d dist`,
];

const dockerCommand = `
docker run --rm -w /app node:20-alpine sh -c "npm install && npm run build"
`;

function main() {
  child_process.spawn("bash", ["-c", command.join("")]);
}
