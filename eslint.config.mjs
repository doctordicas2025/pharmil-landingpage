import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "skills/**",
    "interface-design/**",
    "design-system/reference/**",
    ".tmp/**",
    "next-env.d.ts",
  ]),
  {
    // Aderencia ao design system: o contrato em DESIGN.md diz que nenhum valor
    // de cor vai hardcoded. Esta regra faz valer no codigo de interface.
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/]",
          message:
            "Cor hardcoded. Use um token de design-system/tokens/tokens.css, por exemplo var(--color-wine).",
        },
        {
          selector:
            "TemplateElement[value.raw=/#(?:[0-9a-fA-F]{6})\\b/]",
          message:
            "Cor hardcoded em template string. Use um token de design-system/tokens/tokens.css.",
        },
      ],
    },
  },
]);
