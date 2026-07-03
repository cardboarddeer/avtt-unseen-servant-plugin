import { SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTCommand } from "../../lib/avtt-client";

export abstract class StaticCommandAction extends SingletonAction<{}> {
  protected abstract title: string;
  protected abstract command: string;

  override onWillAppear(ev: WillAppearEvent<{}>): void | Promise<void> {
    return ev.action.setTitle(this.title);
  }

  override async onKeyDown(): Promise<void> {
    await sendAVTTCommand({ command: this.command });
  }
}
