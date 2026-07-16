let websocket = null;
let uuid = null;
let actionInfo = null;
let catalog = null;
let allBuffEntries = [];
let selectedEntry = null;
let activeResultIndex = -1;

function getSearchEl() {
  return document.getElementById("buffSearch");
}

function getResultsEl() {
  return document.getElementById("searchResults");
}

function getSelectedCardEl() {
  return document.getElementById("selectedBuffCard");
}

function getSelectedLabelEl() {
  return document.getElementById("selectedBuffLabel");
}

function getSelectedCategoryEl() {
  return document.getElementById("selectedBuffCategory");
}

function getValueEl() {
  return document.getElementById("value");
}

function getEnabledEl() {
  return document.getElementById("enabled");
}

function getLabelEl() {
  return document.getElementById("label");
}

function getStatusEl() {
  return document.getElementById("catalogStatus");
}

function setStatus(message, type = "") {
  const status = getStatusEl();

  status.textContent = message;
  status.classList.remove("error", "success");

  if (type) {
    status.classList.add(type);
  }
}

function flattenCatalog() {
  allBuffEntries = [];

  const categories =
    Array.isArray(catalog?.categories)
      ? catalog.categories
      : [];

  categories.forEach(category => {
    const buffs =
      Array.isArray(category.buffs)
        ? category.buffs
        : [];

    buffs.forEach(buff => {
      allBuffEntries.push({
        category: category.category,
        categoryId: category.id || "",
        name: buff.name,
        label: buff.label || buff.name,
        type: buff.type,
        options: Array.isArray(buff.options)
          ? buff.options
          : []
      });
    });
  });
}

function hideResults() {
  getResultsEl().classList.add("hidden");
  activeResultIndex = -1;
}

function renderSelectedEntry() {
  const card = getSelectedCardEl();

  if (!selectedEntry) {
    card.classList.add("hidden");
    document.getElementById("valueRow").classList.add("hidden");
    document.getElementById("enabledRow").classList.add("hidden");
    return;
  }

  getSelectedLabelEl().textContent =
    selectedEntry.label || selectedEntry.name;

  getSelectedCategoryEl().textContent =
    `Category: ${selectedEntry.category}`;

  card.classList.remove("hidden");

  const valueRow =
    document.getElementById("valueRow");

  const enabledRow =
    document.getElementById("enabledRow");

  valueRow.classList.add("hidden");
  enabledRow.classList.add("hidden");

  if (selectedEntry.type === "select") {
    const valueEl = getValueEl();

    valueEl.innerHTML =
      '<option value="0">Disabled</option>';

    selectedEntry.options.forEach(optionData => {
      const option =
        document.createElement("option");

      option.value =
        String(optionData.value);

      option.textContent =
        String(
          optionData.label ||
          optionData.value
        );

      valueEl.appendChild(option);
    });

    const savedValue =
      actionInfo?.payload?.settings?.value || "";

    const allowedValues = [
      "0",
      ...selectedEntry.options.map(
        option => String(option.value)
      )
    ];

    valueEl.value =
      allowedValues.includes(savedValue)
        ? savedValue
        : selectedEntry.options[0]?.value || "0";

    valueRow.classList.remove("hidden");
    return;
  }

  getEnabledEl().checked =
    actionInfo?.payload?.settings?.enabled !== false;

  enabledRow.classList.remove("hidden");
}

function selectEntry(entry) {
  selectedEntry = entry;

  getSearchEl().value =
    entry.label || entry.name;

  hideResults();
  renderSelectedEntry();
  saveSettings();
}

