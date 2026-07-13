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

import {
  TokenHpModifierSettings
} from "../types/action-settings";

type HpMode =
  | "damage"
  | "heal"
  | "tempHp";

function normalizeMode(
  value?: string
): HpMode {
  if (
    value === "heal" ||
    value === "tempHp"
  ) {
    return value;
  }

  return "damage";
}

function getDefaultTitle(
  mode: HpMode,
  amount: number
): string {
  if (mode === "heal") {
    return `Heal\n${amount}`;
  }

  if (mode === "tempHp") {
    return `Temp HP\n${amount}`;
  }

  return `Damage\n${amount}`;
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.token-hp-modifier"
})
export class TokenHpModifierAction
  extends SingletonAction<TokenHpModifierSettings> {

  private async updateButton(
    ev:
      | WillAppearEvent<TokenHpModifierSettings>
      | DidReceiveSettingsEvent<TokenHpModifierSettings>
      | KeyDownEvent<TokenHpModifierSettings>
  ): Promise<void> {
    const settings =
      ev.payload.settings || {};

    const mode =
      normalizeMode(settings.mode);

    const amount = Math.max(
      1,
      Number(settings.amount || 1)
    );

    await ev.action.setTitle(
      settings.label ||
      getDefaultTitle(mode, amount)
    );
  }

  override async onWillAppear(
    ev: WillAppearEvent<TokenHpModifierSettings>
  ): Promise<void> {
    await this.updateButton(ev);
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<TokenHpModifierSettings>
  ): Promise<void> {
    await this.updateButton(ev);
  }

  override async onKeyDown(
    ev: KeyDownEvent<TokenHpModifierSettings>
  ): Promise<void> {
    const settings =
      ev.payload.settings || {};

    const mode =
      normalizeMode(settings.mode);

    const amount =
      Number(settings.amount || 0);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      await ev.action.showAlert();
      return;
    }

    try {
      await sendAVTTCommand({
        command:
          AVTT_COMMANDS.MODIFY_SELECTED_TOKEN_HP,

        mode,
        amount
      });

      await ev.action.showOk();
    } catch {
      await ev.action.showAlert();
    }

    await this.updateButton(ev);
  }
}
