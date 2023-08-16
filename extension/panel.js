const APP_URL = "http://localhost:3000/";
const chevronIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="chevron-icon-svg" width="28" height="28">
    <path
        d="M16.293 14.707a1 1 0 001.414-1.414l-5-5a1 1 0 00-1.414 0l-5 5a1 1 0 101.414 1.414L12 10.414l4.293 4.293z"
        fill-rule="evenodd"
        clip-rule="evenodd"
    ></path>
</svg>
`;
async function main() {
  const panelContainer = document.createElement("div");
  panelContainer.id = "algoTeams-panel-container";
  panelContainer.style.display = "none";
  const panelTab = document.createElement("div");
  panelTab.id = "algoTeams-panel-tab";
  panelTab.style.display = "flex";
  panelTab.innerHTML = chevronIcon;
  const closeText = document.createElement("div");
  closeText.innerHTML = "Hide";
  panelTab.appendChild(closeText);
  const reactRoot = document.createElement("iframe");
  reactRoot.src = APP_URL;
  reactRoot.id = "algoTeams-iframe";
  reactRoot.allow = "clipboard-read; clipboard-write";
  const openPanelTab = document.createElement("div");
  openPanelTab.id = "algoTeams-open-panel-tab";
  openPanelTab.style.display = "none";
  const openPanelTabChevron = document.createElement("div");
  openPanelTabChevron.id = "algoTeams-open-panel-tab-chevron";
  openPanelTabChevron.innerHTML = chevronIcon;
  const openPanelTabText = document.createElement("div");
  openPanelTabText.id = "algoTeams-open-panel-tab-text";
  openPanelTabText.innerHTML = "algoTeams&nbsp;&nbsp;&nbsp;\u2694\uFE0F";
  panelTab.addEventListener("click", () => {
    setToggleState(false);
  });
  openPanelTab.addEventListener("click", () => {
    setToggleState(true);
  });
  chrome.storage.local.get("algoTeamsDarkMode", (result) => {
    if (result.algoTeamsDarkMode === true) {
      document.body.classList.add("algoTeams-dark");
    } else {
      document.body.classList.remove("algoTeams-dark");
    }
  });
  chrome.storage.local.get("algoTeamsFixedPanelToggleState", (result) => {
    if (result.algoTeamsFixedPanelToggleState === true) {
      setToggleState(true);
    } else {
      setToggleState(false);
    }
  });
  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key == "algoTeamsFixedPanelToggleState") {
        if (newValue == true) {
          setToggleState(true);
        } else {
          setToggleState(false);
        }
      }
      if (key == "algoTeamsDarkMode" && reactRoot.contentWindow) {
        reactRoot.contentWindow.postMessage(
          {
            extension: "algoTeams",
            event: "darkMode",
            isDarkMode: newValue,
          },
          APP_URL
        );
        if (newValue === true) {
          document.body.classList.add("algoTeams-dark");
        } else {
          document.body.classList.remove("algoTeams-dark");
        }
      }
    }
  });
  document.body.prepend(panelContainer);
  panelContainer.appendChild(panelTab);
  panelContainer.appendChild(reactRoot);
  openPanelTabText.prepend(openPanelTabChevron);
  openPanelTab.appendChild(openPanelTabText);
  document.body.appendChild(openPanelTab);
  function setToggleState(toggleState) {
    if (toggleState) {
      panelContainer.style.display = "block";
      openPanelTab.style.display = "none";
      chrome.storage.local.set({ algoTeamsFixedPanelToggleState: true });
    } else {
      panelContainer.style.display = "none";
      openPanelTab.style.display = "flex";
      chrome.storage.local.set({ algoTeamsFixedPanelToggleState: false });
    }
  }
}
main();
