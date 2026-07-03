import { action } from "@elgato/streamdeck";
import { StaticCommandAction } from "./shared/static-command-action";
import { AVTT_COMMANDS } from "../lib/avtt-commands";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.next-initiative" })
export class NextInitiative extends StaticCommandAction {
  protected title = "Next\nInit";
  protected command = AVTT_COMMANDS.NEXT_INITIATIVE;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.previous-initiative" })
export class PreviousInitiative extends StaticCommandAction {
  protected title = "Prev\nInit";
  protected command = AVTT_COMMANDS.PREVIOUS_INITIATIVE;
}
