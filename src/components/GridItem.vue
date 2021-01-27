<template lang="pug">
  div(ref="self"
      :class="className"
      :style="style"
      @mousedown="mousedown"
      @touchstart.stop="mousedown")
    slot
</template>

<script>
const CLICK_PIXEL_DISTANCE = 4;

export default {
  name: "GridItem",
  props: {
    index: {
      type: [Number, String],
      default: 0
    },
    sort: {
      type: Number,
      default: 0
    },
    cellWidth: {
      type: Number,
      default: 0
    },
    cellHeight: {
      type: Number,
      default: 0
    },
    rowCount: {
      type: Number,
      default: 0
    },
    rowShift: {
      type: Number,
      default: 0
    },
    draggable: {
      type: Boolean
    },
    dragDelay: {
      type: Number,
      default: 0
    },
    currentScroll: {
      type: Object,
      default: () => {}
    },
    scrolls: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      animate: true,
      dragging: false,

      shiftStartX: 0,
      shiftStartY: 0,

      mouseMoveStartX: 0,
      mouseMoveStartY: 0,

      shiftX: 0,
      shiftY: 0,

      timer: null,

      zIndex: 1
    };
  },
  computed: {
    className () {
      const { animate, dragging } = this;

      return [
        "v-grid-item-wrapper",
        {
          "v-grid-item-animate": animate,
          "v-grid-item-dragging": dragging
        }
      ];
    },
    style () {
      const { zIndex, cellWidth, cellHeight, top, left } = this;

      return {
        zIndex,
        width: cellWidth + "px",
        height: cellHeight + "px",
        transform: `translate3d(${left}px, ${top}px, 0)`
      };
    },

    left () {
      return this.dragging
        ? this.shiftX + this.scrolls.left
        : this.rowShift + (this.sort % this.rowCount) * this.cellWidth;
    },

    top () {
      return this.dragging
        ? this.shiftY + this.scrolls.top
        : Math.floor(this.sort / this.rowCount) * this.cellHeight;
    }
  },
  mounted () {
    this.$refs.self
      .addEventListener("transitionend", () => {
        if (!this.dragging) {
          this.zIndex = 1;
        }
      }, false);
  },
  methods: {
    WrapEvent (event) {
      const { index, sort } = this;
      return { event, index, sort };
    },

    DragStart (event) {
      const e = event.touches ? event.touches[0] : event;
      this.zIndex = 2;

      this.shiftX = this.shiftStartX = this.left;
      this.shiftY = this.shiftStartY = this.top;

      this.mouseMoveStartX = e.pageX;
      this.mouseMoveStartY = e.pageY;

      this.animate = false;
      this.dragging = true;

      document.addEventListener("mousemove", this.documentMouseMove);
      document.addEventListener("touchmove", this.documentMouseMove);

      this.$emit("dragstart", this.WrapEvent(event));
    },

    Drag (event) {
      const e = event.touches ? event.touches[0] : event;

      const distanceX = e.pageX - this.mouseMoveStartX;
      const distanceY = e.pageY - this.mouseMoveStartY;

      this.shiftX = distanceX + this.shiftStartX;
      this.shiftY = distanceY + this.shiftStartY;

      let gridX = Math.round((this.shiftX + this.scrolls.left) / this.cellWidth);
      let gridY = Math.round((this.shiftY + this.scrolls.top) / this.cellHeight);

      gridX = Math.min(gridX, this.rowCount - 1);
      gridY = Math.max(gridY, 0);

      const gridPosition = gridX + gridY * this.rowCount;

      const $event = {
        event,
        distanceX,
        distanceY,
        positionX: this.shiftX,
        positionY: this.shiftY,
        index: this.index,
        gridX,
        gridY,
        gridPosition
      };

      this.$emit("drag", $event);
    },

    mousedown (event) {
      this.$emit("mouse-down");
      if (this.draggable) {
        this.timer = setTimeout(() => {
          this.DragStart(event);
        }, this.dragDelay);
        document.addEventListener("mouseup", this.documentMouseUp);
        document.addEventListener("touchend", this.documentMouseUp);
      }
    },

    documentMouseMove (event) {
      this.$emit("mouse-move", event.pageY);
      if (this.draggable && this.dragging) {
        this.Drag(event);
      }
    },

    documentMouseUp (event) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      const dx = this.shiftStartX - this.shiftX;
      const dy = this.shiftStartY - this.shiftY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      this.animate = true;
      this.dragging = false;
      this.mouseMoveStartX = 0;
      this.mouseMoveStartY = 0;
      this.shiftStartX = 0;
      this.shiftStartY = 0;

      document.removeEventListener("mousemove", this.documentMouseMove);
      document.removeEventListener("touchmove", this.documentMouseMove);

      document.removeEventListener("mouseup", this.documentMouseUp);
      document.removeEventListener("touchend", this.documentMouseUp);

      const $event = this.WrapEvent(event);

      if (distance < CLICK_PIXEL_DISTANCE) {
        this.$emit("click", $event);
      }

      this.$emit("dragend", $event);
    }
  }
};
</script>

<style>
.v-grid-item-wrapper {
  display: block;
  position: absolute;
  box-sizing: border-box;

  left: 0;
  top: 0;

  user-select: none;
  transform: translate3d(0px, 0px, 0px);

  z-index: 1;
}

.v-grid-item-animate {
  transition: transform 800ms ease;
}
</style>
