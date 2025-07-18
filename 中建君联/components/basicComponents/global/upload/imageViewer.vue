<template>
  <div :style="{height:height,width:width}"
       v-if="visible" @click="hideImage" class="imageViewerWrap">
    <div class="see-image" :style="{ backgroundColor:background }">
      <!-- v-drag="greet" -->
      <img id="drag" class="image" :src="imgSrc" @mousewheel="wheel"
           ref="user_image"/>
    </div>
    <div class="rotate" @click.stop="rotateImage"
         v-show="rotateButtonVisible">
      <i class="el-icon-refresh-left"></i>
    </div>
    <ul class="dotes" v-if="imageViewerList.length>1">
      <li @click.stop="handleCurrentChange(index)"
          v-for="(item,index) in imageViewerList" :key="index">
        <span :class="currentPage===index?'active':''">{{index+1}}</span>
      </li>
    </ul>
  </div>
</template>

<script>
  // 配置选项
  const config = {
    canClickModalHide: true, // 控制是否点击遮罩层关闭
    closeButtonVisible: true, // 控制关闭按钮是否可见，若设置为false则canClickModalHide必定为true
    modalOpacity: 0.5, // 控制遮罩层的透明度（0-1之间的number类型）
    rotateButtonVisible: true // 控制旋转按钮是否可见
  };

  const {modalOpacity, canClickModalHide, rotateButtonVisible, closeButtonVisible} = config;
  export default {
    data () {
      return {
        width: '1200px',
        height: '500px',
        currentPage: 0,
        background: modalOpacity > 1 || modalOpacity <= 0 || typeof modalOpacity !== 'number' ? null : `rgba(0,0,0,${modalOpacity})`,
        rotateButtonVisible,
        closeButtonVisible,
        imgSrc: ''
      };
    },
    created () {
      this.width = `${document.body.offsetWidth}px`;
      this.height = `${document.body.offsetHeight}px`;
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      currentImg: {
        type: String,
        default: ''
      },
      imageViewerList: {
        type: Array,
        default: () => []
      }
    },
    watch: {
      currentImg: {
        handler () {
          this.imgSrc = this.currentImg;
        },
        immediate: true
      },
      imageViewerList: {
        handler () {
          const index = this.imageViewerList.findIndex(v => v.imagePath === this.currentImg);
          this.currentPage = index;
        },
        immediate: true
      }
    },
    methods: {
      // 切换图片
      handleCurrentChange (index) {
        this.imgSrc = this.imageViewerList[index].imagePath;
        this.currentPage = index;
      },
      close () {
        this.clearImg();
      },
      // 接受传来的位置数据，并将数据绑定给data下的val
      greet (val) {
        this.val = val;
      },
      // 点击图片之外区域隐藏图片
      hideImage () {
        if (!this.visible || (!canClickModalHide && closeButtonVisible)) return;
        document.addEventListener('click', (e) => {
          if (e.target.nodeName !== 'IMG' && e.target.nodeName !== 'BUTTON') {
            this.clearImg();
          }
        });
      },
      // 旋转图片
      rotateImage () {
        const fromRotateDeg = this.$refs.user_image.style.transform.split(' ');
        switch (fromRotateDeg[0]) {
          case 'rotate(0deg)':
            fromRotateDeg[0] = 'rotate(90deg)';
            break;
          case 'rotate(90deg)':
            fromRotateDeg[0] = 'rotate(180deg)';
            break;
          case 'rotate(180deg)':
            fromRotateDeg[0] = 'rotate(270deg)';
            break;
          case 'rotate(270deg)':
            fromRotateDeg[0] = 'rotate(360deg)';
            break;
          default:
            fromRotateDeg[0] = 'rotate(90deg)';
            break;
        }
        this.$refs.user_image.style.transform = fromRotateDeg.join(' ');
      },
      // 滚轮
      wheel (e) {
        if (e.wheelDelta) { // 判断浏览器IE，谷歌滑轮事件
          if (e.wheelDelta > 0) { // 当滑轮向上滚动时
            this.$refs.user_image.style.transform = `${this.$refs.user_image.style.transform} scale(0.9)`;
          }
          if (e.wheelDelta < 0) { // 当滑轮向下滚动时
            this.$refs.user_image.style.transform = `${this.$refs.user_image.style.transform} scale(1.1)`;
          }
        } else if (e.detail) { // Firefox滑轮事件
          if (e.detail > 0) { // 当滑轮向上滚动时
            this.$refs.user_image.style.transform = `${this.$refs.user_image.style.transform} scale(0.9)`;
          }
          if (e.detail < 0) { // 当滑轮向下滚动时
            this.$refs.user_image.style.transform = `${this.$refs.user_image.style.transform} scale(1.1)`;
          }
        }
      },
      // 当图片隐藏时候的回调
      clearImg () {
        this.$emit('clearImg');
      }
    }
  };
</script>

<style scoped lang="scss">
  .imageViewerWrap {
    position: fixed;
    z-index: 21000;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .see-image {
    width: 100%;
    z-index: 9999;
    background: rgba(0, 0, 0, .5);
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: .25s showAimation ease;
  }

  @keyframes showAimation {
    from {
      opacity: .3;
    }
    to {
      opacity: 1;
    }
  }

  .image {
    max-width: 800px;
    min-width: 150px;
    position: absolute;
    max-height: 600px;
  }

  .rotate {
    width: 30px;
    height: 30px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    bottom: 50px;
    left: 50%;
    margin-left: -15px;
    color: #000;
    border: 1px solid rgba(0, 0, 0, .4);
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10000;
  }

  .rotate img {
    width: 10px;
  }

  .rotate:hover {
    background: #009F3A;
    border: 1px solid #009F3A;
  }

  .close {
    position: absolute;
    right: 140px;
    top: 140px;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: .3s;
    cursor: pointer;
    z-index: 10000;
  }

  .close:hover {
    transform: rotate(90deg);
  }

  .close img {
    width: 40px;
    height: 40px;
  }

  .dotes {
    position: absolute;
    width: 100%;
    bottom: 10px;
    z-index: 10000;
    /*background: pink;*/
    text-align: center;
    li {
      display: inline-block;
      background-color: transparent;
      padding: 12px 4px;
      cursor: pointer;
      margin: 0 8px;
      span {
        height: 20px;
        width: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 50%;
        display: block;
        opacity: .48;
        background-color: #fff;
        border: none;
        outline: 0;
        padding: 0;
        margin: 0;
        cursor: pointer;
        -webkit-transition: .3s;
        transition: .3s;
        &.active {
          opacity: 1;
        }
      }
    }

  }
</style>
