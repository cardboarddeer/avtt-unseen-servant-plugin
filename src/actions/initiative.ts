import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.next-initiative" })
export class NextInitiative extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>): void | Promise<void> {
    return ev.action.setTitle("Next\nInit");
  }

  override async onKeyDown(ev: KeyDownEvent<{}>): Promise<void> {
    await sendAVTTCommand({ command: "nextInitiative" });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.previous-initiative" })
export class PreviousInitiative extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>): void | Promise<void> {
    return ev.action.setTitle("Prev\nInit");
  }

  override async onKeyDown(ev: KeyDownEvent<{}>): Promise<void> {
    await sendAVTTCommand({ command: "previousInitiative" });
  }
}
