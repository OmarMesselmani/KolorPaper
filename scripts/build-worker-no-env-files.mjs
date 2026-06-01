import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const envFileNames = [".env", ".env.local", ".env.production", ".env.production.local"];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const result = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

const envFromFiles = envFileNames.reduce((acc, fileName) => {
  return { ...acc, ...parseEnvFile(path.join(root, fileName)) };
}, {});

const renamedFiles = [];

try {
  for (const fileName of envFileNames) {
    const source = path.join(root, fileName);
    if (!fs.existsSync(source)) continue;

    const backup = path.join(root, `${fileName}.opennext-build-backup`);
    if (fs.existsSync(backup)) {
      throw new Error(`Refusing to overwrite existing backup file: ${backup}`);
    }

    fs.renameSync(source, backup);
    renamedFiles.push({ source, backup });
  }

  const cliPath = path.join(root, "node_modules", "@opennextjs", "cloudflare", "dist", "cli", "index.js");
  const result = spawnSync(process.execPath, [cliPath, "build"], {
    cwd: root,
    env: { ...process.env, ...envFromFiles },
    stdio: "inherit",
  });

  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  for (const { source, backup } of renamedFiles.reverse()) {
    if (fs.existsSync(backup)) {
      fs.renameSync(backup, source);
    }
  }
}
