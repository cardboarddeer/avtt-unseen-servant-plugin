import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SendToPluginEvent,
  SingletonAction,
  WillAppearEvent
} from "@elgato/streamdeck";

import { sendAVTTCommand } from "../lib/avtt-client";
import { AVTT_COMMANDS } from "../lib/avtt-commands";
import { PcRollBuffSettings } from "../types/action-settings";

function getButtonTitle(
  settings: PcRollBuffSettings
): string {
  if (settings.label?.trim()) {
    return settings.label.trim();
  }

  if (
    settings.buffType === "select" &&
    settings.value
  ) {
    return `${settings.buffLabel || settings.buff || "Roll Buff"}\n${settings.value}`;
  }

  return (
    settings.buffLabel ||
    settings.buff ||
    "Roll Buff"
  );
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin.avtt-unseen-servant-plugin.pc-roll-buff"
})
export class PcRollBuffAction extends SingletonAction<PcRollBuffSettings> {
  private async updateButton(
    ev:
      | WillAppearEvent<PcRollBuffSettings>
      | DidReceiveSettingsEvent<PcRollBuffSettings>
      | KeyDownEvent<PcRollBuffSettings>
  ): Promise<void> {
    await ev.action.setTitle(
      getButtonTitle(
        ev.payload.settings
      )
    );
  }

  override async onWillAppear(
    ev: WillAppearEvent<PcRollBuffSettings>
  ): Promise<void> {
    await this.updateButton(ev);
  }

  override async onDidReceiveSettings(
    ev: DidReceiveSettingsEvent<PcRollBuffSettings>
  ): Promise<void> {
    await this.updateButton(ev);
  }

  override async onSendToPlugin(
    ev: SendToPluginEvent<
      {
        type?: string;
      },
      PcRollBuffSettings
    >
  ): Promise<void> {
    if (
      ev.payload?.type !==
      "refreshPcRollBuffCatalog"
    ) {
      return;
    }

    await sendAVTTCommand({
      command:
        "refreshPcRollBuffCatalog"
    });

    const actionWithPropertyInspector =
      ev.action as typeof ev.action & {
        sendToPropertyInspector?: (
          payload: {
            type:
              "rollBuffCatalogRefreshed";
          }
        ) => Promise<void>;
      };

    if (
      typeof actionWithPropertyInspector
        .sendToPropertyInspector ===
      "function"
    ) {
      await actionWithPropertyInspector
        .sendToPropertyInspector({
          type:
            "rollBuffCatalogRefreshed"
        });
    }
  }

  override async onKeyDown(
    ev: KeyDownEvent<PcRollBuffSettings>
  ): Promise<void> {
    const settings =
      ev.payload.settings;

    const buff =
      String(
        settings.buff || ""
      ).trim();

    if (!buff) {
      await ev.action.showAlert();
      return;
    }

    await sendAVTTCommand({
      command:
        AVTT_COMMANDS.APPLY_PC_ROLL_BUFF,

      buff,

      value:
        settings.buffType === "select"
          ? settings.value || "0"
          : undefined,

      enabled:
        settings.buffType === "checkbox"
          ? settings.enabled !== false
          : settings.value !== "0"
    });

    await this.updateButton(ev);
  }
}
