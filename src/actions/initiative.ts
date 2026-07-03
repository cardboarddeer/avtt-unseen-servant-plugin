import { action } from "@elgato/streamdeck";
import { StaticCommandAction } from "./shared/static-command-action";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.next-initiative" })
export class NextInitiative extends StaticCommandAction {
  protected title = "Next\nInit";
  protected command = "nextInitiative";
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.previous-initiative" })
export class PreviousInitiative extends StaticCommandAction {
  protected title = "Prev\nInit";
  protected command = "previousInitiative";
}
