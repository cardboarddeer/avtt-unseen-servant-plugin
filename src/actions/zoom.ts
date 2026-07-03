import { action } from "@elgato/streamdeck";
import { StaticCommandAction } from "./shared/static-command-action";
import { AVTT_COMMANDS } from "../lib/avtt-commands";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.zoom-in" })
export class ZoomIn extends StaticCommandAction {
  protected title = "Zoom\nIn";
  protected command = AVTT_COMMANDS.ZOOM_IN;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.zoom-out" })
export class ZoomOut extends StaticCommandAction {
  protected title = "Zoom\nOut";
  protected command = AVTT_COMMANDS.ZOOM_OUT;
}
