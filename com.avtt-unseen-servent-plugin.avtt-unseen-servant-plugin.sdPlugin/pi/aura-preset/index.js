let websocket = null;
let uuid = null;
let actionInfo = null;
let presets = [];

function getPresetEl() {
  return document.getElementById("preset");
}

function getCustomAuraMaskEl() {
  return document.getElementById("customAuraMask");
}

function getCustomAuraRotateEl() {
  return document.getElementById("customAuraRotate");
}

function getLabelEl() {
  return document.getElementById("label");
}

function getSelectedPreset() {
  const selectedName = getPresetEl().value;
  return presets.find(preset => preset.name === selectedName) || null;
}

function renderPresets(selectedName = "") {
  const presetEl = getPresetEl();
  presetEl.innerHTML = "";

  if (!presets.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Click Refresh Presets";
    presetEl.appendChild(option);
    return;
  }

  presets
    .filter(preset => preset.name && preset.name.trim())
    .forEach(preset => {
      const option = document.createElement("option");
      option.value = preset.name;
      option.textContent = preset.name;
      presetEl.appendChild(option);
    });

  if (selectedName) {
    presetEl.value = selectedName;
  }
}

function saveSettings() {
  if (!websocket || !uuid) return;

  const preset = getSelectedPreset();

  websocket.send(JSON.stringify({
    event: "setSettings",
    context: uuid,
    payload: {
      presetName: preset?.name || getPresetEl().value || "",
      preset,
      customAuraMask: getCustomAuraMaskEl().value,
      customAuraRotate: getCustomAuraRotateEl().checked,
      label: getLabelEl().value
    }
  }));
}

async function refreshPresets() {
  try {
    const response = await fetch("http://localhost:3000/aura-presets");
    const data = await response.json();

    presets = Array.isArray(data.presets) ? data.presets : [];
    renderPresets(actionInfo?.payload?.settings?.presetName || "");

    saveSettings();
  } catch (err) {
    console.error("Failed to refresh aura presets:", err);
  }
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

    presets = settings.preset ? [settings.preset] : [];
    renderPresets(settings.presetName || settings.preset?.name || "");
    getCustomAuraMaskEl().value = settings.customAuraMask || "";
    getCustomAuraRotateEl().checked = settings.customAuraRotate === true;
    getLabelEl().value = settings.label || "";
  };
}

getPresetEl().addEventListener("change", saveSettings);
getCustomAuraMaskEl().addEventListener("input", saveSettings);
getCustomAuraRotateEl().addEventListener("change", saveSettings);
getLabelEl().addEventListener("input", saveSettings);
document.getElementById("refreshPresets").addEventListener("click", refreshPresets);
