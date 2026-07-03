import { action } from "@elgato/streamdeck";
import { StaticCommandAction } from "./shared/static-command-action";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.toggle-daylight" })
export class ToggleDaylight extends StaticCommandAction {
  protected title = "Toggle\nDaylight";
  protected command = "toggleDaylight";
}
