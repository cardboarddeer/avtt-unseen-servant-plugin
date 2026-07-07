const AVTT_ASSET_PICKER_BASE_URL = "http://localhost:3000";

function normalizeAsset(raw) {
  const id = raw.id || raw.assetId || raw.name || raw.path || raw.url;
  const name = raw.name || raw.label || raw.filename || id || "Unnamed Asset";
  const url = raw.url || raw.publicUrl || raw.href || raw.path || "";
  const type = raw.type || raw.category || "custom";

  return {
    id,
    name,
    url,
    path: raw.path || raw.localPath || "",
    type,
    raw
  };
}

async function fetchAssets(assetType) {
  const suffix = assetType ? `?type=${encodeURIComponent(assetType)}` : "";
  const response = await fetch(`${AVTT_ASSET_PICKER_BASE_URL}/assets${suffix}`);

  if (!response.ok) {
    throw new Error(`Bridge returned ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) return data.map(normalizeAsset);
  if (Array.isArray(data.assets)) return data.assets.map(normalizeAsset);
  if (Array.isArray(data.items)) return data.items.map(normalizeAsset);

  return [];
}

window.AVTTAssetPicker = function createAssetPicker(options) {
  const root = document.getElementById(options.rootId);
  if (!root) {
    console.warn("Asset Picker root not found:", options.rootId);
    return;
  }

  let assets = [];
  let selectedAsset = options.value || null;
  let searchText = "";

  root.classList.add("asset-picker");

  function matchesSearch(asset) {
    const haystack = `${asset.name} ${asset.type} ${asset.path} ${asset.url}`.toLowerCase();
    return haystack.includes(searchText.toLowerCase());
  }

  function getFilteredAssets() {
    return assets.filter(matchesSearch);
  }

  function renderStatus(message) {
    const status = root.querySelector("[data-asset-picker-status]");
    if (status) status.textContent = message;
  }

  function render() {
    const filtered = getFilteredAssets();

    root.innerHTML = `
      <div class="asset-picker-title">${options.title || "Asset"}</div>

      <input
        class="asset-picker-search"
        data-asset-picker-search
        type="text"
        placeholder="Search assets..."
        value="${searchText.replaceAll('"', "&quot;")}"
      />

      <div class="asset-picker-status" data-asset-picker-status>
        ${assets.length ? `${filtered.length} asset(s)` : "Loading assets..."}
      </div>

      <div class="asset-picker-list">
        ${
          filtered.length
            ? filtered.map(asset => `
                <div
                  class="asset-picker-item ${selectedAsset && selectedAsset.id === asset.id ? "selected" : ""}"
                  data-asset-id="${String(asset.id).replaceAll('"', "&quot;")}"
                >
                  ${asset.url ? `<img class="asset-picker-thumb" src="${asset.url}" />` : `<div class="asset-picker-thumb"></div>`}
                  <div>
                    <div class="asset-picker-name">${asset.name}</div>
                    <div class="asset-picker-meta">${asset.type}</div>
                  </div>
                </div>
              `).join("")
            : `<div class="asset-picker-status">No assets found.</div>`
        }
      </div>

      ${
        selectedAsset
          ? `
            <div class="asset-picker-preview">
              ${selectedAsset.url ? `<img src="${selectedAsset.url}" />` : `<div></div>`}
              <div>
                <div class="asset-picker-preview-name">${selectedAsset.name}</div>
                <div class="asset-picker-preview-path">${selectedAsset.path || selectedAsset.url || selectedAsset.id}</div>
              </div>
            </div>
          `
          : ""
      }
    `;

    const searchEl = root.querySelector("[data-asset-picker-search]");
    searchEl.addEventListener("input", event => {
      searchText = event.target.value;
      render();

      const nextSearchEl = root.querySelector("[data-asset-picker-search]");
      nextSearchEl.focus();
      nextSearchEl.setSelectionRange(searchText.length, searchText.length);
    });

    root.querySelectorAll("[data-asset-id]").forEach(item => {
      item.addEventListener("click", () => {
        const assetId = item.getAttribute("data-asset-id");
        selectedAsset = assets.find(asset => String(asset.id) === String(assetId)) || null;

        if (selectedAsset && typeof options.onChange === "function") {
          options.onChange(selectedAsset);
        }

        render();
      });
    });
  }

  async function load() {
    render();

    try {
      assets = await fetchAssets(options.type);
      render();
    } catch (error) {
      console.error("Asset Picker failed to load assets:", error);
      renderStatus("Bridge offline or /assets unavailable.");
    }
  }

  load();

  return {
    reload: load,
    getValue: () => selectedAsset
  };
};
