import { action, SingletonAction } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";

type GameLogMessageSettings = {
  title?: string;
  text?: string;
  headerStyle?: string;
};

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.game-log-message" })
export class GameLogMessageAction extends SingletonAction<GameLogMessageSettings> {
  override async onKeyDown(ev: any) {
    const settings = ev.payload.settings || {};

    await sendAVTTCommand({
      command: "sendTextToGamelog",
      title: settings.title || "",
      text: settings.text || "",
      headerStyle: settings.headerStyle || "simple"
    });
  }
}
