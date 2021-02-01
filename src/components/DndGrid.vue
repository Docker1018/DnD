
<template lang="pug">
  #DndGrid
    .v-grid(:style="style" ref="vGrid")
      GridItem(v-for="item in list"
              :key="item.index"
              :index="item.index"
              :sort="item.sort"
              :draggable="canDrag"
              :drag-delay="dragDelay"
              :row-count="rowCount"
              :cell-width="cellWidth"
              :cell-height="cellHeight"
              :window-width="currentWidth"
              :row-shift="rowShift"
              :currentScroll="currentScroll"
              :scrolls="scrollSize"
              @dragstart="OnDragStart"
              @dragend="OnDragEnd"
              @drag="OnDrag"
              @click="OnClick"
              @mouse-down="MouseDown"
              @mouse-move="MouseMove")
        slot(name="cell"
            :item="item.item"
            :index="item.index"
            :sort="item.sort"
            :remove="() => { RemoveItem(v) }")
  </div>
</template>
<script>
import windowSize from "@/components/reSize.js";
import GridItem from "@/components/GridItem.vue";
export default {
  name: "DndGrid",
  components: {
    GridItem
  },
  mixins: [windowSize],
  props: {
    value: {
      type: Array,
      default: () => []
    },
    cellWidth: {
      type: Number,
      default: 80
    },
    cellHeight: {
      type: Number,
      default: 80
    },
    draggable: { // 使用拖移
      type: Boolean,
      default: false
    },
    dragDelay: { // 拖移延遲
      type: Number,
      default: 0
    },
    center: { // 置中
      type: Boolean,
      default: false
    },
    dragClass: { // 拖拉 class 項目
      type: String,
      default: ""
    }
  },
  data () {
    return {
      scrolls: {
        top: 0,
        left: 0
      },
      currentScroll: {
        top: 0,
        left: 0
      },
      isScrollMove: 0,
      list: [],
      classDrag: false,
      startSort: 0,
      endSort: 0,
      parentEl: null,
      parentHeight: 0
    };
  },
  computed: {
    canDrag () { // 是否可拖移
      if (this.dragClass.trim().length > 0) {
        return this.draggable && this.classDrag;
      }
      return this.draggable;
    },
    height () {
      return Math.ceil(this.list.length / this.rowCount) *
        this.cellHeight;
    },
    style () {
      return {
        height: this.height + "px"
      };
    },
    rowCount () {
      return Math.floor(this.currentWidth / this.cellWidth);
    },
    rowShift () {
      if (this.center) {
        const contentWidth = this.list.length * this.cellWidth;
        const rowShift = contentWidth < this.currentWidth
          ? (this.currentWidth - contentWidth) / 2
          : (this.currentWidth % this.cellWidth) / 2;
        return Math.floor(rowShift);
      }
      return 0;
    },
    scrollSize () {
      return {
        top: this.scrolls.top - this.currentScroll.top,
        left: this.scrolls.left - this.currentScroll.left
      };
    }
  },
  watch: {
    value: {
      handler: function (nextItems = []) {
        this.list = nextItems.map((item, index) => {
          return {
            item,
            index: item.id || index,
            sort: index
          };
        });
        this.BindEvent();
        this.$nextTick(() => {
          this.scrollHeight = this.parentEl.scrollHeight;
        });
      },
      immediate: true
    },
    classDrag (val) {
      if (!val) {
        this.isScrollMove = 0;
      }
    },
    // 判斷是否向上/下滾動
    isScrollMove (newval, oldval) {
      if (newval === oldval) return;
      switch (newval) {
        case 0: {
          clearInterval(this.add);
          clearInterval(this.less);
          return;
        }
        case -1: {
          this.less = setInterval(() => {
            if (this.isScrollMove === 1 || this.parentEl.scrollTop === 0) {
              clearInterval(this.less);
              return;
            }
            this.parentEl.scrollTop -= 10;
            this.scrolls.top -= 10;
          }, 10);
          return;
        }
        case 1: {
          this.add = setInterval(() => {
            if (this.isScrollMove !== 1 || (this.parentEl.scrollTop + this.parentEl.offsetHeight) > (this.scrollHeight + this.cellHeight)) {
              clearInterval(this.add);
              return;
            }
            this.parentEl.scrollTop += 10;
            this.scrolls.top += 10;
          }, 10);
        }
      }
    }
  },
  beforeDestroy () {
    this.ClearEvent();
    this.parentEl.removeEventListener("scroll", this.ScrollEvent);
    this.scrolls = {};
    this.$nextTick(() => {
      this.scrolls = {
        top: 0,
        left: 0
      };
    });
  },
  mounted () {
    this.parentEl = this.$refs.vGrid.parentElement;
    this.parentEl.addEventListener("scroll", this.ScrollEvent);
  },
  methods: {
    // 滑鼠按下時記錄的滾動條位置及高度
    MouseDown () {
      this.currentScroll.top = this.scrolls.top;
      this.currentScroll.left = this.scrolls.left;
      this.scrollHeight = this.parentEl.scrollHeight;
    },
    // 滾動時紀錄下滾動長度 並傳送到子組件同步做位移
    ScrollEvent (event) {
      this.scrolls.top = event.target.scrollTop;
      this.scrolls.left = event.target.scrollLeft;
    },
    // 根據滑鼠抓住的組件位置來決定是否滾動拉條
    MouseMove (pageY) {
      if (!this.classDrag) {
        this.isScrollMove = 0;
        return;
      }
      this.isScrollMove = 0;
      pageY -= this.parentEl.offsetTop;
      if (pageY < this.cellHeight) {
        this.isScrollMove = -1;
        return;
      }
      if (pageY > (this.parentEl.offsetHeight - this.cellHeight)) {
        this.isScrollMove = 1;
        return;
      }
      this.isScrollMove = 0;
    },
    ClearEvent () {
      if (this.dragClass.trim().length > 0) {
        document.getElementsByClassName(this.dragClass).forEach(el => {
          el.removeEventListener("mousedown", this.OpenClassDrag);
          el.removeEventListener("touchstart", this.OpenClassDrag);
        });
      }
    },
    BindEvent () {
      if (this.dragClass.trim().length > 0) {
        this.$nextTick(() => {
          document.getElementsByClassName(this.dragClass).forEach(el => {
            el.addEventListener("mousedown", this.OpenClassDrag);
            el.addEventListener("touchstart", this.OpenClassDrag);
          });
        });
      }
    },
    OpenClassDrag () {
      this.classDrag = true;
    },
    CloseClassDrag () {
      this.classDrag = false;
    },
    /* Returns merged event object */
    WrapEvent (other = {}) {
      return {
        datetime: Date.now(),
        items: this.GetListClone(),
        ...other
      };
    },
    /* Returns sorted clone of "list" array */
    GetListClone () {
      return this.list
        .slice(0)
        .sort((a, b) => {
          return a.sort - b.sort;
        });
    },
    // 拖移開始
    OnDragStart (event) {
      this.startSort = event.sort;
      this.$emit("dragstart", this.WrapEvent(event));
    },
    // 拖移結束
    OnDragEnd (event) {
      this.CloseClassDrag();
      this.$emit("dragend", this.WrapEvent(event));
      this.endSort = event.sort;
      this.$emit("change", { start: this.startSort, end: this.endSort });
      setTimeout(() => {
        const list = this.GetListClone().map(obj => obj.item);
        this.$emit("input", list);
      }, 1000);
    },
    OnClick (event) {
      this.$emit("click", this.WrapEvent(event));
    },
    OnDrag (event) {
      this.SortList(event.index, event.gridPosition);
      this.$emit("drag", this.WrapEvent({ event }));
    },

    SortList (itemIndex, gridPosition) {
      const targetItem = this.list.find(item => item.index === itemIndex);
      const targetItemSort = targetItem.sort;
      /*
        Normalizing new grid position
      */
      gridPosition = Math.max(gridPosition, 0);
      /*
        If you remove this line you can drag items to positions that
        are further than items array length
      */
      gridPosition = Math.min(gridPosition, this.list.length - 1);
      if (targetItemSort !== gridPosition) {
        this.list = this.list.map(item => {
          if (item.index === targetItem.index) {
            return {
              ...item,
              sort: gridPosition
            };
          }
          const { sort } = item;
          if (targetItemSort > gridPosition) {
            if (sort <= targetItemSort && sort >= gridPosition) {
              return {
                ...item,
                sort: sort + 1
              };
            }
          }
          if (targetItemSort < gridPosition) {
            if (sort >= targetItemSort && sort <= gridPosition) {
              return {
                ...item,
                sort: sort - 1
              };
            }
          }
          return item;
        });
        this.$emit("sort", this.WrapEvent());
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#DndGrid {
    width: 100%;
    height: 100%;
    overflow: auto;
    .v-grid {
      display: block;
      position: relative;
    }
}
</style>
