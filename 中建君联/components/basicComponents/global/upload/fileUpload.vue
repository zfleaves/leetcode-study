<template>
  <div class="file-upload uploadFileWrap">
    <div class="top" v-if="showSumbit">
      <el-upload style="vertical-align: middle; display: inline-block; height: 100%" :action="fileUrl"
        :headers="myHeaders" :disabled="title === $t('tips.uploadTitleLoading') || flowStatus" :data="fileName"
        ref="upload" :multiple="multiple" :limit="limit" :file-list="imgUrlList" :on-exceed="handleExceed"
        :before-upload="beforeAvatarUpload" :http-request="customHttpRequest">
        <el-button class="uploadBtn" icon="el-icon-link"
          :disabled="title === $t('tips.uploadTitleLoading') || flowStatus"
          v-if="title !== $t('tips.uploadTitleLoading')" style="vertical-align: middle" size="small" type="text">
          {{ uploadTitle }}
          <!--添加附件-->
        </el-button>
        <span v-else class="midFont light-grey">{{ uploadTitle }}</span>
      </el-upload>
      <el-progress style="width: 10%;display: inline-block;margin-left: 20px" v-if="percentage !== 0"
        :percentage="percentage" :color="customColorMethod">
      </el-progress>
      <el-divider direction="vertical"></el-divider>
      <span class="smallFont error" :style="isImportantTips && 'color: #ff4a4a'"
        v-if="placeholder">{{ $t(placeholder) }}</span>
      <span class="midFont" @click="fileShow = !fileShow">
        <i :class="fileShow ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>
      </span>
      <span style="margin-left: 20px" class="midFont">{{ $t("tips.uploadTips") }}
        {{ filesNum }}{{ $t("tips.uploadTips2") }}
        <span v-if="imgUrlList.length > 0">，{{ $t("tips.uploadTips3") }} {{ fileSizes }}</span>
      </span>
      <span class="midFont set" v-if="configParameter && configParameter.filePath"
        @click="downExampleFilePath(configParameter)">
        <!-- 下载示例模板 -->
        {{ $t("tips.downExampleFile") }}
      </span>
      <br>
      <span class="paste" v-if="(!isPdf && !isWord) && !(title === $t('tips.uploadTitleLoading') || flowStatus)">
        <div>
          <div class="img-paste" @paste="handlePaste">
            <!-- 如果您截图了，您可以通过Ctrl+V粘贴至此处 -->
            {{$t('tips.pasteTips')}}
          </div>
        </div>
      </span>
      <span class="midFont set" style="margin-left: 14px" v-if="isIdentify && !flowStatus"
        @click="handleIdentify">{{ $t("dialog.identify") }}</span>
    </div>
    <div class="bottom">
      <el-collapse-transition>
        <ul class="files" v-show="fileShow">
          <li v-for="(item, index) in imgUrlList" :key="item.id"
            :style="{ width: `calc(${100 / arrayNumber}% - 5px)` }">
            <div class="left">
              <img v-if="judgeFileImage(item.fileSuffix)" :src="imageUrl + item.filePath" alt />
              <span v-else class="icon iconfont" :class="setClass(item.fileName)"
                style="font-size: 32px !important; margin-left: 8px"></span>
            </div>
            <div class="right">
              <div class="cons">
                <p class="midFont" style="font-size: 14px">{{ fileNameFilvalter(item) }}</p>
                <p class="midFont light-grey set-but">
                  <span style="font-size: 12px;color: #adadad;">{{ handconstransformation(item.fileSize) }}</span>
                  <span>
                    <!-- 预览 -->
                    <span class="item" @click="handleViewer(item)">
                      <i class="iconfont icon-yulan"></i>
                    </span>
                    <!-- 下载 -->
                    <span class="item" @click="downFilePath(item)">
                      <i class="iconfont icon-xiazaidaoru"></i>
                    </span>
                    <!-- 删除 -->
                    <span class="item" @click="deconsteFile(index)" v-if="!flowStatus">
                      <i class="iconfont icon-shanchu"></i>
                    </span>
                  </span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </el-collapse-transition>
    </div>

    <image-viewer v-if="visible" :image-viewer-list="imageViewerList" @clearImg="getClearImg" :current-img="currentImg"
      :visible="visible"></image-viewer>
    <!-- 附件弹框 -->
    <el-dialog v-dialogDrag class="el-dialog-auto" :title="$t('tips.fileList')" append-to-body v-if="dialogFileDataShow"
      :visible.sync="dialogFileDataShow" width="70%">
      <fileAttachmen v-if="dialogFileDataShow" :gridData="fileData">
      </fileAttachmen>
    </el-dialog>
  </div>
