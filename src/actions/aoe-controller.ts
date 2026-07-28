import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import {
  sendAVTTCommand
} from "../lib/avtt-client";

import {
  AVTT_COMMANDS
} from "../lib/avtt-commands";

import {
  AoeControllerSettings
} from "../types/action-settings";

const DEFAULT_STYLE = "default";
const DEFAULT_SHAPE = "circle";
const DEFAULT_SIZE_FEET = 20;
const DEFAULT_LINE_WIDTH_FEET = 5;
const FEET_PER_SQUARE = 5;

function getStyle(
  settings: AoeControllerSettings
): string {
  return settings.style || DEFAULT_STYLE;
}

function getShape(
  settings: AoeControllerSettings
): "circle" | "square" | "cone" | "line" {
  return settings.shape || DEFAULT_SHAPE;
}

function getPositiveNumber(
  value: unknown,
  fallback: number
): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function getSizeFeet(
  settings: AoeControllerSettings
): number {
  return getPositiveNumber(
    settings.size,
    DEFAULT_SIZE_FEET
  );
}

function getLineWidthFeet(
  settings: AoeControllerSettings
): number {
  return getPositiveNumber(
    settings.lineWidth,
    DEFAULT_LINE_WIDTH_FEET
  );
}

function formatStyle(style: string): string {
  if (style === "default") {
    return "Default";
  }

  return style
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, character =>
      character.toUpperCase()
    );
}

function getButtonTitle(
  settings: AoeControllerSettings
): string {
  const style = formatStyle(getStyle(settings));
  const sizeFeet = getSizeFeet(settings);

  return `${style}\n${sizeFeet} ft`;
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.aoe-controller"
})
export class AoeControllerAction
  extends SingletonAction<AoeControllerSettings> {

  private async updateButton(
    ev:
      | WillAppearEvent<AoeControllerSettings>
      | DidReceiveSettingsEvent<AoeControllerSettings>
  ): Promise<void> {
    await ev.action.setTitle(
      getButtonTitle(ev.payload.settings || {})
    );
  }

  override async onWillAppear(
    ev: WillAppearEvent<AoeControllerSettings>
  ): Promise<void> {
    await this.updateButton(ev);
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<AoeControllerSettings>
  ): Promise<void> {
    await this.updateButton(ev);
  }

  override async onKeyDown(
    ev: KeyDownEvent<AoeControllerSettings>
  ): Promise<void> {
    const settings = ev.payload.settings || {};

    const style = getStyle(settings);
    const shape = getShape(settings);
    const sizeFeet = getSizeFeet(settings);
    const lineWidthFeet =
      getLineWidthFeet(settings);

    const promptForStyle =
      settings.promptForStyle === true;

    const promptForShape =
      settings.promptForShape === true;

    const promptForSize =
      settings.promptForSize === true;

    const promptForLineWidth =
      settings.promptForLineWidth === true;

    const sizeSquares =
      sizeFeet / FEET_PER_SQUARE;

    const lineWidthSquares =
      lineWidthFeet / FEET_PER_SQUARE;

    console.log("AOE Controller:", {
      style,
      shape,
      sizeFeet,
      lineWidthFeet,
      sizeSquares,
      lineWidthSquares,
      promptForStyle,
      promptForShape,
      promptForSize,
      promptForLineWidth
    });

    try {
      await sendAVTTCommand({
        command:
          AVTT_COMMANDS.CREATE_AOE,

        style,

        shape,

        size:
          sizeSquares,

        lineWidth:
          lineWidthSquares,

        promptForStyle,
        promptForShape,
        promptForSize,
        promptForLineWidth,

        name:
          style === "default"
            ? ""
            : formatStyle(style),

        placement:
          "selected"
      });

      await ev.action.showOk();
    } catch (error) {
      console.error(
        "AOE Controller failed:",
        error
      );

      await ev.action.showAlert();
    }
  }
}
