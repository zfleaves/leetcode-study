<!--
 * @Author: your name
 * @Date: 2020-07-08 16:07:21
 * @LastEditTime: 2020-08-29 10:55:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_portal\src\components\business\cropper\cropper.vue
-->
<template>
	<div class="wrapper">
		<div class="model" v-show="model">
			<div class="model-show" @click="model = false">
				<img :src="modelSrc" alt="" @click="model = false">
			</div>
		</div>
		<div class="content">
			<div class="show-info">
                <!-- 上传截取 -->
                <div style="flex:5">
                    <div class="test test1">
                        <vueCropper
                            ref="cropper"
                            :img="option.img"
                            :outputSize="option.size"
                            :outputType="option.outputType"
                            :info="true"
                            :full="option.full"
                            :canMove="option.canMove"
                            :canMoveBox="option.canMoveBox"
                            :fixedBox="option.fixedBox"
                            :original="option.original"
                            :autoCrop="option.autoCrop"
                            :autoCropWidth="option.autoCropWidth"
                            :autoCropHeight="option.autoCropHeight"
                            :centerBox="option.centerBox"
                            :high="option.high"
                            :infoTrue="option.infoTrue"
                            :maxImgSize="option.maxImageSize"
                            @realTime="realTime"
                            @imgLoad="imgLoad"
                            @cropMoving="cropMoving"
                            :enlarge="option.enlarge"
                            :mode="option.mode"
                        ></vueCropper>
                    </div>
                    <div class="test-button">
                      <!-- 上传签名图 -->
                        <label class="btn" for="uploads">{{$t('dialog.uploadSignatureMap')}}</label>
                        <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
                        <button v-if="this.option.img" @click="refreshCrop" class="btn"><span class="el-icon-refresh"></span></button>
                        <button v-if="this.option.img" @click="changeScale(1)" class="btn"><span class="el-icon-zoom-in"></span></button>
                        <button v-if="this.option.img" @click="changeScale(-1)" class="btn"><span class="el-icon-zoom-out"></span></button>
                        <!-- 向左旋转 -->
                        <button v-if="this.option.img" @click="rotateLeft" class="btn">{{$t('dialog.rotateLeft')}}90°</button>
                        <!-- 向右旋转 -->
                        <button v-if="this.option.img" @click="rotateRight" class="btn">{{$t('dialog.rotateRight')}}90°</button>
                    </div>
                </div>

                <!-- 签名预览 -->
				<div class="pre"  style="flex:4">
          <div style="height:300px">
              <section class="pre-item">
                <!-- 截图框大小 -->
                <p>{{$t('dialog.screenshotBoxSize')}}</p>
                <div class="show-preview"  :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden',
                  'margin': '20px auto'}">
                  <div :style="previews.div">
                    <img :src="previews.url" :style="previews.img">
                  </div>
                </div>
              </section>
              <section class="pre-item">
                <!-- 中等大小 -->
                  <p>{{$t('dialog.secondarySize')}}</p>
                  <div :style="previewStyle1">
                      <div :style="previews.div">
                          <img :src="previews.url" :style="previews.img">
                      </div>
                  </div>
              </section>

              <section class="pre-item">
                <!-- 迷你大小 -->
                  <p>{{$t('dialog.miniSize')}}</p>
                  <div :style="previewStyle2">
                  <div :style="previews.div">
                      <img :src="previews.url" :style="previews.img">
                  </div>
                  </div>
              </section>
          </div>
          <div class="signPic">
            <!-- 已上传签名 -->
            <p class="signPic-title">{{$t('dialog.signatureUploaded')}}：</p>
            <el-image :src="imgUrl" class="signPic-img">
                <div slot="error" class="image-slot logo-seize">
                    <i class="el-icon-user-solid"></i>
                </div>
            </el-image>
          </div>
          <div style="text-align: center;"  v-if="this.option.img">
            <!-- 保存签名 -->
              <a @click="down('base64')" class="btn">{{$t('dialog.saveSignature')}}</a>
              <a :href="downImg" download="demo.png" ref="downloadDom"></a>
          </div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  data() {
    return {
      model: false,
      modelSrc: '',
      crap: false,
      previews: {},
      lists: [
        {
          img: require('assets/images/print.jpg')
        }
      ],
      option: {
        img: '',
        size: 1,
        full: false,
        outputType: 'png',
        canMove: true,
        fixedBox: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 150,
        autoCropHeight: 50,
        centerBox: false,
        high: false,
        cropData: {},
		enlarge: 1,
        mode: 'contain',
        maxImgSize: 2000
      },
      example2: {
        img: '',
        info: true,
        size: 1,
        outputType: 'png',
        canScale: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 150,
        autoCropHeight: 50,
        fixed: true,
        // 真实的输出宽高
        infoTrue: true,
        fixedNumber: [4, 4]
      },
      downImg: '#',
      previewStyle1: {},
      previewStyle2: {},
      previewStyle3: {},
      previewStyle4: {}
    };
  },
  props: {
    imgUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    startCrop() {
      // start
      this.crap = true;
      this.$refs.cropper.startCrop();
    },
    stopCrop() {
      //  stop
      this.crap = false;
      this.$refs.cropper.stopCrop();
    },
    clearCrop() {
      // clear
      this.$refs.cropper.clearCrop();
    },
    refreshCrop() {
      // clear
      this.$refs.cropper.refresh();
    },
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    finish(type) {
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(data => {
          const img = window.URL.createObjectURL(data);
          this.model = true;
          this.modelSrc = img;
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.model = true;
          this.modelSrc = data;
        });
      }
    },
    // 实时预览函数
    realTime(data) {
      const previews = data;
      const h = 0.5;
      const w = 0.2;

      this.previewStyle1 = {
        width: `${previews.w}px`,
        height: `${previews.h}px`,
        overflow: 'hidden',
        zoom: h,
        margin: '20px auto'
      };

      this.previewStyle2 = {
        width: `${previews.w}px`,
        height: `${previews.h}px`,
        overflow: 'hidden',
        zoom: w,
        margin: '10px auto'
      };

      this.previewStyle3 = {
        width: `${previews.w}px`,
        height: `${previews.h}px`,
        overflow: 'hidden',
        zoom: (100 / previews.w),
        margin: '20px auto'
      };

      this.previewStyle4 = {
        width: `${previews.w}px`,
        height: `${previews.h}px`,
        overflow: 'hidden',
        zoom: (100 / previews.h),
        margin: '20px auto'
      };
      this.previews = data;
    },

    finish2(type) {
      this.$refs.cropper2.getCropData(data => {
        this.model = true;
        this.modelSrc = data;
      });
    },
    finish3(type) {
      this.$refs.cropper3.getCropData(data => {
        this.model = true;
        this.modelSrc = data;
      });
    },
    down(type) {
    //   event.preventDefault()
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob(blob => {
          this.downImg = window.URL.createObjectURL(blob);
          const result = document.getElementById('result');
          const anchor = document.createElement('a');
          anchor.href = this.downImg;
          this.$emit('downImg', this.downImg);
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          this.downImg = data;
          this.$emit('downImg', this.downImg);
        });
      }
    },
    uploadImg(e, num) {
      // 上传图片
      const file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message({
          // '图片类型必须是.gif,jpeg,jpg,png,bmp中的一种'
          message: this.$t('dialog.imgTepy'),
          type: 'error'
        });
        return false;
      }
      const reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          this.option.img = data;
        } else if (num === 2) {
          this.example2.img = data;
        }
      };
      // 转化为base64
      // 转化为blob
      reader.readAsArrayBuffer(file);
    },
    imgLoad(msg) {
      console.log(msg);
    },

    cropMoving(data) {
      this.option.cropData = data;
    }
  },
  mounted() {
    /* eslint-disable */
    this.option.img = this.lists[0].img;
    const list = [].slice.call(document.querySelectorAll('pre code'));
    list.forEach((val, index) => {
      hljs.highlightBlock(val);
    });
  },
};
</script>