</template>

<script>
import Auth from 'util/auth';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import iconv from 'iconv-lite';
import SparkMD5 from 'spark-md5';

const chunkSize = 10 * 1024 * 1024; // 定义分片的大小 暂定为10M，方便测试

export default {
  name: 'file-upload',
  components: {
    imageViewer (resolve) {
      require(['./imageViewer.vue'], resolve);
    },
    fileAttachmen (resolve) {
      require(['./fileAttachmen.vue'], resolve);
    }
  },
  data () {
    return {
      fileUrl: this.$utils.config.fileTenantUrl,
      myHeaders: {
        'Access-Token': Auth.hasToken(),
        'Access-Domain': 'customer',
        userId: Auth.hasUserInfo().userId,
        tenantId: Auth.hasUserInfo().tenantId,
        Language: Auth.hasLanguage(),
        resource: 'P2'
      },
      fileName: {
        fileName: '',
        subSystemCode: this.$utils.config.subSystemCode
      },
      imgUrlList: [],
      uploadTitle: this.$t('tips.uploadTitle'),
      fileShow: true,
      fileCmsUrl: this.$utils.config.fileViewUrl,
      imageUrl: this.$utils.config.imageUrl, // 图片预览
      visible: false,
      currentImg: '',
      title: '',
      whetherPhoto: '',
      percentage: 0,
      downLoading: null,
      fileData: [],
      dialogFileDataShow: false,
      // 新增分片上传
      fileList: [],
      currentFile: null,
      loadingFile: false,
      totalChunks: {}
    };
  },
  props: {
    configParameter: {
      type: Object,
      default: () => { }
    },
    flowStatus: {
      type: Boolean,
      default: true
    },
    attachment: {
      type: String,
      default: ''
    },
    isPhoto: {
      type: Boolean,
      default: false
    },
    isPdf: {
      type: Boolean,
      default: false
    },
    isWord: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 20
    },
    multiple: {
      type: Boolean,
      default: true
    },
    isShop: {
      type: Boolean,
      default: false
    },
    // 一行li显示个数
    arrayNumber: {
      type: Number,
      default: 3
    },
    isIdentify: {
      // 自动识别
      type: Boolean,
      default: false
    },
    // 是否显示上传按钮
    showSumbit: {
      type: Boolean,
      default: true
    },
    // 提示
    placeholder: {
      type: String,
      default: ''
    },
    isImportantTips: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    filesNum () {
      return this.imgUrlList.length;
    },
    fileSizes () {
      let capacityConut = 0;
      for (const i in this.imgUrlList) {
        const item = this.imgUrlList[i];
        capacityConut += item.fileSize;
      }
      return this.formatFileSize(capacityConut);
    },
    imageViewerList () {
      if (this.imgUrlList.length === 0) return;
      const arr = [];
      for (const i in this.imgUrlList) {
        const item = this.imgUrlList[i];
        const fileSuffix = item.fileSuffix.toLowerCase();
        // 为图片预览
        if (/jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(fileSuffix)) {
          item.imagePath = this.imageUrl + item.filePath;
          arr.push(item);
        }
      }
      return arr;
    }
  },
  mounted () {
    // console.log(this.configParameter, this.attachment, 'limit');
  },
  watch: {
    attachment: {
      handler () {
        this.getGridData();
      },
      immediate: true
    }
  },
  methods: {
    customColorMethod (percentage) {
      if (percentage < 30) {
        return '#909399';
      } else if (percentage < 70) {
        return '#e6a23c';
      } else {
        return '#67c23a';
      }
    },
    // 文件名称
    fileNameFilvalter (item) {
      const fileName = item.fileName ? item.fileName.substr(0, item.fileName.lastIndexOf('_')) : '';
      return fileName ? `${fileName}.${item.fileSuffix}` : '';
    },
    // 获取文件
    getGridData () {
      if (this.attachment) {
        const attachmentIdList = this.attachment.split(',');
        const data = {
          fileIds: attachmentIdList.map(item => (item = Number(item)))
        };
        this.$store.dispatch('publicApi/getFilepath', data).then(res => {
          if (res.status === 0) {
            this.imgUrlList = res.results;
            this.$emit('fileInformation', this.imgUrlList);
          }
        });
      } else {
        this.imgUrlList = [];
      }
    },
    getClearImg () {
      this.visible = false;
    },
    // 文件超出个数限制时的钩子
    handleExceed (files, fileList) {
      this.$message.error(this.$t('tips.limitTips'));
    },
    // 文件上传之前
    beforeAvatarUpload(file) {
      // console.log(file, 'file');
      let isJPG;
      if (this.isPhoto) {
        isJPG = file.type.indexOf('image') >= 0;
      } else {
        isJPG = true;
      }
      let isPDF;
      if (this.isPdf) {
        isPDF = file.type === 'application/pdf';
      } else {
        isPDF = true;
      }
      let isWord;
      if (this.isWord) {
        isWord = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else {
        isWord = true;
      }
      const isLt300M = file.size / 1024 / 1024 < 300;
      if (!isJPG) {
        this.$message.error(this.$t('tips.isJPG'));
        return false;
      }
      if (!isPDF) {
        this.$message.error(this.$t('tips.isPDF'));
        return false;
      }
      if (!isWord) {
        this.$message.error(this.$t('tips.isWord'));
        return false;
      }
      if (!isLt300M) {
        this.$message.error(this.$t('tips.isLt300M'));
      } else {
        this.uploadTitle = this.$t('tips.uploadTitleLoading');
        this.title = this.$t('tips.uploadTitleLoading'); // '附件上传中'
      }
      return isLt300M && isJPG;
    },
    // 获取出纳粘贴图片
    handlePaste (event) {
      const attachment = this.attachment ? this.attachment.split(',') : [];
      // 上传文件个数已超过限制
      if (this.limit <= attachment.length && this.attachment) {
        return this.$message.error(this.$t('tips.limitTips'));
      }
      const items = (event.clipboardData || window.clipboardData).items;
      let file = null;
      if (!items || items.length === 0) {
        // 请使用添加附件，选择文件后上传！
        this.$message.error(this.$t('tips.pasteTips1'));
        return;
      }
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile();
          break;
        }
      }
      if (!file) {
        // 粘贴内容非图片
        this.$message.error(`${this.$t('tips.pasteTypeTips')}！${this.$t('tips.pasteTips1')}`);
        return;
      }
      this.customHttpRequest(file, true);
    },
    // 自定义上传
    // 自定义上传
    // isPaste是否为粘贴图片上传
    customHttpRequest (options, isPaste) {
      try {
        this.uploadTitle = this.$t('tips.uploadTitleLoading');
        this.title = this.$t('tips.uploadTitleLoading'); // '附件上传中'
        const file = isPaste ? options : options.file; // 拿到 file
        this.uploadFile(file);
      } catch (e) {
        !isPaste && options.onError({});
      }
    },
    // 上传文件
    async uploadFile (File) {
      this.loadingFile = true;
      // eslint-disable-next-line
      const self = this;
      // 获取用户选择的文件
      const file = File;
      this.currentFile = file;
      // 文件大小(大于100m再分片哦，否则直接走普通文件上传的逻辑就可以了，这里只实现分片上传逻辑)
      const fileSize = File.size;
      // 放入文件列表
      this.fileList = [{ name: File.name }];
      // 可以设置大于多少兆可以分片上传，否则走普通上传
      if (fileSize <= chunkSize) {
        // console.log('上传的文件大于10m才能分片上传');
      }
      // 计算当前选择文件需要的分片数量
      const chunkCount = Math.ceil(fileSize / chunkSize);
      // console.log('文件大小：', `${File.size / 1024 / 1024}Mb`, `分片数：${chunkCount}`);
      // 获取文件md5
      const fileMd5 = await this.getFileMd5(file, chunkCount);
      // console.log('文件md5：', fileMd5);

      // console.log('向后端请求本次分片上传初始化');
      const uploaded = [];
      // 定义分片开始上传的序号
      // 由于是顺序上传，可以判断后端返回的分片数组的长度，为0则说明文件是第一次上传，分片开始序号从0开始
      // 如果分片数组的长度不为0，我们取最后一个序号作为开始序号
      const num = uploaded.length === 0 ? 0 : uploaded[uploaded.length - 1];
      // console.log(num, '分片开始序号');
      // 当前为顺序上传方式，若要测试并发上传，请将103 行 await 修饰符删除即可
      // 循环调用上传
      const mergerData = {
        fileName: File.name,
        fileSize,
        identifier: fileMd5,
        subSystemCode: this.$utils.config.subSystemCode,
        totalChunks: chunkCount
      };
      this.$set(this.totalChunks, mergerData.identifier, 0);
      this.percentage = 5;
      for (let i = num; i < chunkCount; i++) {
        // 分片开始位置
        const start = i * chunkSize;
        // 分片结束位置
        const end = Math.min(fileSize, start + chunkSize);
        // 取文件指定范围内的byte，从而得到分片数据
        // console.log(File, 'File');
        const _chunkFile = File.slice(start, end);
        // console.log(_chunkFile);
        // console.log(`开始上传第${i}个分片`);
        const formdata = new FormData();
        formdata.append('identifier', fileMd5);
        formdata.append('chunkNumber', Number(i) + 1);
        formdata.append('file', _chunkFile);
        // 通过await实现顺序上传
        this.getMethods(formdata, mergerData);
      }
    },
    //  上传文件方法
    // formdata 上传文件的参数
    getMethods (formdata, mergerData) {
      this.$store.dispatch('publicApi/uploadTenantFragmentPublicApi', formdata).then(res => {
        if (res.status === 0) {
          this.$set(this.totalChunks, mergerData.identifier, this.totalChunks[mergerData.identifier] + 1);
          this.percentage = this.totalChunks[mergerData.identifier] === mergerData.totalChunks ? 100 : Math.floor(100 / mergerData.totalChunks * this.totalChunks[mergerData.identifier]);
          this.percentage = this.percentage > 100 ? 100 : this.percentage;
          // 文件上传完毕，请求后端合并文件并传入参数
          // console.log('文件上传完毕，请求后端合并文件并传入参数:', this.totalChunks[mergerData.identifier], mergerData.totalChunks);
          if (this.totalChunks[mergerData.identifier] === mergerData.totalChunks) {
            this.composeFile(mergerData);
          }
        }
      });
    },
    //  获取文件MD5
    getFileMd5 (file, chunkCount) {
      return new Promise((resolve, reject) => {
        const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        const chunks = chunkCount;
        let currentChunk = 0;
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();

        fileReader.onload = function (e) {
          spark.append(e.target.result);
          currentChunk++;
          if (currentChunk < chunks) {
            loadNext();
          } else {
            const md5 = spark.end();
            resolve(md5);
          }
        };
        fileReader.onerror = function (e) {
          reject(e);
        };
        function loadNext () {
          const start = currentChunk * chunkSize;
          let end = start + chunkSize;
          if (end > file.size) {
            end = file.size;
          }
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext();
      });
    },
    // 请求后端合并文件
    composeFile (mergerData) {
      // console.log('开始请求后端合并文件');
      this.$store.dispatch('publicApi/uploadTenantMergerPublicApi', mergerData).then(res => {
        if (res.status === 0) {
          this.loadingFile = false;
          // 上传成功
          const attachment = this.attachment ? `,${this.attachment}` : '';
          this.$emit('update:attachment', `${res.results}${attachment}`);
          this.$message.success(this.$t('tips.uploadSuccess'));
          this.uploadTitle = this.$t('tips.uploadTitle');
          this.title = this.$t('tips.attachmentUpload'); // '附件上传'
        } else {
          this.loadingFile = false;
          // 上传失败
          this.$message.error(this.$t('tips.uploadFail'));
          this.uploadTitle = this.$t('tips.uploadTitle');
          this.title = this.$t('tips.attachmentUpload'); // '附件上传'
        }
      });
    },
    formatFileSize (size) {
      const value = Number(size);
      if (size && !isNaN(value)) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
        let index = 0;
        let k = value;
        if (value >= 1024) {
          while (k > 1024) {
            k = k / 1024;
            index++;
          }
        }
        return `${k.toFixed(2)}${units[index + 1]}`;
      }
      return 0;
    },
    // 转换容量
    handconstransformation (capacityConut) {
      if (capacityConut < 1024) {
        return `${capacityConut}kb`;
      }
      capacityConut = capacityConut / 1024; // 转换为MB
      if (capacityConut < 1024) {
        return `${capacityConut.toFixed(2)}Mb`;
      }
      capacityConut = capacityConut / 1024; // 转换为G
      return `${capacityConut.toFixed(2)}G`;
    },
    // 文件预览
    handleViewer (item) {
      const fileSuffix = item.fileSuffix.toLowerCase();
      // 为图片预览
      if (/jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(fileSuffix)) {
        this.handleImageViewer(item);
      }
      if (/ppt|doc|xls|xlsx|docx|pptx|txt|pdf/.test(fileSuffix)) {
        this.handleFileInfo(item);
      }
    },
    handleImageViewer (item) {
      this.currentImg = this.imageUrl + item.filePath;
      this.visible = true;
    },
    // 文件预览
    handleFileInfo (row) {
      const url = `${this.$utils.config.fileViewUrl}${row.id}`;
      window.open(url);
    },
    // 下载示例模板
    downExampleFilePath (configParameter) {
      configParameter.fileName = `${this.$t(configParameter.fileName)}.${configParameter.fileSuffix}`;
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = configParameter.filePath;
      const fileName = configParameter.fileName;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    },
    // 文件下载
    downFilePath (row) {
      const url = `${this.$utils.config.fileCmsUrl}${row.id}`;
      const link = document.createElement('a');
      link.style.display = 'none';
      link.target = '_Blank';
      link.href = url;
      link.target = '_Blank';
      const fileName = this.fileNameFilvalter(row);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    },
    // 移除文件
    deconsteFile (index) {
      this.$confirm(`${this.$t('button.delete')} ${this.imgUrlList[index].fileName}?`, this.$t('button.delete'), {
        cancelButtonClass: 'button-close',
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      })
        .then(() => {
          this.imgUrlList.splice(index, 1); // 假设长度为3
          if (this.imgUrlList.length) {
            const attachment = this.imgUrlList.map(v => v.id).join(',');
            this.$emit('update:attachment', attachment);
          } else {
            this.$emit('update:attachment', '');
          }
        })
        .catch(() => { });
    },
    // 判断是否为图片
    judgeFileImage (val) {
      // console.log(val, 'val');
      val = val.toLowerCase();
      this.whetherPhoto = val;
      return /jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(val);
    },
    // 判断其他文件
    judgeFile (val) {
      val = val.toLowerCase();
      return /ppt|doc|xls|xlsx|txt|docx|pptx|pdf/.test(val);
    },
    // 判断是什么类型的文件
    setClass (val) {
      if (val) {
        const filePath = val.split('.');
        const ficonstype = filePath[filePath.length - 1];
        ficonstype.toLowerCase();
        if (ficonstype === 'txt') {
          return 'icon-txt';
        } else if (ficonstype === 'ppt' || ficonstype === 'pptx') {
          return 'icon-ppt';
        } else if (ficonstype === 'rar') {
          return 'icon-rar_1';
        } else if (ficonstype === 'pdf') {
          return 'icon-pdf';
        } else if (ficonstype === 'zip') {
          return 'icon-ZIP_1';
        } else if (ficonstype === 'doc' || ficonstype === 'docx') {
          return 'icon-word';
        } else if (ficonstype === 'xls' || ficonstype === 'xlsx') {
          return 'icon-excel1';
        } else {
          return 'icon-weizhi1';
        }
      }
    },
    // 自动识别
    handleIdentify () {
      if (this.imgUrlList.length === 0) {
        this.$message.error(this.$t('tips.uploadFile'));
        return;
      }
      const whetherPhoto = /jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(this.whetherPhoto);
      if (whetherPhoto) {
        const identifyUrl = `${this.$utils.config.imageUrl}${this.imgUrlList[0].filePath}`;
        this.$emit('identify', identifyUrl);
        this.$emit('moreIdentifyList', this.imgUrlList); // 多个发票
      } else {
        this.$message.error(this.$t('tips.whetherPhotoTips'));
      }
    },
    // 通过url 转为blob格式的数据
    getImgArrayBuffer (url) {
      return new Promise((resolve, reject) => {
        // 通过请求获取文件blob格式
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', url, true);
        xmlhttp.responseType = 'blob';
        xmlhttp.onload = function () {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(this.status);
          }
        };
        xmlhttp.send();
      });
    }
  }
};
</script>

