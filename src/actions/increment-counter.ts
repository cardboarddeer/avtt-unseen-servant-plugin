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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "toggleDaylight" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.toggle-marker" })
export class ToggleMarker extends SingletonAction<MarkerSettings> {
  override onWillAppear(ev: WillAppearEvent<MarkerSettings>): void | Promise<void> {
    return ev.action.setTitle(ev.payload.settings.text || "Marker");
  }

  override async onKeyDown(ev: KeyDownEvent<MarkerSettings>): Promise<void> {
    const settings = ev.payload.settings;

    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  command: "toggleMarker",
  color: settings.color || "#ff0000",
  text: settings.text || "Marked"
})
    });

    await ev.action.setTitle(settings.text || "Marker");
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.clear-markers" })
export class ClearMarkers extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>): void | Promise<void> {
    return ev.action.setTitle("Clear\nMarkers");
  }

  override async onKeyDown(ev: KeyDownEvent<{}>): Promise<void> {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "clearMarkers" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.next-initiative" })
export class NextInitiative extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>): void | Promise<void> {
    return ev.action.setTitle("Next\nInit");
  }

  override async onKeyDown(ev: KeyDownEvent<{}>): Promise<void> {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "nextInitiative" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.previous-initiative" })
export class PreviousInitiative extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>): void | Promise<void> {
    return ev.action.setTitle("Prev\nInit");
  }

  override async onKeyDown(ev: KeyDownEvent<{}>): Promise<void> {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "previousInitiative" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-gamelog-tab" })
export class OpenGameLogTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Game\nLog");
  }

  override async onKeyDown() {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "openGameLogTab" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-tokens-tab" })
export class OpenTokensTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Tokens");
  }

  override async onKeyDown() {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "openTokensTab" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-scenes-tab" })
export class OpenScenesTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Scenes");
  }

  override async onKeyDown() {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "openScenesTab" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-sounds-tab" })
export class OpenSoundsTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Sounds");
  }

  override async onKeyDown() {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "openSoundsTab" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-journal-tab" })
export class OpenJournalTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Journal");
  }

  override async onKeyDown() {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "openJournalTab" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.open-settings-tab" })
export class OpenSettingsTab extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Settings");
  }

  override async onKeyDown() {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "openSettingsTab" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.zoom-in" })
export class ZoomIn extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Zoom\nIn");
  }

  override async onKeyDown() {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "zoomIn" })
    });
  }
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.zoom-out" })
export class ZoomOut extends SingletonAction<{}> {
  override onWillAppear(ev: WillAppearEvent<{}>) {
    return ev.action.setTitle("Zoom\nOut");
  }

  override async onKeyDown() {
    await fetch("http://localhost:3000/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "zoomOut" })
    });
  }
}

type RollSelectedFormulaSettings = {
  formula?: string;
  label?: string;
  rollType?: "to hit" | "damage" | "save" | "check" | "heal" | "reroll" | "initiative" | "attack" | "roll" | "recharge";
};

async function sendAVTTCommand(command: any) {
  await fetch("http://localhost:3000/command", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...command,
      time: Date.now()
    })
  });
}

@action({ UUID: "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.roll-selected-formula" })
export class RollSelectedFormula extends SingletonAction<RollSelectedFormulaSettings> {
  override async onKeyDown(ev: any) {
    const settings = ev.payload.settings || {};

    await sendAVTTCommand({
      command: "rollSelectedFormula",
      formula: settings.formula || "1d20",
      label: settings.label || "Selected Token Roll",
      rollType: settings.rollType || "check"
    });
  }
}

type MarkerSettings = {
  color?: string;
  text?: string;
};

type RollSettings = {
  expression?: string;
  rollType?: string;
  action?: string;
  damageType?: string;
};