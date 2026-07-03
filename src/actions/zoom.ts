import { action } from "@elgato/streamdeck";
import { StaticCommandAction } from "./shared/static-command-action";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.zoom-in" })
export class ZoomIn extends StaticCommandAction {
  protected title = "Zoom\nIn";
  protected command = "zoomIn";
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.zoom-out" })
export class ZoomOut extends StaticCommandAction {
  protected title = "Zoom\nOut";
  protected command = "zoomOut";
}
