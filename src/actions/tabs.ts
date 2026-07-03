import { action, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../lib/avtt-client";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-gamelog-tab" })
export class OpenGameLogTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Game\nLog");
  }

  override async onKeyDown() {
    await sendAVTTCommand({ command: "openGameLogTab" });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-tokens-tab" })
export class OpenTokensTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Tokens");
  }

  override async onKeyDown() {
    await sendAVTTCommand({ command: "openTokensTab" });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-scenes-tab" })
export class OpenScenesTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Scenes");
  }

  override async onKeyDown() {
    await sendAVTTCommand({ command: "openScenesTab" });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-sounds-tab" })
export class OpenSoundsTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Sounds");
  }

  override async onKeyDown() {
    await sendAVTTCommand({ command: "openSoundsTab" });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-journal-tab" })
export class OpenJournalTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Journal");
  }

  override async onKeyDown() {
    await sendAVTTCommand({ command: "openJournalTab" });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-settings-tab" })
export class OpenSettingsTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Settings");
  }

  override async onKeyDown() {
    await sendAVTTCommand({ command: "openSettingsTab" });
  }
}
