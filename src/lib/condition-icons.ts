import fs from "node:fs";
import path from "node:path";

const CONDITION_ICON_FILES: Record<string, string> = {
  Blinded: "blinded.svg",
  Charmed: "charmed.svg",
  Deafened: "deafened.svg",
  Exhaustion: "exhaustion.svg",
  Frightened: "frightened.svg",
  Grappled: "grappled.svg",
  Incapacitated: "incapacitated.svg",
  Invisible: "invisible.svg",
  Paralyzed: "paralyzed.svg",
  Petrified: "petrified.svg",
  Poisoned: "poisoned.svg",
  Prone: "prone.svg",
  Restrained: "restrained.svg",
  Stunned: "stunned.svg",
  Unconscious: "unconscious.svg",

  "Concentration(Reminder)": "concentration.svg",
  "Reaction Used": "reaction-used.svg",
  Flying: "flying.svg",
  Burning: "burning.svg",
  Rage: "rage.svg",
  Blessed: "blessed.svg",
  Baned: "baned.svg",
  Bloodied: "bloodied.svg",
  Advantage: "advantage.svg",
  Disadvantage: "disadvantage.svg",
  "Bardic Inspiration": "bardic-inspiration.svg",
  Hasted: "hasted.svg"
};

export function getConditionIconDataUrl(condition: string | undefined): string | undefined {
  if (!condition) return undefined;

  const filename = CONDITION_ICON_FILES[condition];
  if (!filename) return undefined;

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
