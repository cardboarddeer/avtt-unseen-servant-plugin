let websocket = null;
let uuid = null;
let settings = {};

function saveSettings() {
  settings = {
    title: document.getElementById("title").value || "",
    text: document.getElementById("text").value || "",
    headerStyle: document.getElementById("headerStyle").value || "simple"
  };

  if (websocket && uuid) {
    websocket.send(JSON.stringify({
      event: "setSettings",
      context: uuid,
      payload: settings
    }));
  }
}

function loadSettings(payloadSettings = {}) {
  settings = payloadSettings;

  document.getElementById("title").value = settings.title || "";
  document.getElementById("text").value = settings.text || "";
  document.getElementById("headerStyle").value = settings.headerStyle || "simple";
}

function connectElgatoStreamDeckSocket(inPort, inUuid, inRegisterEvent, inInfo, inActionInfo) {
  uuid = inUuid;
  websocket = new WebSocket("ws://127.0.0.1:" + inPort);

  websocket.onopen = () => {
    websocket.send(JSON.stringify({
      event: inRegisterEvent,
      uuid: inUuid
    }));

    const actionInfo = JSON.parse(inActionInfo || "{}");
    loadSettings(actionInfo.payload?.settings || {});
  };
}

window.connectElgatoStreamDeckSocket = connectElgatoStreamDeckSocket;

window.addEventListener("DOMContentLoaded", () => {
  ["title", "text", "headerStyle"].forEach(id => {
    document.getElementById(id).addEventListener("input", saveSettings);
    document.getElementById(id).addEventListener("change", saveSettings);
  });

  loadSettings({});
});
