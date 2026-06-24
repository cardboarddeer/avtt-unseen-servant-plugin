import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.roll" })
export class IncrementCounter extends SingletonAction<RollSettings> {
  override onWillAppear(ev: WillAppearEvent<RollSettings>): void | Promise<void> {
    const title = ev.payload.settings.action || "Roll";
    return ev.action.setTitle(title);
  }

  override async onKeyDown(ev: KeyDownEvent<RollSettings>): Promise<void> {
    const settings = ev.payload.settings;

    let rollType = settings.rollType || "check";

    if (rollType === "damage" && settings.damageType) {
      rollType = settings.damageType.toLowerCase() + " damage";
    }

    const roll = {
      expression: settings.expression || "1d20",
      rollType,
      action: settings.action || "Stream Deck"
    };

    await fetch("http://localhost:3000/roll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(roll)
    });

    await ev.action.setTitle(settings.action || roll.expression);
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.toggle-daylight" })
export class ToggleDaylight extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>): void | Promise<void> {
    return ev.action.setTitle("Toggle\nDaylight");
  }

  override async onKeyDown(ev: KeyDownEvent<{}>): Promise<void> {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        command: "toggleDaylight"
      })
    });
  }
}

type RollSettings = {
  expression?: string;
  rollType?: string;
  action?: string;
  damageType?: string;
};
