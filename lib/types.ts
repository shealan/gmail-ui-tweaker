// Types for Gmail Zoom extension

export interface ZoomSettings {
  m: number; // message zoom
  l: number; // list zoom
  w: number; // write/compose zoom
}

export const DEFAULT_ZOOM: ZoomSettings = {
  m: 100,
  l: 100,
  w: 100,
};

export const MIN_ZOOM = 30;
export const MAX_ZOOM = 250;
export const ZOOM_STEP = 10;
