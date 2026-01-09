import type { ZoomSettings } from "../lib/types";
import { storage } from "../lib/storage";

export default defineContentScript({
  matches: ["https://mail.google.com/*"],
  runAt: "document_start",

  async main() {
    let zoomSettings: ZoomSettings;
    const styleElement = document.createElement("style");

    // Load and apply initial zoom settings
    zoomSettings = await storage.getZoomSettings();
    applyZoomStyles();

    // Listen for zoom updates from popup
    browser.runtime.onMessage.addListener((message: any) => {
      if (message.type === "updateZoom" && message.settings) {
        zoomSettings = message.settings;
        applyZoomStyles();
      }
    });

    // Listen for storage changes
    browser.storage.onChanged.addListener((changes) => {
      if (changes.zoomSettings) {
        zoomSettings = changes.zoomSettings.newValue as ZoomSettings;
        applyZoomStyles();
      }
    });

    function applyZoomStyles() {
      // Use exact same approach as reference extension
      // Simple CSS zoom property on the three Gmail classes
      const css = `.ii {zoom:${zoomSettings.m}%} .Au {zoom:${zoomSettings.w}% !important} .F {zoom:${zoomSettings.l}%} .gb_0c {padding-right: 0 !important}`;

      styleElement.textContent = css;
      const head = document.getElementsByTagName("head")[0];
      if (head && !styleElement.parentNode) {
        head.appendChild(styleElement);
      }
    }
  },
});
