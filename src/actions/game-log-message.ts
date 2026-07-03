import { action, SingletonAction } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import { GameLogMessageSettings } from "../types/action-settings";


@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.game-log-message" })
export class GameLogMessageAction extends SingletonAction<GameLogMessageSettings> {
  override async onKeyDown(ev: any) {
    const settings = ev.payload.settings || {};

    await sendAVTTCommand({
      command: AVTT_COMMANDS.SEND_TEXT_TO_GAMELOG,
      title: settings.title || "",
      text: settings.text || "",
      headerStyle: settings.headerStyle || "simple"
    });
  }
}
