let websocket = null;
let uuid = null;
let actionInfo = null;

let lightPresets = [];
let animationPresets = [];

function el(id) {
  return document.getElementById(id);
}

function selectedLightPreset() {
  const name = el("preset").value;

  return lightPresets.find(
    preset => preset.name === name
  ) || null;
}

function selectedAnimationPreset() {
  const name = el("animationPreset").value;

  return animationPresets.find(
    preset => preset.name === name
  ) || null;
}

function renderLightPresets(selectedName = "") {
  const select = el("preset");
  select.innerHTML = "";

  if (!lightPresets.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Click Refresh Presets";
    select.appendChild(option);
    return;
  }

  lightPresets
    .filter(preset => preset?.name)
    .forEach(preset => {
      const option = document.createElement("option");
      option.value = preset.name;
      option.textContent = preset.name;
      select.appendChild(option);
    });

  if (selectedName) {
    select.value = selectedName;
  }
}

function renderAnimationPresets(selectedName = "") {
  const select = el("animationPreset");
  select.innerHTML = "";

  const normal = document.createElement("option");
  normal.value = "";
  normal.textContent = "Normal AboveVTT Light";
  select.appendChild(normal);

  animationPresets
    .filter(preset => preset?.name)
    .forEach(preset => {
      const option = document.createElement("option");
      option.value = preset.name;
      option.textContent = preset.name;
      select.appendChild(option);
    });

  select.value = selectedName || "";
}

function saveSettings() {
  if (!websocket || !uuid) return;

  const preset = selectedLightPreset();
  const animationPreset =
    selectedAnimationPreset();

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      presetName:
        preset?.name ||
        el("preset").value ||
        "",

      preset,

      animationName:
        animationPreset?.name || "",

      animationPreset,

      customLightMask:
        el("customLightMask").value.trim(),

      customLightRotate:
        el("customLightRotate").checked,

      customLightRpm:
        el("customLightRpm").value,

      label:
        el("label").value
    }
  }));
}

async function refreshPresets() {
  try {
    const [lightResponse, animationResponse] =
      await Promise.all([
        fetch("http://localhost:3000/light-presets"),
        fetch("http://localhost:3000/animation-presets")
      ]);

    const lightData = await lightResponse.json();
    const animationData =
      await animationResponse.json();

    lightPresets = Array.isArray(lightData.presets)
      ? lightData.presets
      : [];

    animationPresets = Array.isArray(
      animationData.presets
    )
      ? animationData.presets
      : [];

    const settings =
      actionInfo?.payload?.settings || {};

    renderLightPresets(
      settings.presetName ||
      settings.preset?.name ||
      ""
    );

    renderAnimationPresets(
      settings.animationName ||
      settings.animationPreset?.name ||
      ""
    );

    saveSettings();
  } catch (error) {
    console.error(
      "Failed to refresh light presets:",
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

    lightPresets = settings.preset
      ? [settings.preset]
      : [];

    animationPresets =
      settings.animationPreset
        ? [settings.animationPreset]
        : [];

    renderLightPresets(
      settings.presetName ||
      settings.preset?.name ||
      ""
    );

    renderAnimationPresets(
      settings.animationName ||
      settings.animationPreset?.name ||
      ""
    );

    el("customLightMask").value =
      settings.customLightMask || "";

    el("customLightRotate").checked =
      settings.customLightRotate === true;

    el("customLightRpm").value =
      settings.customLightRpm || "";

    el("label").value =
      settings.label || "";
  };
}

[
  "preset",
  "animationPreset",
  "customLightMask",
  "customLightRotate",
  "customLightRpm",
  "label"
].forEach(id => {
  const element = el(id);

  element.addEventListener(
    element.type === "checkbox"
      ? "change"
      : element.tagName === "SELECT"
        ? "change"
        : "input",
    saveSettings
  );
});

el("refreshPresets")
  .addEventListener("click", refreshPresets);
