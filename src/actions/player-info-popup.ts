import {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import {
  sendPlayerInfoPopupCommand
} from "../lib/player-tracker-client";

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.player-info-popup"
})
export class PlayerInfoPopupAction
  extends SingletonAction {
  override async onWillAppear(
    ev: WillAppearEvent
  ): Promise<void> {
    await ev.action.setTitle(
      "Player\nInfo"
    );
  }

  override async onKeyDown(
    ev: KeyDownEvent
  ): Promise<void> {
    try {
      await sendPlayerInfoPopupCommand({
        image: "test-info.png",
        title: "Player Information"
      });

      await ev.action.showOk();
    } catch (error) {
      console.error(
        "Could not open Player Tracker info popup:",
        error
      );

      await ev.action.showAlert();
    }
  }
}
