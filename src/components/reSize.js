export default {
    data () {
      return {
        currentHeight: 0,
        currentWidth: 0
      };
    },
    // created () {
    //   window.addEventListener("resize", this.getWindowSize);
    //   this.getWindowSize();
    // },
    mounted () {
      window.addEventListener("resize", this.getWindowSize);
      this.getWindowSize();
    },
    beforeDestroy () {
      window.removeEventListener("resize", this.getWindowSize);
    },
  
    methods: {
      getWindowSize () {
        if (this.$el) {
          this.currentHeight = this.$el.clientHeight;
          this.currentWidth = this.$el.clientWidth;
          this.scrollHeight = this.currentHeight;
        }
      }
    }
  };
  