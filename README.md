# playground-vue2

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

- :darggable boolean => 是否啟用拖移
- :sortable boolean => 是否啟用拖移
- :cellWidth Number => cell寬度
- :cellHeight Number => cell長度
- dragClass String => 啟動拖移的物件
- @change return { start, end } => 拖移結束時給予該物件的起始位置與結束位置
- @dragstart 拖拉開始
- @dragend 拖拉結束
- v-model 資料集
- slot="cell" 內部元件slot
    - :items 
    - :sort
    - @on-reload
    - @click.native

