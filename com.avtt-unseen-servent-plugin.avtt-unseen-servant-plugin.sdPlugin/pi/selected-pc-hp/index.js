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
    document.getElementById("pcName").value = settings.pcName || "";
    document.getElementById("refreshSeconds").value = settings.refreshSeconds || 1;
  };
}

function saveSettings() {
  if (!websocket || !uuid) return;

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      pcName: document.getElementById("pcName").value,
      refreshSeconds: Number(document.getElementById("refreshSeconds").value || 1)
    }
  }));
}

document.getElementById("pcName").addEventListener("input", saveSettings);
document.getElementById("refreshSeconds").addEventListener("input", saveSettings);