function getSearchMatches(query) {
  const normalized =
    String(query || "")
      .trim()
      .toLowerCase();

  if (!normalized) {
    return allBuffEntries.slice(0, 40);
  }

  return allBuffEntries
    .filter(entry => {
      const haystack = [
        entry.label,
        entry.name,
        entry.category
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    })
    .slice(0, 40);
}

function renderSearchResults() {
  const resultsEl = getResultsEl();
  const matches =
    getSearchMatches(getSearchEl().value);

  resultsEl.innerHTML = "";
  activeResultIndex = -1;

  if (matches.length === 0) {
    const empty =
      document.createElement("div");

    empty.className = "search-result";
    empty.textContent = "No matching buffs found.";
    resultsEl.appendChild(empty);
    resultsEl.classList.remove("hidden");
    return;
  }

  matches.forEach((entry, index) => {
    const row =
      document.createElement("div");

    row.className = "search-result";
    row.dataset.index = String(index);

    const name =
      document.createElement("div");

    name.className = "result-name";
    name.textContent =
      entry.label || entry.name;

    const category =
      document.createElement("div");

    category.className = "result-category";
    category.textContent =
      entry.category;

    row.appendChild(name);
    row.appendChild(category);

    row.addEventListener("mousedown", event => {
      event.preventDefault();
      selectEntry(entry);
    });

    resultsEl.appendChild(row);
  });

  resultsEl.classList.remove("hidden");
}

function moveActiveResult(direction) {
  const rows = [
    ...getResultsEl().querySelectorAll(
      ".search-result"
    )
  ].filter(row => row.dataset.index !== undefined);

  if (rows.length === 0) {
    return;
  }

  activeResultIndex += direction;

  if (activeResultIndex < 0) {
    activeResultIndex = rows.length - 1;
  }

  if (activeResultIndex >= rows.length) {
    activeResultIndex = 0;
  }

  rows.forEach((row, index) => {
    row.classList.toggle(
      "active",
      index === activeResultIndex
    );
  });

  rows[activeResultIndex]?.scrollIntoView({
    block: "nearest"
  });
}

function selectActiveResult() {
  if (activeResultIndex < 0) {
    return;
  }

  const matches =
    getSearchMatches(getSearchEl().value);

  const entry =
    matches[activeResultIndex];

  if (entry) {
    selectEntry(entry);
  }
}

async function fetchCatalog() {
  const response =
    await fetch(
      "http://localhost:3000/roll-buff-catalog"
    );

  if (!response.ok) {
    throw new Error(
      `Bridge returned ${response.status}`
    );
  }

  const nextCatalog =
    await response.json();

  if (
    !nextCatalog ||
    !Array.isArray(nextCatalog.categories)
  ) {
    throw new Error(
      "No Roll Buff catalog is available."
    );
  }

  return nextCatalog;
}

function restoreSavedSelection() {
  const settings =
    actionInfo?.payload?.settings || {};

  const savedEntry =
    allBuffEntries.find(entry =>
      entry.name === settings.buff &&
      entry.category === settings.category
    ) ||
    allBuffEntries.find(entry =>
      entry.name === settings.buff
    );

  if (!savedEntry) {
    selectedEntry = null;
    getSearchEl().value = "";
    renderSelectedEntry();
    return;
  }

  selectedEntry = savedEntry;
  getSearchEl().value =
    savedEntry.label || savedEntry.name;

  renderSelectedEntry();

  if (
    savedEntry.type === "select" &&
    settings.value
  ) {
    getValueEl().value =
      settings.value;
  }

  if (savedEntry.type === "checkbox") {
    getEnabledEl().checked =
      settings.enabled !== false;
  }
}

async function loadCatalog() {
  try {
    catalog = await fetchCatalog();
    flattenCatalog();
    restoreSavedSelection();

    setStatus(
      `${catalog.categoryCount} categories, ${catalog.buffCount} buffs loaded.`,
      "success"
    );
  } catch (error) {
    catalog = null;
    allBuffEntries = [];
    selectedEntry = null;
    renderSelectedEntry();

    setStatus(
      String(
        error?.message ||
        error
      ),
      "error"
    );
  }
}

function sendCommand(command) {
  if (!websocket || !uuid) {
    return;
  }

  websocket.send(
    JSON.stringify({
      event: "sendToPlugin",
      action: actionInfo?.action,
      context: uuid,
      payload: command
    })
  );
}

async function refreshCatalog() {
  const button =
    document.getElementById(
      "refreshCatalog"
    );

  button.disabled = true;

  setStatus(
    "Requesting catalog from AboveVTT..."
  );

  sendCommand({
    type: "refreshPcRollBuffCatalog"
  });

  await new Promise(resolve =>
    setTimeout(resolve, 1200)
  );

  await loadCatalog();

  button.disabled = false;
}

function saveSettings() {
  if (
    !websocket ||
    !uuid ||
    !selectedEntry
  ) {
    return;
  }

  websocket.send(
    JSON.stringify({
      event: "setSettings",
      context: uuid,
      payload: {
        category:
          selectedEntry.category,

        buff:
          selectedEntry.name,

        buffLabel:
          selectedEntry.label ||
          selectedEntry.name,

        buffType:
          selectedEntry.type,

        value:
          selectedEntry.type === "select"
            ? getValueEl().value
            : "",

        enabled:
          selectedEntry.type === "checkbox"
            ? getEnabledEl().checked
            : true,

        label:
          getLabelEl().value
      }
    })
  );
}

function connectElgatoStreamDeckSocket(
  inPort,
  inUUID,
  inRegisterEvent,
  inInfo,
  inActionInfo
) {
  uuid = inUUID;
  actionInfo = JSON.parse(inActionInfo);

  websocket =
    new WebSocket(
      "ws://127.0.0.1:" +
      inPort
    );

  websocket.onopen =
    async function () {
      websocket.send(
        JSON.stringify({
          event: inRegisterEvent,
          uuid
        })
      );

      const settings =
        actionInfo.payload.settings || {};

      getLabelEl().value =
        settings.label || "";

      await loadCatalog();
    };

  websocket.onmessage =
    function (event) {
      const message =
        JSON.parse(event.data);

      if (
        message.event ===
          "sendToPropertyInspector" &&
        message.payload?.type ===
          "rollBuffCatalogRefreshed"
      ) {
        void loadCatalog();
      }
    };
}

getSearchEl().addEventListener(
  "focus",
  renderSearchResults
);

getSearchEl().addEventListener(
  "input",
  () => {
    selectedEntry = null;
    renderSelectedEntry();
    renderSearchResults();
  }
);

getSearchEl().addEventListener(
  "keydown",
  event => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveResult(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveResult(-1);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      selectActiveResult();
      return;
    }

    if (event.key === "Escape") {
      hideResults();
    }
  }
);

getValueEl().addEventListener(
  "change",
  saveSettings
);

getEnabledEl().addEventListener(
  "change",
  saveSettings
);

getLabelEl().addEventListener(
  "input",
  saveSettings
);

document
  .getElementById("refreshCatalog")
  .addEventListener(
    "click",
    () => {
      void refreshCatalog();
    }
  );

document.addEventListener(
  "click",
  event => {
    if (
      !event.target.closest(
        "#buffSearch, #searchResults"
      )
    ) {
      hideResults();
    }
  }
);
