<template>
  <div class="uploadFileWrap" :style="!attachmentListShow ? 'height: 23px;' : 'height: 36px;'">
    <ul :class="!flowStatus?'info':''" v-if="attachmentListShow && imgUrlList.length > 0">
      <li>
        <el-dropdown size="height:40px;">
          <p class="set" style=" white-space: nowrap;text-overflow: ellipsis;overflow:hidden;">
            {{imgUrlList[0].fileName | fileNameFilter}}</p>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :key="item.id" v-for="(item,index) in imgUrlList">
              {{item.fileName | fileNameFilter}}
              <span v-if="flowStatus" @click="deleltImages(index)" style="float: right;margin-left: 6px;">
                <i class="el-icon-circle-close"></i>
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </li>
    </ul>
    <el-upload v-if="flowStatus" :disabled="disabledField ? row[disabledField] === disabledValue : false"
      style="vertical-align: middle;display: inline-block;height: 100%;" :action="fileUrl" :headers="myHeaders"
      :data="fileName" ref="upload" :multiple="multiple" :limit="limit" :on-exceed='handleExceed'
      :file-list="imgUrlList" :before-upload="beforeAvatarUpload" :http-request="customHttpRequest">
      <el-button class="uploadBtn"
        :disabled="(disabledField ? row[disabledField] === disabledValue : false) || (uploadTitle=== `${$t('tips.uploadTitleLoading1')}...'`)"
        size="mini" style="vertical-align: middle;" type="text">
        <span style="font-size: 14px;" :style="!attachmentListShow && 'line-height: 22px;'">{{title}}</span>
      </el-button>
    </el-upload>
    <el-progress style="width: 50px;margin-right: 60px;" v-if="percentage !== 0" :percentage="percentage"
      :color="customColorMethod">
    </el-progress>
    <span class="smallFont error" :style="isImportantTips && 'color: #ff4a4a;margin: 0 10px'"
      v-if="placeholder">{{ $t(placeholder) }}</span>
    <span v-if="imgUrlList.length > 0&&!isEdit" @click="handleGridData" class="uploadBtn findFiles smallFont set"
      type="text" :style="!attachmentListShow && 'line-height: 23px;'">{{$t('button.info')}}
      <span v-if="lengthShow">({{imgUrlList.length}})</span>
    </span>
    <span v-if="imgUrlList.length===0 && !flowStatus">{{$t('tips.noFile')}}</span>

    <!-- 附件弹框 -->
    <el-dialog v-dialogDrag class="el-dialog-auto" :title="$t('tips.fileList')" append-to-body v-if="dialogGridData"
      :visible.sync="dialogGridData" width="70%">
      <attachment v-if="dialogGridData" :gridData="gridData" :isEdit="isEdit" :isUpload="isUpload">
      </attachment>
    </el-dialog>
  </div>
</template>

<script>
import Auth from 'util/auth';
import config from 'util/config';
import SparkMD5 from 'spark-md5';

const chunkSize = 10 * 1024 * 1024; // 定义分片的大小 暂定为10M，方便测试

