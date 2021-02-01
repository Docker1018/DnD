<template lang="pug">
  #app
    .test-area
      DndGrid(
              :draggable="true"
              :sortable="true"
              :cellWidth="310"
              :cellHeight="80"
              dragClass="drag"
              v-model="items"
              )
        template(slot="cell" scope="props")
          .cell-event
            p {{props.item.id}}
            button.drag dragging
</template>

<script>
import DndGrid from "@/components/DndGrid"
export default {
  name: 'App',
  components: {
    DndGrid,
  },
  data() {
    return {
      items: [
        {id: 1},
        {id: 2},
        {id: 3},
        {id: 4},
        {id: 5},
        {id: 6},
        {id: 7},
        {id: 8},
        {id: 9},
        {id: 10},
        {id: 11},
        {id: 12},
        {id: 13},
        {id: 14},
        {id: 15},
        {id: 16},
        {id: 17},
        {id: 18},
        {id: 19},
        {id: 20},
        {id: 21}
      ]
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .test-area {
    height: 600px;
    .cell-event {
      background-color: turquoise;
      margin: 5px;
    }
  }
}
</style>
