let websocket = null;
let uuid = null;
let actionInfo = null;
let allTokens = [];

function el(id) {
  return document.getElementById(id);
}

function getSelectedToken() {
  const path =
    el("tokenSelect").value;

  return allTokens.find(
    token => token.path === path
  ) || null;
}

function renderTokens(
  selectedPath = ""
) {
  const select =
    el("tokenSelect");

  const search =
    el("tokenSearch")
      .value
      .trim()
      .toLowerCase();

  select.innerHTML = "";

  const filtered = allTokens.filter(token => {
    if (!search) return true;

    return (
      String(token.name || "")
        .toLowerCase()
        .includes(search) ||
      String(token.path || "")
        .toLowerCase()
        .includes(search)
    );
  });

  if (!filtered.length) {
    const option =
      document.createElement("option");

    option.value = "";
    option.textContent =
      allTokens.length
        ? "No matching tokens"
        : "Click Refresh Tokens";

    select.appendChild(option);
    return;
  }

  filtered.forEach(token => {
    const option =
      document.createElement("option");

    option.value =
      token.path;

    option.textContent =
      token.path;

    select.appendChild(option);
  });

  if (
    selectedPath &&
    filtered.some(
      token => token.path === selectedPath
    )
  ) {
    select.value =
      selectedPath;
  }
}

function saveSettings() {
  if (!websocket || !uuid) return;

  const selected =
    getSelectedToken();

  const rawSize =
    el("sizeOverride").value;

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      tokenPath:
        selected?.path ||
        el("tokenSelect").value ||
        "",

      tokenName:
        selected?.name || "",

      count:
        Number(
          el("count").value || 1
        ),

      sizeOverride:
        rawSize === ""
          ? null
          : Number(rawSize),

      label:
        el("label").value
    }
  }));
}

async function refreshTokens() {
  try {
    const response = await fetch(
      "http://localhost:3000/my-tokens"
    );

    const data =
      await response.json();

    allTokens =
      Array.isArray(data.tokens)
        ? data.tokens
        : [];

    const settings =
      actionInfo?.payload?.settings || {};

    renderTokens(
      settings.tokenPath || ""
    );

    saveSettings();
  } catch (error) {
    console.error(
      "Failed to refresh My Tokens:",
      error
    );
  }
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

    allTokens =
      settings.tokenPath
        ? [{
            name:
              settings.tokenName || "",
            path:
              settings.tokenPath
          }]
        : [];

    renderTokens(
      settings.tokenPath || ""
    );

    el("count").value =
      settings.count ?? 1;

    el("sizeOverride").value =
      settings.sizeOverride == null
        ? ""
        : String(settings.sizeOverride);

    el("label").value =
      settings.label || "";
  };
}

el("tokenSearch")
  .addEventListener(
    "input",
    () => {
      const selectedPath =
        el("tokenSelect").value;

      renderTokens(selectedPath);
    }
  );

el("tokenSelect")
  .addEventListener(
    "change",
    saveSettings
  );

el("count")
  .addEventListener(
    "input",
    saveSettings
  );

el("sizeOverride")
  .addEventListener(
    "change",
    saveSettings
  );

el("label")
  .addEventListener(
    "input",
    saveSettings
  );

el("refreshTokens")
  .addEventListener(
    "click",
    refreshTokens
  );
