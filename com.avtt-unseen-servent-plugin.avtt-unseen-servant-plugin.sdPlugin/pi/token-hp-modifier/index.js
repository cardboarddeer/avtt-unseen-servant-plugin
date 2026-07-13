let websocket = null;
let uuid = null;

function el(id) {
  return document.getElementById(id);
}

function normalizeMode(value) {
  if (
    value === "heal" ||
    value === "tempHp"
  ) {
    return value;
  }

  return "damage";
}

function saveSettings() {
  if (!websocket || !uuid) return;

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      mode:
        normalizeMode(
          el("mode").value
        ),

      amount:
        Number(
          el("amount").value || 1
        ),

      label:
        el("label").value
    }
  }));
}

function connectElgatoStreamDeckSocket(
  inPort,
  inUUID,
  inRegisterEvent,
  inInfo,
  inActionInfo
) {
  uuid = inUUID;

  const actionInfo =
    JSON.parse(inActionInfo || "{}");

  websocket = new WebSocket(
    "ws://127.0.0.1:" + inPort
  );

  websocket.onopen = function () {
    websocket.send(JSON.stringify({
      event: inRegisterEvent,
      uuid
    }));

    const settings =
      actionInfo.payload?.settings || {};

    el("mode").value =
      normalizeMode(settings.mode);

    el("amount").value =
      settings.amount ?? 5;

    el("label").value =
      settings.label || "";
  };
}

el("mode").addEventListener(
  "change",
  saveSettings
);

el("amount").addEventListener(
  "input",
  saveSettings
);

el("label").addEventListener(
  "input",
  saveSettings
);
