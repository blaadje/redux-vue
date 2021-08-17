module.exports = {
  root: true,
  ignorePatterns: ["lib"],
  extends: [
    "airbnb-base",
    "prettier",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "arrow-body-style": ["error", "always"],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        vue: "never",
      },
    ],
    "no-shadow": [
      "error",
      { builtinGlobals: false, hoist: "functions", allow: ["state"] },
    ],
    "newline-after-var": ["error", "always"],
    "no-param-reassign": [
      "error",
      { props: true, ignorePropertyModificationsFor: ["state"] },
    ],
    "import/newline-after-import": ["error", { count: 1 }],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        alphabetize: { order: "asc" },
        "newlines-between": "always",
      },
    ],
  },
  settings: {
    "import/resolver": {
      alias: {
        extensions: [".js"],
      },
    },
  },
};
