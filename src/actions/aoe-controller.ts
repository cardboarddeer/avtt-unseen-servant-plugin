import {
  action,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import {
  sendAVTTCommand
} from "../lib/avtt-client";

import {
  AVTT_COMMANDS
} from "../lib/avtt-commands";

import {
  AoeControllerSettings
} from "../types/action-settings";

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.aoe-controller"
})
export class AoeControllerAction
  extends SingletonAction<AoeControllerSettings> {

  override async onWillAppear(
    ev: WillAppearEvent<AoeControllerSettings>
  ): Promise<void> {
    await ev.action.setTitle("Fire AOE");
  }

  override async onKeyDown(
    ev: KeyDownEvent<AoeControllerSettings>
  ): Promise<void> {
    try {
      await sendAVTTCommand({
        command:
          AVTT_COMMANDS.CREATE_AOE,

        style:
          "fire",

        shape:
          "circle",

        size:
          4,

        lineWidth:
          1,

        name:
          "Fire AOE",

        placement:
          "selected"
      });

      await ev.action.showOk();
    } catch (error) {
      console.error(
        "AOE Controller failed:",
        error
      );

      await ev.action.showAlert();
    }
  }
}
