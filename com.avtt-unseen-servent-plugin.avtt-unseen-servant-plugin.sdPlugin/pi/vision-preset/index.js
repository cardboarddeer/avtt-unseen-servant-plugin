let websocket = null;
let uuid = null;

const DEFAULT_COLOR =
  "rgba(142, 142, 142, 1)";

function el(id) {
  return document.getElementById(id);
}

function saveSettings() {
  if (!websocket || !uuid) return;

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      sense: el("sense").value,
      feet: String(el("feet").value || "60"),
      color: el("color").value || DEFAULT_COLOR,
      label: el("label").value
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

    el("sense").value =
      settings.sense || "vision";

    el("feet").value =
      settings.feet || "60";

    el("color").value =
      settings.color || DEFAULT_COLOR;

    el("label").value =
      settings.label || "";
  };
}

el("sense").addEventListener("change", saveSettings);
el("feet").addEventListener("input", saveSettings);
el("color").addEventListener("input", saveSettings);
el("label").addEventListener("input", saveSettings);
