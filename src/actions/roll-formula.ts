import {
  action,
  DialAction,
  DialDownEvent,
  DialRotateEvent,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  TouchTapEvent,
  WillAppearEvent,
  WillDisappearEvent
} from "@elgato/streamdeck";
import { sendAVTTRoll, sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import { RollSettings, RollSelectedFormulaSettings } from "../types/action-settings";



/*
 * Stream Deck+ dial support for the Basic Dice Roller.
 *
 * Placed directly on a dial (not inside an Action Wheel, where Stream Deck
 * treats it as a key and only sends presses). While idle, turning the dial
 * picks the die (d4 … d100), starting from the Dice Type setting. Tapping the touch strip
 * (or pressing the dial) walks through the steps whose "prompt" option is
 * on, in order — number of dice, bonus, Normal/ADV/DIS — turning the dial
 * to change each value and tapping to move on; the last tap rolls. With
 * no prompts on, a tap just rolls. The values picked are kept (saved to
 * the settings) as the starting point for the next roll.
 */
type DialStep = "idle" | "count" | "bonus" | "mode";
type RollModeChoice = "normal" | "advantage" | "disadvantage";

type DiceType = NonNullable<RollSettings["diceType"]>;

type DialState = {
  step: DialStep;
  dice: DiceType;
  count: number;
  bonus: number;
  mode: RollModeChoice;
  idleTimer?: ReturnType<typeof setTimeout>;
};

const ROLL_MODE_CHOICES: RollModeChoice[] = ["normal", "advantage", "disadvantage"];
const DICE_CHOICES: DiceType[] = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];
const ROLL_MODE_LABELS: Record<RollModeChoice, string> = {
  normal: "Normal",
  advantage: "ADV",
  disadvantage: "DIS"
};

// A half-finished set of prompts goes back to the idle display after this
// long without a turn or tap.
const DIAL_IDLE_TIMEOUT_MS = 20000;

function formatBonus(bonus: number): string {
  return bonus < 0 ? `- ${Math.abs(bonus)}` : `+ ${bonus}`;
}

