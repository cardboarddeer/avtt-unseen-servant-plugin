import { action, DidReceiveSettingsEvent, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import { ConditionSettings } from "../types/action-settings";
import { getConditionIconPath } from "../lib/condition-icons";

function getSelectedStatus(settings: ConditionSettings): string {
  if (settings.mode === "clearMarkers") {
    return "Clear Markers";
  }

  if (settings.mode === "customMarker") {
    return settings.markerText?.trim() || "Custom Marker";
  }

  return settings.condition || "Prone";
}

function getButtonTitle(settings: ConditionSettings, status: string): string {
  return settings.label || status;
}

function darkenHexColor(color: string, amount = 0.5): string {
  const hex = color.replace("#", "");

  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return "#770000";
  }

  const r = Math.round(parseInt(hex.slice(0, 2), 16) * amount);
  const g = Math.round(parseInt(hex.slice(2, 4), 16) * amount);
  const b = Math.round(parseInt(hex.slice(4, 6), 16) * amount);

  return `#${[r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")}`;
}

function getMarkerButtonImage(color: string): string {
  const buttonColor = darkenHexColor(color || "#ff0000", 0.5);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 144 144">
      <rect width="144" height="144" fill="${buttonColor}" />
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.condition" })
export class ConditionAction extends SingletonAction<ConditionSettings> {
  private async updateButtonAppearance(ev: WillAppearEvent<ConditionSettings> | KeyDownEvent<ConditionSettings> | DidReceiveSettingsEvent<ConditionSettings>): Promise<void> {
    const settings = ev.payload.settings;
    const status = getSelectedStatus(settings);

    await ev.action.setTitle(getButtonTitle(settings, status));

    const icon = settings.mode === "customMarker"
      ? getMarkerButtonImage(settings.markerColor || "#ff0000")
      : settings.mode === "clearMarkers"
        ? ""
        : getConditionIconPath(status);

    await ev.action.setImage(icon || "");
  }

  override async onWillAppear(ev: WillAppearEvent<ConditionSettings>): Promise<void> {
    await this.updateButtonAppearance(ev);
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<ConditionSettings>): Promise<void> {
    await this.updateButtonAppearance(ev);
  }

  override async onKeyDown(ev: KeyDownEvent<ConditionSettings>): Promise<void> {
    const settings = ev.payload.settings;
    const status = getSelectedStatus(settings);

    if (settings.mode === "clearMarkers") {
      await sendAVTTCommand({
        command: AVTT_COMMANDS.CLEAR_MARKERS
      });
    } else {
      await sendAVTTCommand({
        command: AVTT_COMMANDS.TOGGLE_CONDITION,
        mode: settings.mode || "condition",
        condition: status,
        markerColor: settings.markerColor || "#ff0000",
        markerText: settings.markerText?.trim() || status,
        removeOnTurnStart: settings.removeOnTurnStart === true
      });
    }

    await this.updateButtonAppearance(ev);
  }
}
