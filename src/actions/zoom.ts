import { action, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.zoom-in" })
export class ZoomIn extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Zoom\nIn");
  }

  override async onKeyDown() {
    await sendAVTTCommand({ command: "zoomIn" });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.zoom-out" })
export class ZoomOut extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Zoom\nOut");
  }

  override async onKeyDown() {
    await sendAVTTCommand({ command: "zoomOut" });
  }
}
