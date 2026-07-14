function updateAcFieldVisibility() {
  const stat =
    document.getElementById("stat").value;

  document
    .getElementById("acFieldRow")
    .style.display =
      stat === "armorClass"
        ? "grid"
        : "none";
}

let websocket = null;
let uuid = null;
let settings = {};

function saveSettings() {
  updateAcFieldVisibility();

  settings = {
    stat:
      document.getElementById("stat").value,

    operation:
      document.getElementById("operation").value,

    acField:
      document.getElementById("acField").value,

    value:
      document.getElementById("value").value,

    effectName:
      document.getElementById("effectName").value
  };

  if (websocket && uuid) {
    websocket.send(JSON.stringify({
      event: "setSettings",
      context: uuid,
      payload: settings
    }));
  }
}

function loadSettings(
  payloadSettings = {}
) {
  settings = payloadSettings;

  document.getElementById("stat").value =
    settings.stat || "armorClass";

  document.getElementById("operation").value =
    settings.operation || "add";

  document.getElementById("acField").value =
    settings.acField || "Override AC";

  document.getElementById("value").value =
    settings.value ?? 1;

  document.getElementById("effectName").value =
    settings.effectName ||
    "Stream Deck Effect";

  updateAcFieldVisibility();
}

function connectElgatoStreamDeckSocket(
  inPort,
  inUuid,
  inRegisterEvent,
  inInfo,
  inActionInfo
) {
  uuid = inUuid;

  websocket =
    new WebSocket(
      "ws://127.0.0.1:" + inPort
    );

  websocket.onopen = () => {
    websocket.send(JSON.stringify({
      event: inRegisterEvent,
      uuid: inUuid
    }));

    const actionInfo =
      JSON.parse(
        inActionInfo || "{}"
      );

    loadSettings(
      actionInfo.payload?.settings || {}
    );
  };
}

window.connectElgatoStreamDeckSocket =
  connectElgatoStreamDeckSocket;

window.addEventListener(
  "DOMContentLoaded",
  () => {
    [
      "stat",
      "acField",
      "operation",
      "value",
      "effectName"
    ].forEach(id => {
      const element =
        document.getElementById(id);

      element.addEventListener(
        "input",
        saveSettings
      );

      element.addEventListener(
        "change",
        saveSettings
      );
    });

    loadSettings({});
  }
);
