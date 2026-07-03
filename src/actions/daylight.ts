import { action, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.toggle-daylight" })
export class ToggleDaylight extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>): void | Promise<void> {
    return ev.action.setTitle("Toggle\nDaylight");
  }

  override async onKeyDown(ev: KeyDownEvent<{}>): Promise<void> {
    await sendAVTTCommand({ command: "toggleDaylight" });
  }
}
