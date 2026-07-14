let websocket = null;
let uuid = null;
let settings = {};

function updateVisibility() {
  const scope =
    document.getElementById("scope").value;

  document
    .getElementById("statField")
    .classList.toggle(
      "hidden",
      scope === "all"
    );
}

function saveSettings() {
  settings = {
    scope:
      document.getElementById("scope").value,

    stat:
      document.getElementById("stat").value
  };

  updateVisibility();

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

  document.getElementById("scope").value =
    settings.scope || "stat";

  document.getElementById("stat").value =
    settings.stat || "armorClass";

  updateVisibility();
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
    ["scope", "stat"].forEach(id => {
      document
        .getElementById(id)
        .addEventListener(
          "change",
          saveSettings
        );
    });

    loadSettings({});
  }
);
