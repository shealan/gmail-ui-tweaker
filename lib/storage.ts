import type { ZoomSettings } from "./types";
import { DEFAULT_ZOOM } from "./types";

const STORAGE_KEY = "zoomSettings";

export const storage = {
  async getZoomSettings(): Promise<ZoomSettings> {
    const result = await browser.storage.local.get(STORAGE_KEY);
    return (result[STORAGE_KEY] as ZoomSettings | undefined) ?? DEFAULT_ZOOM;
  },

  async setZoomSettings(settings: ZoomSettings): Promise<void> {
    await browser.storage.local.set({ [STORAGE_KEY]: settings });
  },
};
