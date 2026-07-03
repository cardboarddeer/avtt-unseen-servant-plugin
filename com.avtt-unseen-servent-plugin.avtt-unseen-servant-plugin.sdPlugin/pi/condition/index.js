let websocket = null;
let uuid = null;
let actionInfo = null;

function getConditionEl() {
  return document.getElementById("condition");
}

function getCustomConditionEl() {
  return document.getElementById("customCondition");
}

function getLabelEl() {
  return document.getElementById("label");
}

function updateCustomVisibility() {
  const isCustom = getConditionEl().value === "__custom__";
  document.getElementById("customRow").classList.toggle("hidden", !isCustom);
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

    getConditionEl().value = settings.condition || "Prone";
    getCustomConditionEl().value = settings.customCondition || "";
    getLabelEl().value = settings.label || "";

    updateCustomVisibility();
  };
}

function saveSettings() {
  if (!websocket || !uuid) return;

  const condition = getConditionEl().value;
  const customCondition = getCustomConditionEl().value;
  const label = getLabelEl().value;

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      condition,
      customCondition,
      label
    }
  }));

  updateCustomVisibility();
}

getConditionEl().addEventListener("change", saveSettings);
getCustomConditionEl().addEventListener("input", saveSettings);
getLabelEl().addEventListener("input", saveSettings);
