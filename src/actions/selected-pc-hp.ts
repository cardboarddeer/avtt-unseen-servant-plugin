import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent
} from "@elgato/streamdeck";

import {
  getAVTTCombatState,
  sendAVTTCommand
} from "../lib/avtt-client";

import { AVTT_COMMANDS } from "../lib/avtt-commands";

type TrackerPage =
  | "combat"
  | "reference"
  | "abilities";

type SelectedPcHpSettings = {
  refreshSeconds?: number;
  pcName?: string;
  page?: TrackerPage;
};

const timers =
  new Map<string, NodeJS.Timeout>();

const settingsByAction =
  new Map<string, SelectedPcHpSettings>();

const lastImageByAction =
  new Map<string, string>();

function getTrackerPage(
  settings?: SelectedPcHpSettings
): TrackerPage {
  if (
    settings?.page === "reference" ||
    settings?.page === "abilities"
  ) {
    return settings.page;
  }

  return "combat";
}

function findPc(
  state: any,
  pcName?: string
): any {
  if (
    pcName &&
    Array.isArray(state?.pcs)
  ) {
    const wanted =
      pcName.trim().toLowerCase();

    return state.pcs.find(
      (pc: any) =>
        String(pc.name || "")
          .trim()
          .toLowerCase() === wanted
    );
  }

  return state?.selectedToken || null;
}

function fallbackTitle(
  state: any,
  settings: SelectedPcHpSettings
): string {
  const pc =
    findPc(state, settings.pcName);

  if (!pc) {
    return settings.pcName
      ? `${settings.pcName}\nNot Found`
      : "No\nToken";
  }

  const page =
    getTrackerPage(settings);

  if (page === "reference") {
    return `${pc.name || "PC"}\nReference`;
  }

  if (page === "abilities") {
    return `${pc.name || "PC"}\nAbilities`;
  }

  const hp = pc.hp ?? "?";
  const maxHp = pc.maxHp ?? "?";

  const tempHp = pc.tempHp
    ? ` +${pc.tempHp}`
    : "";

  return (
    `${pc.name || "PC"}\n` +
    `${hp}/${maxHp}${tempHp}`
  );
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.selected-pc-hp"
})
export class SelectedPcHpAction
  extends SingletonAction<SelectedPcHpSettings> {

  private async updateCard(
    action: any
  ): Promise<void> {
    try {
      const settings =
        settingsByAction.get(action.id) || {};

      const state =
        await getAVTTCombatState();

      const pc =
        findPc(state, settings.pcName);

      const page =
        getTrackerPage(settings);

      const image =
        pc?.cardImages?.[page] ||
        pc?.cardImage ||
        "";

      if (image) {
        const previous =
          lastImageByAction.get(action.id);

        if (previous !== image) {
          lastImageByAction.set(
            action.id,
            image
          );

          await action.setImage("");
          await action.setImage(image);
        }

        await action.setTitle("");
        return;
      }

      lastImageByAction.delete(
        action.id
      );

      await action.setImage("");

      await action.setTitle(
        fallbackTitle(state, settings)
      );
    } catch {
      await action.setImage("");

      await action.setTitle(
        "Bridge\nOffline"
      );
    }
  }

  private startTimer(
    action: any,
    settings: SelectedPcHpSettings
  ): void {
    const context =
      action.id;

    const oldTimer =
      timers.get(context);

    if (oldTimer) {
      clearInterval(oldTimer);
      timers.delete(context);
    }

    settingsByAction.set(
      context,
      settings || {}
    );

    lastImageByAction.delete(
      context
    );

    const refreshMs = Math.max(
      250,
      Number(
        settings?.refreshSeconds ?? 1
      ) * 1000
    );

    this.updateCard(action);

    const timer = setInterval(() => {
      this.updateCard(action);
    }, refreshMs);

    timers.set(
      context,
      timer
    );
  }

  override async onWillAppear(
    ev: WillAppearEvent<SelectedPcHpSettings>
  ): Promise<void> {
    this.startTimer(
      ev.action,
      ev.payload.settings || {}
    );
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<SelectedPcHpSettings>
  ): Promise<void> {
    this.startTimer(
      ev.action,
      ev.payload.settings || {}
    );
  }

  override async onKeyDown(
    ev: KeyDownEvent<SelectedPcHpSettings>
  ): Promise<void> {
    const settings =
      settingsByAction.get(ev.action.id) ||
      ev.payload.settings ||
      {};

    const pcName =
      settings.pcName?.trim();

    if (!pcName) {
      await ev.action.showAlert();
      return;
    }

    await sendAVTTCommand({
      command:
        AVTT_COMMANDS.SELECT_TOKEN,

      tokenName:
        pcName
    });

    await this.updateCard(
      ev.action
    );
  }

  override onWillDisappear(
    ev: WillDisappearEvent<SelectedPcHpSettings>
  ): void {
    const context =
      ev.action.id;

    const timer =
      timers.get(context);

    if (timer) {
      clearInterval(timer);
      timers.delete(context);
    }

    settingsByAction.delete(
      context
    );

    lastImageByAction.delete(
      context
    );
  }
}
