import { storage } from '../lib/storage';
import { DEFAULT_ZOOM } from '../lib/types';

export default defineBackground(() => {
  // Handle installation and updates
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      // Set default zoom settings on first install
      await storage.setZoomSettings(DEFAULT_ZOOM);
    } else if (details.reason === 'update') {
      // Check and update settings if needed
      const settings = await storage.getZoomSettings();
      // Ensure all zoom properties exist
      if (!settings.w) {
        settings.w = 100;
        await storage.setZoomSettings(settings);
      }
    }
  });

  // Handle messages from popup
  browser.runtime.onMessage.addListener((message: any) => {
    if (message.openDonate) {
      browser.tabs.create({
        url: 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4LFHZT6R4K6CA',
      });
    } else if (message.openWebStore) {
      browser.management.getSelf((info) => {
        browser.tabs.create({
          url: `https://chromewebstore.google.com/detail/v7-gmail-zoom/${info.id}`,
        });
      });
    }
  });
});
