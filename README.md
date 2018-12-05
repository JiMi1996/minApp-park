# vue-seed

> A Vue.js project

## Plugin
``` bash
Beautify
EditorConfig for VS Code
ESLint
Prettier
Vetur
```

## VS Code config
``` bash
{
  "explorer.confirmDelete": false,
  "eslint.validate": ["javascript", "javascriptreact", "html", "vue"],
  "eslint.options": {
    "plugins": ["html"]
  },
  "emmet.syntaxProfiles": {
    "vue-html": "html",
    "vue": "html"
  },
  "vetur.validation.template": false,
  "prettier.singleQuote": true,
  "prettier.semi": false,
  "beautify.language": {
    "js": {
      "type": ["javascript", "json"],
      "filename": [".jshintrc", ".jsbeautify"]
    },
    "css": ["css", "scss"],
    "html": ["htm", "html", "vue"]
  }
}

```

## VS Code keyboard config
``` bash
[
  {
    "key": "cmd+b",
    "command": "HookyQR.beautify",
    "when": "editorFocus"
  }
]
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
