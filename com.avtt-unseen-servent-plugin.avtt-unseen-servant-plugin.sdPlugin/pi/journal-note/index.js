let websocket = null;
let uuid = null;

function getNoteIdElement() {
  return document.getElementById("noteId");
}

function getLabelElement() {
  return document.getElementById("label");
}

function loadSettings(settings = {}) {
  getNoteIdElement().value =
    settings.noteId || "";

  getLabelElement().value =
    settings.label || "Journal";
}

function saveSettings() {
  if (!websocket || !uuid) {
    return;
  }

  websocket.send(
    JSON.stringify({
      event: "setSettings",
      context: uuid,
      payload: {
        noteId:
          getNoteIdElement().value.trim(),

        label:
          getLabelElement().value.trim()
      }
    })
  );
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
    websocket.send(
      JSON.stringify({
        event: inRegisterEvent,
        uuid: inUuid
      })
    );

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
      "noteId",
      "label"
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
