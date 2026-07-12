let websocket = null;
let uuid = null;
let actionInfo = null;

const DEFAULT_COLOR =
  "rgba(142, 142, 142, 1)";

function el(id) {
  return document.getElementById(id);
}

function readSense(prefix) {
  return {
    feet: String(
      el(prefix + "Feet").value || "0"
    ),
    color: String(
      el(prefix + "Color").value ||
      DEFAULT_COLOR
    )
  };
}

function saveSettings() {
  if (!websocket || !uuid) return;

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      vision: readSense("vision"),
      truesight: readSense("truesight"),
      devilsight: readSense("devilsight"),
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
  actionInfo = JSON.parse(inActionInfo || "{}");

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

    el("visionFeet").value =
      settings.vision?.feet || "0";

    el("visionColor").value =
      settings.vision?.color ||
      DEFAULT_COLOR;

    el("truesightFeet").value =
      settings.truesight?.feet || "0";

    el("truesightColor").value =
      settings.truesight?.color ||
      DEFAULT_COLOR;

    el("devilsightFeet").value =
      settings.devilsight?.feet || "0";

    el("devilsightColor").value =
      settings.devilsight?.color ||
      DEFAULT_COLOR;

    el("label").value =
      settings.label || "";
  };
}

[
  "visionFeet",
  "visionColor",
  "truesightFeet",
  "truesightColor",
  "devilsightFeet",
  "devilsightColor",
  "label"
].forEach(id => {
  el(id).addEventListener(
    "input",
    saveSettings
  );
});
