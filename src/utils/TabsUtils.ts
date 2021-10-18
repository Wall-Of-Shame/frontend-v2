import { isPlatform } from "@ionic/react";

export function hideTabs() {
  if (isPlatform("desktop")) {
    return;
  }
  const tabsEl = document.getElementById("mobile-nav-tabs");
  if (tabsEl) {
    tabsEl.hidden = true;
  }
}

export function showTabs() {
  if (isPlatform("desktop")) {
    return;
  }
  const tabsEl = document.getElementById("mobile-nav-tabs");
  if (tabsEl) {
    tabsEl.hidden = false;
  }
}