function readNumber(value: unknown, fallback: number): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function promptSteps(settings: RollSettings): DialStep[] {
  return [
    ...(settings.promptForNumberOfDice === true ? ["count" as const] : []),
    ...(settings.promptForBonus === true ? ["bonus" as const] : []),
    ...(settings.rollMode === "prompt" ? ["mode" as const] : [])
  ];
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.roll" })
export class RollFormulaAction extends SingletonAction<RollSettings> {
  // Per dial (keyed by action instance id).
  private readonly dialStates = new Map<string, DialState>();

  override onWillAppear(ev: WillAppearEvent<RollSettings>): void | Promise<void> {
    if (ev.action.isDial()) {
      return this.resetDial(ev.action, ev.payload.settings || {});
    }

    const title = ev.payload.settings.action || "Roll";
    return ev.action.setTitle(title);
  }

  override onWillDisappear(ev: WillDisappearEvent<RollSettings>): void {
    clearTimeout(this.dialStates.get(ev.action.id)?.idleTimer);
    this.dialStates.delete(ev.action.id);
  }

  // Settings changed in the Property Inspector: back to the idle display
  // with the new values.
  override onDidReceiveSettings(ev: DidReceiveSettingsEvent<RollSettings>): void | Promise<void> {
    if (ev.action.isDial()) {
      return this.resetDial(ev.action, ev.payload.settings || {});
    }
  }

  override async onDialRotate(ev: DialRotateEvent<RollSettings>): Promise<void> {
    const settings = ev.payload.settings || {};
    const state = this.stateFor(ev.action, settings);
    const ticks = ev.payload.ticks;

    // Idle: turning picks the die (old expression-only buttons have none).
    if (state.step === "idle") {
      if (settings.expression && settings.diceType === undefined && settings.numberOfDice === undefined) {
        return;
      }

      const index = Math.max(0, DICE_CHOICES.indexOf(state.dice));
      state.dice = DICE_CHOICES[Math.min(DICE_CHOICES.length - 1, Math.max(0, index + ticks))];
      this.saveDiceSoon(ev.action, settings, state);
      await this.renderDial(ev.action, settings, state);
      return;
    }

    if (state.step === "count") {
      state.count = Math.min(99, Math.max(1, state.count + ticks));
    } else if (state.step === "bonus") {
      state.bonus = Math.min(99, Math.max(-99, state.bonus + ticks));
    } else {
      const index = ROLL_MODE_CHOICES.indexOf(state.mode);
      const length = ROLL_MODE_CHOICES.length;
      state.mode = ROLL_MODE_CHOICES[(((index + ticks) % length) + length) % length];
    }

    this.armIdleTimeout(ev.action, ev.payload.settings || {}, state);
    await this.renderDial(ev.action, ev.payload.settings || {}, state);
  }

  override onDialDown(ev: DialDownEvent<RollSettings>): Promise<void> {
    return this.advanceDial(ev.action, ev.payload.settings || {});
  }

  override onTouchTap(ev: TouchTapEvent<RollSettings>): Promise<void> {
    return this.advanceDial(ev.action, ev.payload.settings || {});
  }

  private stateFor(dial: DialAction<RollSettings>, settings: RollSettings): DialState {
    let state = this.dialStates.get(dial.id);

    if (!state) {
      state = {
        step: "idle",
        dice: settings.diceType || "d20",
        count: Math.max(1, Math.floor(readNumber(settings.numberOfDice, 1))),
        bonus: Math.trunc(readNumber(settings.bonus, 0)),
        mode: settings.lastPromptRollMode || "normal"
      };
      this.dialStates.set(dial.id, state);
    }

    return state;
  }

  private async resetDial(dial: DialAction<RollSettings>, settings: RollSettings): Promise<void> {
    clearTimeout(this.dialStates.get(dial.id)?.idleTimer);
    this.dialStates.delete(dial.id);
    await this.renderDial(dial, settings, this.stateFor(dial, settings));
  }

  // The die picked by turning is saved (a moment after the last turn, not
  // on every click of the dial) so the dial remembers it.
  private readonly diceSaveTimers = new Map<string, ReturnType<typeof setTimeout>>();

  private saveDiceSoon(dial: DialAction<RollSettings>, settings: RollSettings, state: DialState): void {
    clearTimeout(this.diceSaveTimers.get(dial.id));
    this.diceSaveTimers.set(
      dial.id,
      setTimeout(() => {
        this.diceSaveTimers.delete(dial.id);
        void dial.setSettings({ ...settings, diceType: state.dice });
      }, 600)
    );
  }

  private armIdleTimeout(dial: DialAction<RollSettings>, settings: RollSettings, state: DialState): void {
    clearTimeout(state.idleTimer);
    state.idleTimer = setTimeout(() => {
      state.step = "idle";
      void this.renderDial(dial, settings, state);
    }, DIAL_IDLE_TIMEOUT_MS);
  }

  // Tap / press: start the prompts, go to the next one, or roll.
  private async advanceDial(dial: DialAction<RollSettings>, settings: RollSettings): Promise<void> {
    const state = this.stateFor(dial, settings);
    const steps = promptSteps(settings);
    const nextStep =
      state.step === "idle"
        ? steps[0]
        : steps[steps.indexOf(state.step) + 1];

    if (nextStep) {
      state.step = nextStep;
      this.armIdleTimeout(dial, settings, state);
      await this.renderDial(dial, settings, state);
      return;
    }

    clearTimeout(state.idleTimer);
    state.step = "idle";
    await this.rollFromDial(dial, settings, state);
  }

  private async rollFromDial(dial: DialAction<RollSettings>, settings: RollSettings, state: DialState): Promise<void> {
    const diceType = state.dice;
    const rollMode = settings.rollMode === "prompt" ? state.mode : settings.rollMode || "normal";

    // Old buttons that only have an expression roll it as before.
    const usesNewRollSettings =
      settings.diceType !== undefined ||
      settings.numberOfDice !== undefined ||
      settings.bonus !== undefined ||
      settings.promptForNumberOfDice === true ||
      settings.promptForBonus === true;

    if (!usesNewRollSettings && settings.expression) {
      await sendAVTTRoll({
        expression: settings.expression,
        rollType: settings.rollType || "check",
        action: settings.action || "Stream Deck"
      });
    } else {
      // Everything was already chosen on the dial, so no AboveVTT prompts.
      await sendAVTTCommand({
        command: AVTT_COMMANDS.ROLL_WITH_PROMPT,
        diceType,
        numberOfDice: state.count,
        bonus: state.bonus,
        rollMode,
        rollType: settings.rollType || "check",
        action: settings.action || "Stream Deck",
        damageType: settings.damageType
      });
    }

    // Keep what was picked as the starting point for the next roll.
    const updated: RollSettings = { ...settings, diceType: state.dice };

    if (settings.promptForNumberOfDice === true) updated.numberOfDice = state.count;
    if (settings.promptForBonus === true) updated.bonus = state.bonus;
    if (settings.rollMode === "prompt") updated.lastPromptRollMode = state.mode;

    await dial.setSettings(updated);

    await dial.setFeedback({ title: "Rolled", hint: "" });
    setTimeout(() => {
      if (state.step === "idle") {
        void this.renderDial(dial, updated, state);
      }
    }, 1200);
  }

  private async renderDial(dial: DialAction<RollSettings>, settings: RollSettings, state: DialState): Promise<void> {
    const diceType = state.dice;
    const usesExpressionOnly =
      settings.expression && settings.diceType === undefined && settings.numberOfDice === undefined;
    const roll = usesExpressionOnly
      ? String(settings.expression)
      : `${state.count}${diceType}${state.bonus === 0 ? "" : ` ${formatBonus(state.bonus)}`}`;
    const modeLabel =
      settings.rollMode === "prompt"
        ? ROLL_MODE_LABELS[state.mode]
        : ROLL_MODE_LABELS[(settings.rollMode as RollModeChoice) || "normal"];
    const isLastStep = (step: DialStep) => {
      const steps = promptSteps(settings);
      return steps[steps.length - 1] === step;
    };

    const byStep: Record<DialStep, { title: string; value: string; hint: string }> = {
      idle: {
        title: settings.action || "Basic Dice Roller",
        value: roll,
        hint: usesExpressionOnly
          ? "Tap: roll"
          : `${modeLabel === "Normal" ? "Turn: die" : modeLabel} · Tap: ${promptSteps(settings).length ? "start" : "roll"}`
      },
      count: {
        title: "Number of Dice",
        value: `${state.count}${diceType}`,
        hint: `Turn · Tap: ${isLastStep("count") ? "roll" : "next"}`
      },
      bonus: {
        title: "Bonus",
        value: formatBonus(state.bonus),
        hint: `Turn · Tap: ${isLastStep("bonus") ? "roll" : "next"}`
      },
      mode: {
        title: "Roll Mode",
        value: ROLL_MODE_LABELS[state.mode],
        hint: "Turn · Tap: roll"
      }
    };

    await dial.setFeedback({
      icon: "imgs/actions/roll/key@2x.png",
      ...byStep[state.step]
    });
  }

  override async onKeyDown(
    ev: KeyDownEvent<RollSettings>
  ): Promise<void> {
    const settings =
      ev.payload.settings || {};

    /*
     * rollMode is deliberately excluded here: it lives in the same shared
     * Property Inspector as the legacy expression field, and changing it
     * on an old button must not divert that button into the new-format
     * branch below (which ignores settings.expression entirely). Legacy
     * buttons don't support roll mode either way, since sendAVTTRoll's
     * /roll endpoint has no rollMode parameter.
     */
    const usesNewRollSettings =
      settings.diceType !== undefined ||
      settings.numberOfDice !== undefined ||
      settings.bonus !== undefined ||
      settings.promptForNumberOfDice === true ||
      settings.promptForBonus === true;

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
