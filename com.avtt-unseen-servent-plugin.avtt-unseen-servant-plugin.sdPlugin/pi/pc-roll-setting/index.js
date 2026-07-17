let websocket = null;
let uuid = null;
let actionInfo = null;

const SETTING_OPTIONS = {
  versatile: [
    {
      value: "both",
      label: "Roll both damages"
    },
    {
      value: "1",
      label: "1-Handed"
    },
    {
      value: "2",
      label: "2-Handed"
    }
  ],

  crit: [
    {
      value: "0",
      label: "Double damage dice"
    },
    {
      value: "1",
      label: "Perfect Crits"
    },
    {
      value: "3",
      label: "Double total damage"
    },
    {
      value: "2",
      label: "Manual"
    }
  ]
};

function getSettingEl() {
  return document.getElementById(
    "setting"
  );
}

function getSelectValueEl() {
  return document.getElementById(
    "selectValue"
  );
}

function getNumberValueEl() {
  return document.getElementById(
    "numberValue"
  );
}

function getTextValueEl() {
  return document.getElementById(
    "textValue"
  );
}

function getLabelEl() {
  return document.getElementById(
    "label"
  );
}

function getCurrentValue() {
  const setting =
    getSettingEl().value;

  if (
    setting === "versatile" ||
    setting === "crit"
  ) {
    return getSelectValueEl().value;
  }

  if (setting === "critRange") {
    return getNumberValueEl().value;
  }

  return getTextValueEl().value;
}

function populateSelectOptions(
  setting,
  selectedValue = ""
) {
  const select =
    getSelectValueEl();

  select.innerHTML = "";

  const options =
    SETTING_OPTIONS[setting] || [];

  options.forEach(optionData => {
    const option =
      document.createElement(
        "option"
      );

    option.value =
      optionData.value;

    option.textContent =
      optionData.label;

    select.appendChild(option);
  });

  if (
    options.some(
      option =>
        option.value ===
        selectedValue
    )
  ) {
    select.value =
      selectedValue;
  } else if (options[0]) {
    select.value =
      options[0].value;
  }
}

function updateValueControl(
  selectedValue = ""
) {
  const setting =
    getSettingEl().value;

  const selectRow =
    document.getElementById(
      "selectValueRow"
    );

  const numberRow =
    document.getElementById(
      "numberValueRow"
    );

  const textRow =
    document.getElementById(
      "textValueRow"
    );

  selectRow.classList.add(
    "hidden"
  );

  numberRow.classList.add(
    "hidden"
  );

  textRow.classList.add(
    "hidden"
  );

  if (
    setting === "versatile" ||
    setting === "crit"
  ) {
    populateSelectOptions(
      setting,
      selectedValue
    );

    selectRow.classList.remove(
      "hidden"
    );

    return;
  }

  if (setting === "critRange") {
    const numberValue =
      Number(selectedValue);

    getNumberValueEl().value =
      Number.isInteger(numberValue) &&
      numberValue >= 1 &&
      numberValue <= 20
        ? String(numberValue)
        : "20";

    numberRow.classList.remove(
      "hidden"
    );

    return;
  }

  getTextValueEl().value =
    selectedValue;

  textRow.classList.remove(
    "hidden"
  );
}

function saveSettings() {
  if (
    !websocket ||
    !uuid
  ) {
    return;
  }

  websocket.send(
    JSON.stringify({
      event:
        "setSettings",

      context:
        uuid,

      payload: {
        setting:
          getSettingEl().value,

        value:
          getCurrentValue(),

        label:
          getLabelEl().value
      }
    })
  );
}

function handleSettingChange() {
  updateValueControl();
  saveSettings();
}

function connectElgatoStreamDeckSocket(
  inPort,
  inUUID,
  inRegisterEvent,
  inInfo,
  inActionInfo
) {
  uuid =
    inUUID;

  actionInfo =
    JSON.parse(
      inActionInfo
    );

  websocket =
    new WebSocket(
      "ws://127.0.0.1:" +
      inPort
    );

  websocket.onopen =
    function () {
      websocket.send(
        JSON.stringify({
          event:
            inRegisterEvent,

          uuid
        })
      );

      const settings =
        actionInfo.payload
          .settings ||
        {};

      getSettingEl().value =
        settings.setting ||
        "versatile";

      getLabelEl().value =
        settings.label ||
        "";

      updateValueControl(
        settings.value ||
        ""
      );
    };
}

getSettingEl()
  .addEventListener(
    "change",
    handleSettingChange
  );

getSelectValueEl()
  .addEventListener(
    "change",
    saveSettings
  );

getNumberValueEl()
  .addEventListener(
    "change",
    saveSettings
  );

getTextValueEl()
  .addEventListener(
    "input",
    saveSettings
  );

getLabelEl()
  .addEventListener(
    "input",
    saveSettings
  );
