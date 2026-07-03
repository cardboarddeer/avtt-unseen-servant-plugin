import fs from "node:fs";
import path from "node:path";

function conditionToIconFilename(condition: string): string {
  return condition
    .trim()
    .toLowerCase()
    .replace(/\(.*?\)/g, " $& ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") + ".svg";
}

export function getConditionIconDataUrl(condition: string | undefined): string | undefined {
  if (!condition) return undefined;

  const filename = conditionToIconFilename(condition);

  const iconPath = path.join(
    process.cwd(),
    "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.sdPlugin",
    "imgs",
    "conditions",
    filename
  );

  if (!fs.existsSync(iconPath)) return undefined;

  const svg = fs.readFileSync(iconPath, "utf8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
