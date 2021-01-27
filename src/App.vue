<template lang="pug">
  #app
    DndGrid(
            :draggable="true"
            :sortable="true"
            :cellWidth="310"
            :cellHeight="80"
            v-model="items"
            )
      template(slot="cell" scope="props")
        p !!
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
      items: [{},{},{},{},{},{},{},{}]
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
  margin-top: 60px;
}
</style>
