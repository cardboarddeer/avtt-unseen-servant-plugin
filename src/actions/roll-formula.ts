import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { sendAVTTRoll, sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import { RollSettings, RollSelectedFormulaSettings } from "../types/action-settings";



@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.roll" })
export class RollFormulaAction extends SingletonAction<RollSettings> {
  override onWillAppear(ev: WillAppearEvent<RollSettings>): void | Promise<void> {
    const title = ev.payload.settings.action || "Roll";
    return ev.action.setTitle(title);
  }

  override async onKeyDown(
    ev: KeyDownEvent<RollSettings>
  ): Promise<void> {
    const settings =
      ev.payload.settings || {};

    const usesNewRollSettings =
      settings.diceType !== undefined ||
      settings.numberOfDice !== undefined ||
      settings.bonus !== undefined ||
      settings.promptForNumberOfDice === true ||
      settings.promptForBonus === true ||
      settings.rollMode !== undefined;

    /*
     * Preserve existing buttons created before the Property Inspector
     * redesign. Those buttons may only contain an expression setting.
     */
    if (
      !usesNewRollSettings &&
      settings.expression
    ) {
      let legacyRollType =
        settings.rollType ||
        "check";

      if (
        legacyRollType === "damage" &&
        settings.damageType
      ) {
        legacyRollType =
          settings.damageType.toLowerCase() +
          " damage";
      }

      await sendAVTTRoll({
        expression:
          settings.expression,

        rollType:
          legacyRollType,

        action:
          settings.action ||
          "Stream Deck"
      });

      await ev.action.setTitle(
        settings.action ||
        settings.expression
      );

      return;
    }

    const diceType =
      settings.diceType ||
      "d20";

    const numberOfDice =
      Number(
        settings.numberOfDice ?? 1
      );

    const bonus =
      Number(
        settings.bonus ?? 0
      );

    if (
      settings.promptForNumberOfDice !== true &&
      (
        !Number.isFinite(numberOfDice) ||
        numberOfDice < 1
      )
    ) {
      await ev.action.showAlert();
      return;
    }

    if (
      settings.promptForBonus !== true &&
      !Number.isFinite(bonus)
    ) {
      await ev.action.showAlert();
      return;
    }

    await sendAVTTCommand({
      command:
        AVTT_COMMANDS.ROLL_WITH_PROMPT,

      diceType,

      numberOfDice:
        Number.isFinite(numberOfDice)
          ? numberOfDice
          : 1,

      bonus:
        Number.isFinite(bonus)
          ? bonus
          : 0,

      ...(
        settings.promptForNumberOfDice === true
          ? {
              numberOfDicePrompt: {
                title:
                  "Number of Dice",

                label:
                  `How many ${diceType}s should be rolled?`,

                placeholder:
                  "1",

                defaultValue:
                  Number.isFinite(numberOfDice)
                    ? numberOfDice
                    : 1,

                min:
                  1
              }
            }
          : {}
      ),

      ...(
        settings.promptForBonus === true
          ? {
              bonusPrompt: {
                title:
                  "Roll Bonus",

                label:
                  "Enter the roll bonus",

                placeholder:
                  "0",

                defaultValue:
                  Number.isFinite(bonus)
                    ? bonus
                    : 0
              }
            }
          : {}
      ),

      rollMode:
        settings.rollMode ||
        "normal",

      rollType:
        settings.rollType ||
        "check",

      action:
        settings.action ||
        "Stream Deck",

      damageType:
        settings.damageType
    });

    const expressionPreview =
      `${Math.max(
        1,
        Math.floor(
          Number.isFinite(numberOfDice)
            ? numberOfDice
            : 1
        )
      )}${diceType}`;

    await ev.action.setTitle(
      settings.action ||
      expressionPreview
    );
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.roll-selected-formula" })
export class MonsterActionRoll extends SingletonAction<RollSelectedFormulaSettings> {
  override async onKeyDown(ev: any) {
    const settings = ev.payload.settings || {};

    await sendAVTTCommand({
      command: AVTT_COMMANDS.ROLL_SELECTED_FORMULA,
      formula: settings.formula || "1d20",
      label: settings.label || "Selected Token Roll",
      rollType: settings.rollType || "check"
    });
  }
}
