import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    name: "Gmail UI Tweaker",
    description: "Make Gmail your own",
    version: "1.0.0",
    permissions: ["storage", "management", "tabs"],
    host_permissions: ["https://mail.google.com/*"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  outDir: "output",
});
