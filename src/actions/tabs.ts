import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";

type TabName =
  | "gamelog"
  | "tokens"
  | "scenes"
  | "sounds"
  | "journal"
  | "settings";

type TabSettings = {
  tab?: TabName;
};

const TAB_COMMANDS: Record<TabName, string> = {
  gamelog: AVTT_COMMANDS.OPEN_GAME_LOG_TAB,
  tokens: AVTT_COMMANDS.OPEN_TOKENS_TAB,
  scenes: AVTT_COMMANDS.OPEN_SCENES_TAB,
  sounds: AVTT_COMMANDS.OPEN_SOUNDS_TAB,
  journal: AVTT_COMMANDS.OPEN_JOURNAL_TAB,
  settings: AVTT_COMMANDS.OPEN_SETTINGS_TAB
};

const TAB_TITLES: Record<TabName, string> = {
  gamelog: "Game\nLog",
  tokens: "Tokens",
  scenes: "Scenes",
  sounds: "Sounds",
  journal: "Journal",
  settings: "Settings"
};

function getTab(settings?: TabSettings): TabName {
  const tab = settings?.tab;

  if (
    tab === "tokens" ||
    tab === "scenes" ||
    tab === "sounds" ||
    tab === "journal" ||
    tab === "settings"
  ) {
    return tab;
  }

  return "gamelog";
}

@action({
  UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-tab"
})
export class OpenTabAction extends SingletonAction<TabSettings> {
  override onWillAppear(
    ev: WillAppearEvent<TabSettings>
  ): void | Promise<void> {
    return ev.action.setTitle(TAB_TITLES[getTab(ev.payload.settings)]);
  }

  override onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<TabSettings>
  ): void | Promise<void> {
    return ev.action.setTitle(TAB_TITLES[getTab(ev.payload.settings)]);
  }

  override async onKeyDown(
    ev: KeyDownEvent<TabSettings>
  ): Promise<void> {
    const tab = getTab(ev.payload.settings);

    await sendAVTTCommand({
      command: TAB_COMMANDS[tab]
    });

    await ev.action.setTitle(TAB_TITLES[tab]);
  }
}