export default {
  name: 'upload-file',
  components: {
    attachment (resolve) {
      require(['./attachment.vue'], resolve);
    }
  },
  data () {
    return {
      fileUrl: config.fileTenantUrl,
      myHeaders: {
        'Access-Token': Auth.hasToken(),
        'Access-Domain': 'supplier',
        userId: Auth.hasUserInfo().userId,
        tenantId: Auth.hasUserInfo().tenantId,
        Language: Auth.hasLanguage(),
        'resource': 'P2'
      },
      fileName: {
        fileName: '',
        subSystemCode: config.subSystemCode
      },
      imgUrlList: [],
      gridData: [],
      uploadTitle: this.$t('tips.uploadTitle1'),
      title: this.$t('tips.uploadTitle1'),
      dialogGridData: false,
      percentage: 0,
      // 新增分片上传
      fileList: [],
      currentFile: null,
      loadingFile: false,
      totalChunks: {}
    };
  },
  props: {
    row: {
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
    limit: {
      type: Number,
      default: 10
    },
    isPhoto: {
      type: Boolean,
      default: false
    },
    isPdf: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isUpload: {
      type: Boolean,
      default: false
    },
    // 提示
    placeholder: {
      type: String,
      default: ''
    },
    isImportantTips: {
      type: Boolean,
      default: false
    },
    attachmentListShow: {
      type: Boolean,
      default: true
    },
    disabledField: {
      type: String,
      default: ''
    },
    disabledValue: {
      type: String,
      default: ''
    },
    lengthShow: {
      type: Boolean,
      default: true
    }
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
    // 获取文件
    getGridData () {
      if (this.attachment) {
        const attachmentIdList = this.attachment.split(',');
        const params = {
          fileIds: attachmentIdList
        };
        this.$store.dispatch('publicApi/getFilepath', params).then(res => {
          if (!res.results.length) return;
          this.imgUrlList = res.results;
          this.gridData = res.results;
          // console.log(this.imgUrlList, 'this.imgUrlList');
        });
      } else {
        this.imgUrlList = [];
        this.gridData = [];
      }
    },
    // 点击查看文件
    handleGridData () {
      this.dialogGridData = true;
    },
    // 移除文件
    deleltImages (index) {
      this.$confirm(`${this.$t('button.delete')} ${this.imgUrlList[index].fileName}?`, this.$t('button.delete'), {
        cancelButtonClass: 'button-close',
        confirmButtonText: this.$t('button.determine'),
        cancelButtonText: this.$t('button.close'),
        type: 'warning'
      }).then(() => {
        this.imgUrlList.splice(index, 1); // 假设长度为3
        if (this.imgUrlList.length) {
          const attachment = this.imgUrlList.map(v => v.id).join(',');
          this.$emit('update:attachment', attachment);
          this.$emit('attachment', attachment);
        } else {
          this.$emit('update:attachment', '');
          this.$emit('attachment', '');
        }
      }).catch(() => {
      });
    },
    // 文件超出个数限制时的钩子
    handleExceed (files, fileList) {
      // console.log(files, fileList);
      this.$message.error(this.$t('tips.limitTips'));
    },
    // 文件上传之前
    beforeAvatarUpload (file) {
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
      const isLt300M = file.size / 1024 / 1024 < 300;
      if (!isLt300M) {
        this.$message.error(this.$t('tips.isLt300M'));
        return false;
      }
      if (!isJPG) {
        this.$message.error(this.$t('tips.isJPG'));
        return false;
      }
      if (!isPDF) {
        this.$message.error(this.$t('tips.isPDF'));
        return false;
      }
      this.fileName.fileName = file.name;
      this.fileName.sourceCode = this.$route.name;
      this.uploadTitle = this.$t('tips.uploadTitleLoading1');
      this.title = this.$t('tips.uploadTitleLoading1');
      return isLt300M;
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
        // console.log(File, '0000');
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
      this.$store.dispatch('publicApi/uploadTenantMergerPublicApi', mergerData).then(res => {
        if (res.status === 0) {
          this.loadingFile = false;
          // 上传成功
          const attachment = this.attachment ? `,${this.attachment}` : '';
          this.$emit('update:attachment', `${res.results}${attachment}`);
          this.$emit('attachment', `${res.results}${attachment}`);
          this.$message.success(this.$t('tips.uploadSuccess'));
          this.uploadTitle = this.$t('tips.uploadTitle');
          this.title = this.$t('tips.uploadTitle1'); // '附件上传'
          this.percentage = 0;
        } else {
          this.loadingFile = false;
          // 上传失败
          this.$message.error(this.$t('tips.uploadFail'));
          this.uploadTitle = this.$t('tips.uploadTitle');
          this.title = this.$t('tips.uploadTitle1'); // '附件上传'
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.uploadFileWrap {
  /deep/ .el-progress-bar {
    padding-right: 0 !important;
    margin-right: 0 !important;
  }
  font-size: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ul {
    width: calc(100% - 120px);
    max-width: calc(100% - 120px);
    height: 100%;
    display: inline-block;
    vertical-align: middle;
    &.info {
      width: calc(100% - 66px);
      max-width: calc(100% - 66px);
    }
    li {
      width: 100%;
      height: 100%;
      list-style: none;
      p {
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
      }
      /deep/ .el-dropdown {
        width: 100%;
      }
    }
  }
  .uploadBtn {
    display: inline-block;
    vertical-align: middle;
    width: 40px;
    height: 100%;
    /*margin: 0 5px;*/
    &.findFiles {
      position: relative;
      top: 0.6px;
    }
  }
}
</style>
