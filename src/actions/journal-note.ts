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
  JournalNoteSettings
} from "../types/action-settings";

function getButtonLabel(
  settings: JournalNoteSettings
): string {
  return (
    settings.label?.trim() ||
    "Journal"
  );
}

@action({
  UUID:
    "com.avtt-unseen-servent-plugin." +
    "avtt-unseen-servant-plugin.journal-note"
})
export class JournalNoteAction
  extends SingletonAction<
    JournalNoteSettings
  > {
  private async updateButtonTitle(
    event:
      | WillAppearEvent<
          JournalNoteSettings
        >
      | DidReceiveSettingsEvent<
          JournalNoteSettings
        >
      | KeyDownEvent<
          JournalNoteSettings
        >
  ): Promise<void> {
    await event.action.setTitle(
      getButtonLabel(
        event.payload.settings || {}
      )
    );
  }

  override async onWillAppear(
    event:
      WillAppearEvent<
        JournalNoteSettings
      >
  ): Promise<void> {
    await this.updateButtonTitle(
      event
    );
  }

  override async onDidReceiveSettings(
    event:
      DidReceiveSettingsEvent<
        JournalNoteSettings
      >
  ): Promise<void> {
    await this.updateButtonTitle(
      event
    );
  }

  override async onKeyDown(
    event:
      KeyDownEvent<
        JournalNoteSettings
      >
  ): Promise<void> {
    const settings =
      event.payload.settings || {};

    const noteId =
      settings.noteId?.trim();

    if (!noteId) {
      console.error(
        "JournalNoteAction: no noteId configured"
      );

      await event.action.showAlert();
      return;
    }

    try {
      await sendAVTTCommand({
        command:
          AVTT_COMMANDS.OPEN_JOURNAL_NOTE,

        noteId
      });

      await event.action.showOk();
    } catch (error) {
      console.error(
        "Could not open journal/handout:",
        error
      );

      await event.action.showAlert();
    }

    await this.updateButtonTitle(
      event
    );
  }
}
