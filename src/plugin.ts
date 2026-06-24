import streamDeck from "@elgato/streamdeck";

import { IncrementCounter, ToggleDaylight } from "./actions/increment-counter";

streamDeck.logger.setLevel("trace");

streamDeck.actions.registerAction(new IncrementCounter());
streamDeck.actions.registerAction(new ToggleDaylight());

streamDeck.connect();
