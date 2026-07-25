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
  VisionTypeSettings
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
export class VisionTypeAction
  extends SingletonAction<VisionTypeSettings> {

  private getSense(
    settings?: VisionTypeSettings
  ): "vision" | "truesight" | "devilsight" {
    if (
      settings?.sense === "truesight" ||
      settings?.sense === "devilsight"
    ) {
      return settings.sense;
    }

    return "vision";
  }

  private getDefaultTitle(
    sense: "vision" | "truesight" | "devilsight",
    feet: string
  ): string {
    const name =
      sense === "truesight"
        ? "Truesight"
        : sense === "devilsight"
          ? "Devil's\nSight"
          : "Darkvision";

    return `${name}\n${feet} ft`;
  }

  private updateTitle(
    ev:
      | WillAppearEvent<VisionTypeSettings>
      | DidReceiveSettingsEvent<VisionTypeSettings>
      | KeyDownEvent<VisionTypeSettings>
  ): void | Promise<void> {
    const settings = ev.payload.settings || {};
    const sense = this.getSense(settings);
    const feet = String(settings.feet || "60");

    return ev.action.setTitle(
      settings.label ||
      this.getDefaultTitle(sense, feet)
    );
  }

  override onWillAppear(
    ev: WillAppearEvent<VisionTypeSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<VisionTypeSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override async onKeyDown(
    ev: KeyDownEvent<VisionTypeSettings>
  ): Promise<void> {
    const settings = ev.payload.settings || {};

    await sendAVTTCommand({
      command: AVTT_COMMANDS.TOGGLE_VISION_TYPE,
      sense: this.getSense(settings),
      feet: String(settings.feet || "60"),

      ...(
        settings.promptForFeet === true
          ? {
              feetPrompt: {
                title:
                  "Vision Radius",

                label:
                  "Enter the vision radius in feet",

                placeholder:
                  "60",

                defaultValue:
                  Number(
                    settings.feet || 60
                  ),

                min:
                  0
              }
            }
          : {}
      ),

      color:
        settings.color ||
        "rgba(142, 142, 142, 1)"
    });

    await this.updateTitle(ev);
  }
}
