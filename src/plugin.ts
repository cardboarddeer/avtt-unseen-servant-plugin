import streamDeck from "@elgato/streamdeck";

import {
  IncrementCounter,
  ToggleDaylight,
  ToggleMarker,
  ClearMarkers,
  NextInitiative,
  PreviousInitiative,
  OpenGameLogTab,
  OpenTokensTab,
  OpenScenesTab,
  OpenSoundsTab,
  OpenJournalTab,
  OpenSettingsTab
} from "./actions/increment-counter";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new IncrementCounter());
streamDeck.actions.registerAction(new ToggleDaylight());
streamDeck.actions.registerAction(new ToggleMarker());
streamDeck.actions.registerAction(new ClearMarkers());
streamDeck.actions.registerAction(new NextInitiative());
streamDeck.actions.registerAction(new PreviousInitiative());
streamDeck.actions.registerAction(new OpenGameLogTab());
streamDeck.actions.registerAction(new OpenTokensTab());
streamDeck.actions.registerAction(new OpenScenesTab());
streamDeck.actions.registerAction(new OpenSoundsTab());
streamDeck.actions.registerAction(new OpenJournalTab());
streamDeck.actions.registerAction(new OpenSettingsTab());

streamDeck.connect();
