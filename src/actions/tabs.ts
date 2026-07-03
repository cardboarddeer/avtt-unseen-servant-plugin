import { action } from "@elgato/streamdeck";
import { StaticCommandAction } from "./shared/static-command-action";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-gamelog-tab" })
export class OpenGameLogTab extends StaticCommandAction {
  protected title = "Game\nLog";
  protected command = "openGameLogTab";
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-tokens-tab" })
export class OpenTokensTab extends StaticCommandAction {
  protected title = "Tokens";
  protected command = "openTokensTab";
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-scenes-tab" })
export class OpenScenesTab extends StaticCommandAction {
  protected title = "Scenes";
  protected command = "openScenesTab";
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-sounds-tab" })
export class OpenSoundsTab extends StaticCommandAction {
  protected title = "Sounds";
  protected command = "openSoundsTab";
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-journal-tab" })
export class OpenJournalTab extends StaticCommandAction {
  protected title = "Journal";
  protected command = "openJournalTab";
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-settings-tab" })
export class OpenSettingsTab extends StaticCommandAction {
  protected title = "Settings";
  protected command = "openSettingsTab";
}
