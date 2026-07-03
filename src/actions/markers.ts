import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";
import { StaticCommandAction } from "./shared/static-command-action";
import { MarkerSettings } from "../types/action-settings";


@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.toggle-marker" })
export class ToggleMarker extends SingletonAction<MarkerSettings> {
  override onWillAppear(ev: WillAppearEvent<MarkerSettings>): void | Promise<void> {
    return ev.action.setTitle(ev.payload.settings.text || "Marker");
  }

  override async onKeyDown(ev: KeyDownEvent<MarkerSettings>): Promise<void> {
    const settings = ev.payload.settings;

    await sendAVTTCommand({
      command: "toggleMarker",
      color: settings.color || "#ff0000",
      text: settings.text || "Marked"
    });

    await ev.action.setTitle(settings.text || "Marker");
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.clear-markers" })
export class ClearMarkers extends StaticCommandAction {
  protected title = "Clear\nMarkers";
  protected command = "clearMarkers";
}
