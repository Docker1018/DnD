import DndGrid from "./DndGrid";
import GridItem from "./GridItem";

const Components = [DndGrid, GridItem];

const install = function (Vue) {
  Components.forEach(component => {
    Vue.component(component.name, component);
  })
}

export default {
  install
}