<style scoped lang="scss">
.batch-download {
  float: right;
  margin-right: 10px;
}
.paste {
  display: inline-block;
  max-width: 300px;
  padding: 10px 20px;
  margin: 5px 0 10px 0;
  border: 1px solid #eeeeee;
  border-style: dashed;
  text-align: center;
  color: gray;
  cursor: pointer;
}
.icon-txt {
  color: #1f7246;
}
.icon-ppt {
  color: #d81e06;
}
.icon-rar_1 {
  color: #8475ff;
}
.icon-pdf {
  color: #e70400;
}
.icon-ZIP_1 {
  color: #733781;
}
.icon-word {
  color: #0095e0;
}
.icon-excel1 {
  color: #1f7246;
}
.icon-weizhi1 {
  color: gray;
}
ul {
  li {
    list-style: none;
  }
}
.file-upload {
  width: 100%;
  .top {
    position: relative;
    .progress {
      position: absolute;
      width: 200px;
      bottom: -16px;
      left: 0px;
    }
  }
  .bottom {
    width: 100%;
    overflow: hidden;
    ul {
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;

      li:hover {
        background-color: rgba(43, 116, 236, 0.1);
        .right {
          p {
            color: #009F3A;
          }
          .set-but {
            i {
              color: #009F3A;
            }
          }
        }
      }
      li {
        height: 60px;
        // flex: 1;

        background: rgb(245, 245, 245);
        border-radius: 5px;
        margin-right: 5px;
        margin-bottom: 15px;
        position: relative;
        &:nth-child(4) {
          margin-right: 0;
        }
        .left {
          width: 60px;
          height: 60px;
          float: left;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 60px;
          img {
            display: inline-block;
            vertical-align: mathematical;
            max-width: 60px;
            max-height: 60px;
          }
        }
        .right {
          width: calc(100% - 65px);
          height: 60px;
          float: left;
          cursor: pointer;
          position: relative;
          .cons {
            width: 100%;
            height: 100%;
            padding: 5px;
            box-sizing: border-box;
            p {
              margin-top: 3px;
              line-height: 24px;
              width: 100%;
              overflow: hidden;
              height: 20px;
              font-size: 12px;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .set-but {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            padding-right: 5px;
            text-align: right;
            .item {
              margin: 0 8px;
              font-size: 18px;
            }
            i {
              color: #adadad;
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
</style>
