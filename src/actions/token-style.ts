import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";

type TokenStyle =
  | "circle"
  | "square"
  | "virtualMiniCircle"
  | "virtualMiniSquare"
  | "noConstraint"
  | "definitelyNotAToken"
  | "labelToken"
  | "inPersonMini";

type TokenStyleSettings = {
  style?: TokenStyle;
};

const TOKEN_STYLE_TITLES: Record<TokenStyle, string> = {
  circle: "Circle",
  square: "Square",
  virtualMiniCircle: "Virtual\nMini Round",
  virtualMiniSquare: "Virtual\nMini Square",
  noConstraint: "No\nConstraint",
  definitelyNotAToken: "Not a\nToken",
  labelToken: "Map\nPin",
  inPersonMini: "TV Table\nMini"
};

function getTokenStyle(settings?: TokenStyleSettings): TokenStyle {
  const style = settings?.style;

  if (
    style === "square" ||
    style === "virtualMiniCircle" ||
    style === "virtualMiniSquare" ||
    style === "noConstraint" ||
    style === "definitelyNotAToken" ||
    style === "labelToken" ||
    style === "inPersonMini"
  ) {
    return style;
  }

  return "circle";
}

@action({
  UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.token-style"
})
export class TokenStyleAction extends SingletonAction<TokenStyleSettings> {
  private updateTitle(
    ev:
      | WillAppearEvent<TokenStyleSettings>
      | DidReceiveSettingsEvent<TokenStyleSettings>
      | KeyDownEvent<TokenStyleSettings>
  ): void | Promise<void> {
    const style = getTokenStyle(ev.payload.settings);
    return ev.action.setTitle(TOKEN_STYLE_TITLES[style]);
  }

  override onWillAppear(
    ev: WillAppearEvent<TokenStyleSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<TokenStyleSettings>
  ): void | Promise<void> {
    return this.updateTitle(ev);
  }

  override async onKeyDown(
    ev: KeyDownEvent<TokenStyleSettings>
  ): Promise<void> {
    const style = getTokenStyle(ev.payload.settings);

    await sendAVTTCommand({
      command: AVTT_COMMANDS.SET_TOKEN_STYLE,
      style
    });

    await this.updateTitle(ev);
  }
}
