import { action } from "@elgato/streamdeck";
import { StaticCommandAction } from "./shared/static-command-action";
import { AVTT_COMMANDS } from "../lib/avtt-commands";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-gamelog-tab" })
export class OpenGameLogTab extends StaticCommandAction {
  protected title = "Game\nLog";
  protected command = AVTT_COMMANDS.OPEN_GAME_LOG_TAB;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-tokens-tab" })
export class OpenTokensTab extends StaticCommandAction {
  protected title = "Tokens";
  protected command = AVTT_COMMANDS.OPEN_TOKENS_TAB;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-scenes-tab" })
export class OpenScenesTab extends StaticCommandAction {
  protected title = "Scenes";
  protected command = AVTT_COMMANDS.OPEN_SCENES_TAB;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-sounds-tab" })
export class OpenSoundsTab extends StaticCommandAction {
  protected title = "Sounds";
  protected command = AVTT_COMMANDS.OPEN_SOUNDS_TAB;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-journal-tab" })
export class OpenJournalTab extends StaticCommandAction {
  protected title = "Journal";
  protected command = AVTT_COMMANDS.OPEN_JOURNAL_TAB;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-settings-tab" })
export class OpenSettingsTab extends StaticCommandAction {
  protected title = "Settings";
  protected command = AVTT_COMMANDS.OPEN_SETTINGS_TAB;
}
