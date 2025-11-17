module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  ignorePatterns: ["dist", "node_modules"],
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }]
  }
};
