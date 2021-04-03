
module.exports = /*{
  root: true,
  plugins: ["license-header"],
  extends: ["@inrupt/eslint-config-react"],
  rules: {
    "@typescript-eslint/ban-ts-comment": 0,
    "license-header/header": [1, "./resources/license-header.js"],
  },
}*/
{
  "extends": "eslint:recommended",
  "rules": {
      "consistent-return": 2,
      "indent"           : [1, 4],
      "no-else-return"   : 1,
      "semi"             : [1, "always"],
      "space-unary-ops"  : 2
  }
}