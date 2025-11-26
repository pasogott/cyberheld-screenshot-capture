import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions, // ✅ Add this line
      },
    },
    rules: {
      "no-unused-vars": "off", // ✅ Disable unused vars rule
      "vue/no-unused-vars": "off", // ✅ Disable unused vars rule
    }
  },
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.webextensions
      }
    },
    rules: {
      "no-unused-vars": "off", // ✅ Disable unused vars rule
      "vue/no-unused-vars": "off", // ✅ Disable unused vars rule
    }
  },
]);