<style scoped>
p{
  font-size: 14px;
}
.content {
  margin: auto;
  width: 100%;
}

.test-button {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c0ccda;
  /* color: #1f2d3d; */
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 20px 10px 0px 0px;
  padding: 9px 15px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #009F3A;
  border-color: #009F3A;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.des {
  line-height: 30px;
}

code.language-html {
  padding: 10px 20px;
  margin: 10px 0px;
  display: block;
  background-color: #333;
  color: #fff;
  overflow-x: auto;
  font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo,
    Lucida, Sans, Type, Writer, Ubuntu, Mono;
  border-radius: 5px;
  white-space: pre;
}

.show-info {
  /* margin-bottom: 50px; */
  width: 100%;
  display: flex;
}

.show-info h2 {
  line-height: 50px;
}

/*.title, .title:hover, .title-focus, .title:visited {
		color: black;
	}*/

.title {
  display: block;
  text-decoration: none;
  text-align: center;
  line-height: 1.5;
  margin: 20px 0px;
  background-image: -webkit-linear-gradient(
    left,
    #3498db,
    #f47920 10%,
    #d71345 20%,
    #f7acbc 30%,
    #ffd400 40%,
    #3498db 50%,
    #f47920 60%,
    #d71345 70%,
    #f7acbc 80%,
    #ffd400 90%,
    #3498db
  );
  color: transparent;
  -webkit-background-clip: text;
  background-size: 200% 100%;
  animation: slide 5s infinite linear;
  font-size: 40px;
}

.test {
  height: 400px;
}

.model {
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
}

.model-show {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  text-align: center;
}

.model img {
  display: block;
  margin: auto;
  max-width: 80%;
  width: auto;
  user-select: none;
  background-position: 0px 0px, 10px 10px;
  background-size: 20px 20px;
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee 100%
    ),
    linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
}

.c-item {
  display: block;
  padding: 10px 0;
  user-select: none;
}

.pre {
	width: 100%;
}

.pre-item {
  display: flex;
  align-items: center;
  padding-left: 20px;
  margin-bottom: 20px;
}
.pre-item img{
    text-align: center;
}
.signPic{
  display: flex;
  padding-left: 20px;
  margin: 25px 0;
}
.signPic-img{
  width: 150px;
  height: 50px;
}
@keyframes slide {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}

@media screen and (max-width: 1000px) {
  .content {
    max-width: 90%;
    margin: auto;
  }

  .test {
    height: 400px;
  }
}
</style>
