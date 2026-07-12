import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import {
  LightPresetSettings,
  VisionPresetSettings
} from "../types/action-settings";

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.toggle-light"
})
export class ToggleLightAction extends SingletonAction {
  override onWillAppear(
    ev: WillAppearEvent
  ): void | Promise<void> {
    return ev.action.setTitle("Toggle\nLight");
  }

  override async onKeyDown(): Promise<void> {
    await sendAVTTCommand({
      command: AVTT_COMMANDS.TOGGLE_LIGHT
    });
  }
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.light-preset"
})
export class LightPresetAction
  extends SingletonAction<LightPresetSettings> {

  private updateTitle(
    ev:
      | WillAppearEvent<LightPresetSettings>
      | DidReceiveSettingsEvent<LightPresetSettings>
      | KeyDownEvent<LightPresetSettings>
  ): void | Promise<void> {
    const settings = ev.payload.settings || {};

    return ev.action.setTitle(
      settings.label ||
      settings.presetName ||
      settings.preset?.name ||
      "Light"
    );
  }

  override onWillAppear(
    ev: WillAppearEvent<LightPresetSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<LightPresetSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override async onKeyDown(
    ev: KeyDownEvent<LightPresetSettings>
  ): Promise<void> {
    const settings = ev.payload.settings || {};

    if (!settings.preset) {
      await ev.action.showAlert();
      return;
    }

    await sendAVTTCommand({
      command: AVTT_COMMANDS.TOGGLE_LIGHT_PRESET,

      presetName:
        settings.presetName ||
        settings.preset.name ||
        "",

      preset: settings.preset,

      animationName:
        settings.animationName ||
        settings.animationPreset?.name ||
        "",

      animationPreset:
        settings.animationPreset || null,

      customLightMask:
        settings.customLightMask || "",

      customLightRotate:
        settings.customLightRotate === true,

      customLightRpm:
        settings.customLightRpm || ""
    });

    await this.updateTitle(ev);
  }
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.vision-preset"
})
export class VisionPresetAction
  extends SingletonAction<VisionPresetSettings> {

  private updateTitle(
    ev:
      | WillAppearEvent<VisionPresetSettings>
      | DidReceiveSettingsEvent<VisionPresetSettings>
      | KeyDownEvent<VisionPresetSettings>
  ): void | Promise<void> {
    const settings = ev.payload.settings || {};

    return ev.action.setTitle(
      settings.label || "Vision"
    );
  }

  override onWillAppear(
    ev: WillAppearEvent<VisionPresetSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<VisionPresetSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override async onKeyDown(
    ev: KeyDownEvent<VisionPresetSettings>
  ): Promise<void> {
    const settings = ev.payload.settings || {};

    await sendAVTTCommand({
      command: AVTT_COMMANDS.SET_VISION_PRESET,

      vision: settings.vision || {
        feet: "0",
        color: "rgba(142, 142, 142, 1)"
      },

      truesight: settings.truesight || {
        feet: "0",
        color: "rgba(142, 142, 142, 1)"
      },

      devilsight: settings.devilsight || {
        feet: "0",
        color: "rgba(142, 142, 142, 1)"
      }
    });

    await this.updateTitle(ev);
  }
}
