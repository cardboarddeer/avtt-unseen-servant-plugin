import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent
} from "@elgato/streamdeck";
import { getAVTTCombatState, sendAVTTCommand } from "../lib/avtt-client";

type SelectedPcHpSettings = {
  refreshSeconds?: number;
  pcName?: string;
};

const timers = new Map<string, NodeJS.Timeout>();
const settingsByAction = new Map<string, SelectedPcHpSettings>();
const lastImageByAction = new Map<string, string>();

function findPc(state: any, pcName?: string): any {
  if (pcName && Array.isArray(state?.pcs)) {
    const wanted = pcName.trim().toLowerCase();

    return state.pcs.find((pc: any) =>
      String(pc.name || "").trim().toLowerCase() === wanted
    );
  }

  return state?.selectedToken || null;
}

function hpTitle(state: any, pcName?: string): string {
  const pc = findPc(state, pcName);

  if (!pc) {
    return pcName ? `${pcName}\nNot Found` : "No\nToken";
  }

  const name = pc.name || "PC";
  const hp = pc.hp ?? "?";
  const max = pc.maxHp ?? "?";
  const temp = pc.tempHp ? ` +${pc.tempHp}` : "";

  return `${name}\n${hp}/${max}${temp}`;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.selected-pc-hp" })
export class SelectedPcHpAction extends SingletonAction<SelectedPcHpSettings> {
  private async updateCard(action: any): Promise<void> {
    try {
      const settings = settingsByAction.get(action.id) || {};
      const state = await getAVTTCombatState();
      const pc = findPc(state, settings.pcName);

      if (pc?.cardImage) {
        const previous = lastImageByAction.get(action.id);

        if (previous !== pc.cardImage) {
          lastImageByAction.set(action.id, pc.cardImage);
          await action.setImage("");
          await action.setImage(pc.cardImage);
        }

        await action.setTitle("");
      } else {
        lastImageByAction.delete(action.id);
        await action.setImage("");
        await action.setTitle(hpTitle(state, settings.pcName));
      }
    } catch {
      await action.setTitle("Bridge\nOffline");
    }
  }

  private startTimer(action: any, settings: SelectedPcHpSettings): void {
    const context = action.id;

    const oldTimer = timers.get(context);
    if (oldTimer) {
      clearInterval(oldTimer);
      timers.delete(context);
    }

    settingsByAction.set(context, settings || {});

    const refreshMs = Math.max(
      250,
      Number(settings?.refreshSeconds ?? 0.5) * 1000
    );

    this.updateCard(action);

    const timer = setInterval(() => {
      this.updateCard(action);
    }, refreshMs);

    timers.set(context, timer);
  }

  override async onWillAppear(ev: WillAppearEvent<SelectedPcHpSettings>): Promise<void> {
    this.startTimer(ev.action, ev.payload.settings || {});
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<SelectedPcHpSettings>): Promise<void> {
    this.startTimer(ev.action, ev.payload.settings || {});
  }

  override async onKeyDown(ev: KeyDownEvent<SelectedPcHpSettings>): Promise<void> {
    const settings = settingsByAction.get(ev.action.id) || ev.payload.settings || {};
    const pcName = settings.pcName?.trim();

    if (pcName) {
      await sendAVTTCommand({
        command: "selectToken",
        tokenName: pcName
      });
    }

    await this.updateCard(ev.action);
  }

  override onWillDisappear(ev: WillDisappearEvent<SelectedPcHpSettings>): void {
    const context = ev.action.id;

    const timer = timers.get(context);
    if (timer) {
      clearInterval(timer);
      timers.delete(context);
    }

    settingsByAction.delete(context);
    lastImageByAction.delete(context);
  }
}
