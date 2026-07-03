let websocket = null;
let uuid = null;
let actionInfo = null;

function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
  uuid = inUUID;
  actionInfo = JSON.parse(inActionInfo);

  websocket = new WebSocket("ws://127.0.0.1:" + inPort);

  websocket.onopen = function () {
    websocket.send(JSON.stringify({
      event: inRegisterEvent,
      uuid
    }));

    const settings = actionInfo.payload.settings || {};
    document.getElementById("condition").value = settings.condition || "prone";
    document.getElementById("label").value = settings.label || "";
  };
}

function saveSettings() {
  if (!websocket || !uuid) return;

  const condition = document.getElementById("condition").value;
  const label = document.getElementById("label").value;

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      condition,
      label
    }
  }));
}

document.getElementById("condition").addEventListener("change", saveSettings);
document.getElementById("label").addEventListener("input", saveSettings);
