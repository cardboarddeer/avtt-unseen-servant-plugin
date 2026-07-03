import fs from "node:fs";
import path from "node:path";

function conditionToIconFilename(condition: string): string {
  return condition
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getConditionIconPath(condition: string | undefined): string | undefined {
  if (!condition) return undefined;

  const filename = conditionToIconFilename(condition);

  const localSvgPath = path.join(
    process.cwd(),
    "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.sdPlugin",
    "imgs",
    "conditions",
    `${filename}.svg`
  );

  if (!fs.existsSync(localSvgPath)) return undefined;

  return `imgs/conditions/${filename}.svg`;
}
