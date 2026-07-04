import {
  action,
  DidReceiveSettingsEvent,
  SingletonAction,
  WillAppearEvent,
  WillDisappearEvent
} from "@elgato/streamdeck";
import { getAVTTCombatState } from "../lib/avtt-client";

type SelectedPcHpSettings = {
  refreshSeconds?: number;
  pcName?: string;
};

const timers = new Map<string, NodeJS.Timeout>();
const currentSettings = new Map<string, SelectedPcHpSettings>();

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
  private async updateTitle(action: any): Promise<void> {
    try {
      const settings = currentSettings.get(action.id) || {};
      const state = await getAVTTCombatState();
      const pc = findPc(state, settings.pcName);
      if (pc?.cardImage) {
        await action.setImage(pc.cardImage);
        await action.setTitle("");
      } else {
        await action.setTitle(hpTitle(state, settings.pcName));
      }
    } catch {
      await action.setTitle("Bridge\nOffline");
    }
  }

  override async onWillAppear(ev: WillAppearEvent<SelectedPcHpSettings>): Promise<void> {
    const context = ev.action.id;
    currentSettings.set(context, ev.payload.settings || {});

    const refreshMs = Math.max(1, Number(ev.payload.settings.refreshSeconds || 1)) * 1000;

    await this.updateTitle(ev.action);

    timers.set(context, setInterval(() => {
      this.updateTitle(ev.action);
    }, refreshMs));
  }

  override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<SelectedPcHpSettings>): Promise<void> {
    currentSettings.set(ev.action.id, ev.payload.settings || {});
    await this.updateTitle(ev.action);
  }

  override onWillDisappear(ev: WillDisappearEvent<SelectedPcHpSettings>): void {
    const context = ev.action.id;
    const timer = timers.get(context);

    if (timer) {
      clearInterval(timer);
      timers.delete(context);
    }

    currentSettings.delete(context);
  }
}
