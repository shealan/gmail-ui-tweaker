import { useEffect, useState } from "react";
import { storage } from "../../lib/storage";
import type { ZoomSettings } from "../../lib/types";
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from "../../lib/types";

function App() {
  const [zoomSettings, setZoomSettings] = useState<ZoomSettings>({
    m: 100,
    l: 100,
    w: 100,
  });

  useEffect(() => {
    // Load settings on mount
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await storage.getZoomSettings();
    setZoomSettings(settings);
  };

  const updateZoom = async (key: keyof ZoomSettings, value: number) => {
    const newSettings = { ...zoomSettings, [key]: value };
    setZoomSettings(newSettings);
    await storage.setZoomSettings(newSettings);

    // Notify content scripts to update
    const tabs = await browser.tabs.query({ url: "https://mail.google.com/*" });
    tabs.forEach((tab) => {
      if (tab.id) {
        browser.tabs.sendMessage(tab.id, {
          type: "updateZoom",
          settings: newSettings,
        });
      }
    });
  };

  const handleDecrease = (key: keyof ZoomSettings) => {
    if (zoomSettings[key] > MIN_ZOOM) {
      updateZoom(key, zoomSettings[key] - ZOOM_STEP);
    }
  };

  const handleIncrease = (key: keyof ZoomSettings) => {
    if (zoomSettings[key] < MAX_ZOOM) {
      updateZoom(key, zoomSettings[key] + ZOOM_STEP);
    }
  };

  const handleReset = (key: keyof ZoomSettings) => {
    updateZoom(key, 100);
  };

  const openDonate = () => {
    browser.runtime.sendMessage({ openDonate: true });
  };

  const openWebStore = () => {
    browser.runtime.sendMessage({ openWebStore: true });
  };

  return (
    <div className="animate-[slideIn_0.2s_ease-out]">
      {/* Header */}
      <div className="relative h-8 flex items-center justify-between px-2 bg-green-600">
        <div className="text-white font-semibold text-base">
          Gmail UI Tweaker
        </div>
        <div className="text-white text-xs">Make Gmail your own</div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* List Zoom */}
        <ZoomControl
          label="Inbox text size"
          value={zoomSettings.l}
          onDecrease={() => handleDecrease("l")}
          onReset={() => handleReset("l")}
          onIncrease={() => handleIncrease("l")}
        />

        {/* Message Zoom */}
        <ZoomControl
          label="View text size"
          value={zoomSettings.m}
          onDecrease={() => handleDecrease("m")}
          onReset={() => handleReset("m")}
          onIncrease={() => handleIncrease("m")}
        />

        {/* Compose Zoom */}
        <ZoomControl
          label="Compose text size"
          value={zoomSettings.w}
          onDecrease={() => handleDecrease("w")}
          onReset={() => handleReset("w")}
          onIncrease={() => handleIncrease("w")}
        />
      </div>
    </div>
  );
}

interface ZoomControlProps {
  label: string;
  value: number;
  onDecrease: () => void;
  onReset: () => void;
  onIncrease: () => void;
}

function ZoomControl({
  label,
  value,
  onDecrease,
  onReset,
  onIncrease,
}: ZoomControlProps) {
  return (
    <div className="flex items-center justify-between mb-3 last:mb-0">
      {/* Icon and Label */}
      <div className="flex items-center gap-2 flex-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onDecrease}
          disabled={value <= MIN_ZOOM}
          className="size-6 flex items-center justify-center rounded border-none bg-gray-200 cursor-pointer transition-colors duration-200 hover:bg-gray-300"
          title="Decrease"
        >
          <svg className="w-4 h-4 fill-[#404040]" viewBox="0 0 24 24">
            <path d="M19 13H5v-2h14v2z" />
          </svg>
        </button>

        <button
          onClick={onReset}
          className="min-w-[60px] h-6 px-2 flex items-center justify-center rounded border-none bg-gray-100 cursor-pointer transition-colors duration-200 hover:bg-[rgba(187,214,255,0.3)] text-sm font-semibold text-gray-700"
          title="Reset to 100%"
        >
          {value}%
        </button>

        <button
          onClick={onIncrease}
          disabled={value >= MAX_ZOOM}
          className="size-6 flex items-center justify-center rounded border-none bg-gray-200 cursor-pointer transition-colors duration-200 hover:bg-gray-300"
          title="Increase"
        >
          <svg className="w-4 h-4 fill-[#404040]" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
