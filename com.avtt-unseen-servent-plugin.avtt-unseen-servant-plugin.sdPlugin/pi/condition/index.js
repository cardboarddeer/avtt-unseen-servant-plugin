let websocket = null;
let uuid = null;
let actionInfo = null;

function getModeEl() {
  return document.getElementById("mode");
}

function getConditionEl() {
  return document.getElementById("condition");
}

function getMarkerColorEl() {
  return document.getElementById("markerColor");
}

function getMarkerTextEl() {
  return document.getElementById("markerText");
}

function getLabelEl() {
  return document.getElementById("label");
}

function getRemoveOnTurnStartEl() {
  return document.getElementById("removeOnTurnStart");
}

function updateVisibility() {
  const mode = getModeEl().value;

  document.getElementById("conditionRow").classList.toggle("hidden", mode !== "condition");
  document.getElementById("customMarkerColorRow").classList.toggle("hidden", mode !== "customMarker");
  document.getElementById("customMarkerTextRow").classList.toggle("hidden", mode !== "customMarker");
}

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

    getModeEl().value = settings.mode || "condition";
    getConditionEl().value = settings.condition || "Prone";
    getMarkerColorEl().value = settings.markerColor || "#ff0000";
    getMarkerTextEl().value = settings.markerText || "";
    getLabelEl().value = settings.label || "";
    getRemoveOnTurnStartEl().checked = settings.removeOnTurnStart === true;

    updateVisibility();
  };
}

function saveSettings() {
  if (!websocket || !uuid) return;

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      mode: getModeEl().value,
      condition: getConditionEl().value,
      markerColor: getMarkerColorEl().value,
      markerText: getMarkerTextEl().value,
      label: getLabelEl().value,
      removeOnTurnStart: getRemoveOnTurnStartEl().checked
    }
  }));

  updateVisibility();
}

getModeEl().addEventListener("change", saveSettings);
getConditionEl().addEventListener("change", saveSettings);
getMarkerColorEl().addEventListener("change", saveSettings);
getMarkerTextEl().addEventListener("input", saveSettings);
getLabelEl().addEventListener("input", saveSettings);
getRemoveOnTurnStartEl().addEventListener("change", saveSettings);
