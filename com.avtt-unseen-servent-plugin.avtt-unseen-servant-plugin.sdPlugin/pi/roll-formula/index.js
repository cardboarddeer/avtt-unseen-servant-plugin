let websocket = null;
let uuid = null;
let settings = {};

const options = [
  ["", "None"],

  ["{str}", "STR"],
  ["{dex}", "DEX"],
  ["{con}", "CON"],
  ["{int}", "INT"],
  ["{wis}", "WIS"],
  ["{cha}", "CHA"],

  ["{strSave}", "STR Save"],
  ["{dexSave}", "DEX Save"],
  ["{conSave}", "CON Save"],
  ["{intSave}", "INT Save"],
  ["{wisSave}", "WIS Save"],
  ["{chaSave}", "CHA Save"],

  ["{acrobatics}", "Acrobatics"],
  ["{animalHandling}", "Animal Handling"],
  ["{arcana}", "Arcana"],
  ["{athletics}", "Athletics"],
  ["{deception}", "Deception"],
  ["{history}", "History"],
  ["{insight}", "Insight"],
  ["{intimidation}", "Intimidation"],
  ["{investigation}", "Investigation"],
  ["{medicine}", "Medicine"],
  ["{nature}", "Nature"],
  ["{perception}", "Perception"],
  ["{performance}", "Performance"],
  ["{persuasion}", "Persuasion"],
  ["{religion}", "Religion"],
  ["{sleightOfHand}", "Sleight of Hand"],
  ["{stealth}", "Stealth"],
  ["{survival}", "Survival"],

  ["{pb}", "Proficiency Bonus"],
  ["{initiative}", "Initiative"],
  ["{ac}", "AC"],
  ["{hp}", "HP"],
  ["{maxHp}", "Max HP"]
];

function populateSelect(id) {
  const select = document.getElementById(id);
  select.innerHTML = "";

  options.forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });
}

function buildFormula() {
  const dice = document.getElementById("dice").value || "1d20";
  const mods = [
    document.getElementById("modifier1").value,
    document.getElementById("modifier2").value,
    document.getElementById("modifier3").value
  ].filter(Boolean);

  if (document.getElementById("addPb").checked) {
    mods.push("{pb}");
  }

  return [dice, ...mods].join(" + ");
}

function saveSettings() {
  settings = {
    dice: document.getElementById("dice").value || "1d20",
    modifier1: document.getElementById("modifier1").value,
    modifier2: document.getElementById("modifier2").value,
    modifier3: document.getElementById("modifier3").value,
    addPb: document.getElementById("addPb").checked,
    label: document.getElementById("label").value || "{name} Roll",
    rollType: document.getElementById("rollType").value,
    formula: buildFormula()
  };

  document.getElementById("formulaPreview").value = settings.formula;

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

  document.getElementById("dice").value = settings.dice || "1d20";
  document.getElementById("modifier1").value = settings.modifier1 || "";
  document.getElementById("modifier2").value = settings.modifier2 || "";
  document.getElementById("modifier3").value = settings.modifier3 || "";
  document.getElementById("addPb").checked = !!settings.addPb;
  document.getElementById("label").value = settings.label || "{name} Roll";
  document.getElementById("rollType").value = settings.rollType || "check";
  document.getElementById("formulaPreview").value = settings.formula || buildFormula();
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
  ["modifier1", "modifier2", "modifier3"].forEach(populateSelect);

  ["dice", "modifier1", "modifier2", "modifier3", "addPb", "label", "rollType"]
    .forEach(id => {
      document.getElementById(id).addEventListener("input", saveSettings);
      document.getElementById(id).addEventListener("change", saveSettings);
    });

  loadSettings({});
});
