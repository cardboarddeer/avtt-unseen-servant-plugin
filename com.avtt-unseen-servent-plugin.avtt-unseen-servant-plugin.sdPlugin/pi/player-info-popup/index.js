let websocket = null;
let uuid = null;

function getLabelElement() {
  return document.getElementById("label");
}

function getTitleElement() {
  return document.getElementById("title");
}

function getImageElement() {
  return document.getElementById("image");
}

function getZoomEnabledElement() {
  return document.getElementById("zoomEnabled");
}

function loadSettings(settings = {}) {
  getLabelElement().value =
    settings.label || "Player Info";

  getTitleElement().value =
    settings.title || "Player Information";

  getImageElement().value =
    settings.image || "test-info.png";

  getZoomEnabledElement().checked =
    settings.zoomEnabled === true;
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
        label:
          getLabelElement().value.trim(),

        title:
          getTitleElement().value.trim(),

        image:
          getImageElement().value.trim(),

        zoomEnabled:
          getZoomEnabledElement().checked
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
      "label",
      "title",
      "image",
      "zoomEnabled"
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
