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

    await sendAVTTCommand({
      command:
        "applyPcRollSetting",

      setting:
        settings.setting,

      value:
        settings.value
    });

    await this.updateButton(ev);
  }
}
