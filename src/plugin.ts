import streamDeck from "@elgato/streamdeck";

import {
  IncrementCounter,
  ToggleDaylight,
  ToggleMarker,
  ClearMarkers,
  NextInitiative,
  PreviousInitiative
} from "./actions/increment-counter";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new IncrementCounter());
streamDeck.actions.registerAction(new ToggleDaylight());
streamDeck.actions.registerAction(new ToggleMarker());
streamDeck.actions.registerAction(new ClearMarkers());
streamDeck.actions.registerAction(new NextInitiative());
streamDeck.actions.registerAction(new PreviousInitiative());

streamDeck.connect();
