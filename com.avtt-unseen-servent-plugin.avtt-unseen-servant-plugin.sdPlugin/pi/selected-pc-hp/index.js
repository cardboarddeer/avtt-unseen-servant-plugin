let websocket = null;
let uuid = null;
let actionInfo = null;

function el(id) {
  return document.getElementById(id);
}

function normalizePage(value) {
  if (
    value === "reference" ||
    value === "abilities"
  ) {
    return value;
  }

  return "combat";
}

function saveSettings() {
  if (!websocket || !uuid) return;

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      pcName:
        el("pcName").value,

      page:
        normalizePage(
          el("page").value
        ),

      refreshSeconds:
        Number(
          el("refreshSeconds").value ||
          1
        )
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

  actionInfo =
    JSON.parse(inActionInfo || "{}");

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

    el("pcName").value =
      settings.pcName || "";

    el("page").value =
      normalizePage(settings.page);

    el("refreshSeconds").value =
      settings.refreshSeconds ?? 1;
  };
}

el("pcName")
  .addEventListener(
    "input",
    saveSettings
  );

el("page")
  .addEventListener(
    "change",
    saveSettings
  );

el("refreshSeconds")
  .addEventListener(
    "input",
    saveSettings
  );
