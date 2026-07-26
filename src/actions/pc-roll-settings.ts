import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import { sendAVTTCommand } from "../lib/avtt-client";
import { PcRollSettingSettings } from "../types/action-settings";

@action({
  UUID:
    "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.pc-roll-setting"
})
export class PcRollSettingAction extends SingletonAction<PcRollSettingSettings> {

  private async updateButton(
    ev:
      | WillAppearEvent<PcRollSettingSettings>
      | DidReceiveSettingsEvent<PcRollSettingSettings>
      | KeyDownEvent<PcRollSettingSettings>
  ) {
    const settings =
      ev.payload.settings;

    await ev.action.setTitle(
      settings.label ||
      settings.setting ||
      "Roll"
    );
  }

  override async onWillAppear(
    ev: WillAppearEvent<PcRollSettingSettings>
  ) {
    await this.updateButton(ev);
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<PcRollSettingSettings>
  ) {
    await this.updateButton(ev);
  }

  override async onKeyDown(
    ev: KeyDownEvent<PcRollSettingSettings>
  ) {
    const settings =
      ev.payload.settings;

    const setting =
      settings.setting ||
      "versatile";

    const value =
      settings.value ||
      "";

    const supportsValuePrompt =
      [
        "hitRoll",
        "damageRoll",
        "checkRoll",
        "saveRoll"
      ].includes(setting);

    const promptForValue =
      supportsValuePrompt &&
      settings.promptForValue === true;

    const settingLabels:
      Record<string, string> = {
        hitRoll:
          "Attack Roll Addition",

        damageRoll:
          "Damage Roll Addition",

        checkRoll:
          "Ability Check Addition",

        saveRoll:
          "Saving Throw Addition"
      };

    await sendAVTTCommand({
      command:
        "applyPcRollSetting",

      setting,

      ...(
        promptForValue
          ? {
              valuePrompt: {
                title:
                  settingLabels[setting] ||
                  "Roll Setting Value",

                label:
                  "Enter the value to add",

                placeholder:
                  "+1d4, -2, PB...",

                defaultValue:
                  value
              }
            }
          : {
              value
            }
      )
    });

    await this.updateButton(ev);
  }
}
