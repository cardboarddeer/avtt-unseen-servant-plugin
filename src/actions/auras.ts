import { action, KeyDownEvent, SingletonAction, WillAppearEvent, DidReceiveSettingsEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import { AuraPresetSettings } from "../types/action-settings";

function getAuraButtonImage(innerColor = "rgba(80, 120, 255, 0.75)", outerColor = "rgba(80, 120, 255, 0.2)"): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" fill="#101010"/>
      <circle cx="72" cy="72" r="58" fill="${outerColor}"/>
      <circle cx="72" cy="72" r="34" fill="${innerColor}"/>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.toggle-aura" })
export class ToggleAuraAction extends SingletonAction {
  override async onWillAppear(ev: WillAppearEvent): Promise<void> {
    await ev.action.setTitle("Aura");
    await ev.action.setImage(getAuraButtonImage());
  }

  override async onKeyDown(): Promise<void> {
    await sendAVTTCommand({
      command: AVTT_COMMANDS.TOGGLE_AURA
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.aura-preset" })
export class AuraPresetAction extends SingletonAction<AuraPresetSettings> {
  private async updateButton(ev: WillAppearEvent<AuraPresetSettings> | DidReceiveSettingsEvent<AuraPresetSettings> | KeyDownEvent<AuraPresetSettings>): Promise<void> {
    const settings = ev.payload.settings;
    const preset = settings.preset;

    await ev.action.setTitle(settings.label || settings.presetName || preset?.name || "Aura");

    await ev.action.setImage(getAuraButtonImage(
      preset?.aura1?.color || "rgba(80, 120, 255, 0.75)",
      preset?.aura2?.color || "rgba(80, 120, 255, 0.2)"
    ));
  }

  override async onWillAppear(ev: WillAppearEvent<AuraPresetSettings>): Promise<void> {
    await this.updateButton(ev);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<AuraPresetSettings>): Promise<void> {
    await this.updateButton(ev);
  }

  override async onKeyDown(ev: KeyDownEvent<AuraPresetSettings>): Promise<void> {
    const settings = ev.payload.settings;

    await sendAVTTCommand({
      command: AVTT_COMMANDS.TOGGLE_AURA_PRESET,
      presetName: settings.presetName || settings.preset?.name || "",
      preset: settings.preset || null,
      customAuraMask: settings.customAuraMask || "",
      customAuraRotate: settings.customAuraRotate === true
    });

    await this.updateButton(ev);
  }
}
