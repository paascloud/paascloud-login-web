<template>
  <div>
    <transition name="slide">
      <div class="notification fixed"
           v-if="myShow"
           :style="setStyle">
        <div class="delete"
             v-if="!myOptions.autoClose"
             @click="close()"></div>
        <div class="content" v-html="myOptions.content">
        </div>
      </div>
    </transition>
    <div class="countdown"
         v-if="myShow && myOptions.autoClose && myOptions.countdownBar"
         :style="setTime"
         :class="barControl"></div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        timers: [],
        barControl: '',
        myOptions: this.options,
        myShow: this.show
      };
    },
    computed: {
      setStyle () {
        return {
          color: this.myOptions.textColor || '#fff',
          background: this.myOptions.backgroundColor || '#fc5050'
        };
      },
      setTime () {
        return {
          transition: `all ${(this.myOptions.showTime / 1000) || 3}s linear`,
          background: this.myOptions.barColor || '#03D6D2'
        };
      },
      options () {
        return this.$store.getters.getNoticeOptions || {};
      },
      show () {
        return this.$store.getters.getNoticeShow || false;
      }
    },
    methods: {
      countdown () {
        if (this.myOptions.autoClose) {
          if (this.myOptions.countdownBar) {
            setTimeout(() => {
              this.barControl = 'count-leave';
            }, 10);
          }
          const t = setTimeout(() => {
            this.close();
          }, this.myOptions.showTime || 3000);
          this.timers.push(t);
        }
      },
      close () {
        this.$emit('close');
        this.myOptions = {};
      }
    },
    watch: {
      options () {
        this.myOptions = this.options;
        this.barControl = '';
        this.timers.forEach((timer) => {
          window.clearTimeout(timer);
        });
        this.timers = [];
        this.countdown();
      },
      show (val) {
        this.myShow = val;
      }
    }
  };
</script>

<style scoped>
  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0; /*初始状态 透明度为0*/
      transform: translate3d(0, -100%, 0);
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1; /*结尾状态 透明度为1*/
      transform: translate3d(0, 0, 0);
    }
  }

  @-webkit-keyframes fadeOut {
    0% {
      opacity: 1; /*初始状态 透明度为0*/
    }
    50% {
      opacity: 0.5; /*中间状态 透明度为0*/
    }
    100% {
      opacity: 0; /*结尾状态 透明度为1*/
      transform: translate3d(0, -100%, 0);
    }
  }

  .slide-enter-active {
    animation-name: fadeIn;
    animation-duration: 2s;
    animation-delay: 0s;
    animation-iteration-count: 1
  }

  .slide-leave-active {
    animation-name: fadeOut;
    animation-duration: 2s;
    animation-delay: 0s;
    animation-iteration-count: 1
  }

  .delete {
    -moz-appearance: none;
    -webkit-appearance: none;
    background: rgba(51, 51, 51, .2);
    cursor: pointer;
    display: inline-block;
    height: 24px;
    position: relative;
    vertical-align: top;
    width: 24px;
    float: right;
  }

  .delete:after,
  .delete:before {
    background: #fff;
    content: "";
    display: block;
    height: 2px;
    left: 50%;
    margin-left: -25%;
    margin-top: -1px;
    position: absolute;
    top: 50%;
    width: 50%;
  }

  .delete:before {
    transform: rotate(45deg);
  }

  .delete:after {
    transform: rotate(-45deg);
  }

  .delete:hover {
    background: rgba(51, 51, 51, .5);
  }

  .notification {
    width: 16%;
    line-height: 2;
    z-index: 3;
    position: fixed;
    top: 10%;
    right: 20px;
  }

  .notification .content {
    font-size: 15px;
    padding: .75rem 2rem;
  }

  .countdown {
    width: 100%;
    height: 4px;
    background: #000;
    z-index: 3;
    position: fixed;
    top: 0;
    left: 0;
    /*transform: translateZ(0);*/
  }

  .count-leave {
    transform: translate3d(-100%, 0, 0);
  }
</style>
