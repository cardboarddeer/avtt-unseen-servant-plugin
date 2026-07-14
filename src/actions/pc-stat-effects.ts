import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import {
  sendAVTTCommand
} from "../lib/avtt-client";

import {
  AVTT_COMMANDS
} from "../lib/avtt-commands";

type PcEffectStat =
  | "armorClass"
  | "speed"
  | "maxHp"
  | "STR"
  | "DEX"
  | "CON"
  | "INT"
  | "WIS"
  | "CHA";

type PcEffectOperation =
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "set";

type PcAcField =
  | "Override AC"
  | "Override Base Armor + DEX"
  | "Additional Magic Bonus"
  | "Additional Misc Bonus";

type PcMovementType =
  | "walking"
  | "burrowing"
  | "climbing"
  | "flying"
  | "swimming";

type PcStatEffectSettings = {
  stat?: PcEffectStat;
  operation?: PcEffectOperation;
  value?: number | string;
  effectName?: string;
  acField?: PcAcField;
  movementType?: PcMovementType;
};

type ClearPcEffectsSettings = {
  scope?: "stat" | "all";
  stat?: PcEffectStat;
};

function statLabel(
  stat?: PcEffectStat
): string {
  const labels:
    Record<PcEffectStat, string> = {
      armorClass: "AC",
      speed: "Speed",
      maxHp: "Max HP",
      STR: "STR",
      DEX: "DEX",
      CON: "CON",
      INT: "INT",
      WIS: "WIS",
      CHA: "CHA"
    };

  return labels[
    stat || "armorClass"
  ];
}

function operationLabel(
  operation?: PcEffectOperation
): string {
  const labels:
    Record<PcEffectOperation, string> = {
      add: "+",
      subtract: "−",
      multiply: "×",
      divide: "÷",
      set: "="
    };

  return labels[
    operation || "add"
  ];
}

function effectTitle(
  settings?: PcStatEffectSettings
): string {
  const stat =
    settings?.stat || "armorClass";

  const operation =
    settings?.operation || "add";

  const value =
    Number(settings?.value ?? 1);

  return (
    `${statLabel(stat)}\n` +
    `${operationLabel(operation)}` +
    `${Number.isFinite(value) ? value : "?"}`
  );
}

function clearTitle(
  settings?: ClearPcEffectsSettings
): string {
  if (settings?.scope === "all") {
    return "Clear\nAll Stats";
  }

  return (
    "Clear\n" +
    statLabel(
      settings?.stat ||
      "armorClass"
    )
  );
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.pc-stat-effect"
})
export class PcStatEffectAction
  extends SingletonAction<PcStatEffectSettings> {

  override async onWillAppear(
    ev: WillAppearEvent<PcStatEffectSettings>
  ): Promise<void> {
    await ev.action.setTitle(
      effectTitle(
        ev.payload.settings
      )
    );
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<PcStatEffectSettings>
  ): Promise<void> {
    await ev.action.setTitle(
      effectTitle(
        ev.payload.settings
      )
    );
  }

  override async onKeyDown(
    ev: KeyDownEvent<PcStatEffectSettings>
  ): Promise<void> {
    const settings =
      ev.payload.settings || {};

    const stat =
      settings.stat ||
      "armorClass";

    const operation =
      settings.operation ||
      "add";

    const value =
      Number(
        settings.value ?? 1
      );

    if (!Number.isFinite(value)) {
      await ev.action.showAlert();
      return;
    }

    const effectName =
      String(
        settings.effectName ||
        "Stream Deck Effect"
      ).trim() ||
      "Stream Deck Effect";

    await sendAVTTCommand({
      command:
        AVTT_COMMANDS.APPLY_PC_STAT_EFFECT,

      stat,
      operation,
      value,
      effectName,

      acField:
        settings.acField ||
        "Override AC",

      movementType:
        settings.movementType ||
        "walking",

      effectId:
        `${stat}:${effectName}`
    });

    await ev.action.setTitle(
      effectTitle(settings)
    );

    await ev.action.showOk();
  }
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.clear-pc-effects"
})
export class ClearPcEffectsAction
  extends SingletonAction<ClearPcEffectsSettings> {

  override async onWillAppear(
    ev: WillAppearEvent<ClearPcEffectsSettings>
  ): Promise<void> {
    await ev.action.setTitle(
      clearTitle(
        ev.payload.settings
      )
    );
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<ClearPcEffectsSettings>
  ): Promise<void> {
    await ev.action.setTitle(
      clearTitle(
        ev.payload.settings
      )
    );
  }

  override async onKeyDown(
    ev: KeyDownEvent<ClearPcEffectsSettings>
  ): Promise<void> {
    const settings =
      ev.payload.settings || {};

    const scope =
      settings.scope === "all"
        ? "all"
        : "stat";

    await sendAVTTCommand({
      command:
        AVTT_COMMANDS.CLEAR_PC_STAT_EFFECTS,

      scope,

      stat:
        settings.stat ||
        "armorClass"
    });

    await ev.action.setTitle(
      clearTitle(settings)
    );

    await ev.action.showOk();
  }
}
