import {
  action,
  KeyDownEvent,
  SingletonAction
} from "@elgato/streamdeck";

import { sendAVTTCommand } from "../lib/avtt-client";

type Settings = {
  size?: number;
};

@action({
  UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.set-token-size"
})
export class SetTokenSizeAction extends SingletonAction<Settings> {

  override async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
    const size = Number(ev.payload.settings.size ?? 1);

    await sendAVTTCommand({
      command: "setSelectedTokenSize",
      size
    });
  }
}
