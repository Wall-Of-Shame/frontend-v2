export function hideTabs() {
  const tabsEl = document.getElementById("mobile-nav-tabs");
  if (tabsEl) {
    tabsEl.hidden = true;
  }
}

export function showTabs() {
  const tabsEl = document.getElementById("mobile-nav-tabs");
  if (tabsEl) {
    tabsEl.hidden = false;
  }
}
