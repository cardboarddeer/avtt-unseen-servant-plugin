import { action, SingletonAction, WillAppearEvent, WillDisappearEvent } from "@elgato/streamdeck";
import { getAVTTCombatState } from "../lib/avtt-client";

type SelectedPcHpSettings = {
  refreshSeconds?: number;
};

const timers = new Map<string, NodeJS.Timeout>();

function hpTitle(state: any): string {
  if (!state?.selected) return "No\nToken";

  const name = state.name || "Token";
  const hp = state.hp ?? "?";
  const max = state.maxHp ?? "?";
  const temp = state.tempHp ? ` +${state.tempHp}` : "";

  return `${name}\n${hp}/${max}${temp}`;
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.selected-pc-hp" })
export class SelectedPcHpAction extends SingletonAction<SelectedPcHpSettings> {
  override async onWillAppear(ev: WillAppearEvent<SelectedPcHpSettings>): Promise<void> {
    const context = ev.action.id;
    const refreshMs = Math.max(1, Number(ev.payload.settings.refreshSeconds || 1)) * 1000;

    const update = async () => {
      try {
        const state = await getAVTTCombatState();
        await ev.action.setTitle(hpTitle(state));
      } catch {
        await ev.action.setTitle("Bridge\nOffline");
      }
    };

    await update();

    timers.set(context, setInterval(update, refreshMs));
  }

  override onWillDisappear(ev: WillDisappearEvent<SelectedPcHpSettings>): void {
    const context = ev.action.id;
    const timer = timers.get(context);

    if (timer) {
      clearInterval(timer);
      timers.delete(context);
    }
  }
}
