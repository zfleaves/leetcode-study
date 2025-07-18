<template>
  <div class="editorImage upload-container tinymceUpload">
    <el-button style="position: relative;top: -3px;" icon='el-icon-upload' size="mini"
      :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog title="上传图片" :visible.sync="dialogVisible" width="60%" center>
      <div class="picture">
        <div class="el-upload el-upload--picture-card" v-for="item of imgUrlList" :key="item.url" style="margin: 0 5px;">
          <el-image :src="item.url">
              <div slot="error" class="image-slot logo-seize">
                  <i class="el-icon-user-solid"></i>
              </div>
          </el-image>
        </div>
        <el-upload :action="fileUrl" :headers="myHeaders" :data="fileName" list-type="picture-card" ref="upload"
          show-file-list
          multiple accept="image/*" :file-list="imgUrlList" :on-error="handleError"
          :on-remove="handleRemove" :before-upload="beforeUpload"
          :http-request="customHttpRequest">
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
          @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-circle-check" size="small" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import config from 'util/config';
import Auth from 'util/auth';
import SparkMD5 from 'spark-md5';

const chunkSize = 10 * 1024 * 1024; // 定义分片的大小 暂定为10M，方便测试

export default {
  name: 'eidtor-image',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data () {
    return {
      imageUrl: config.imageUrl,
      fileName: {
        fileName: '',
        subSystemCode: config.subSystemCode
      },
      fileUrl: config.fileTenantUrl,
      myHeaders: {
        'Access-Token': Auth.hasToken(),
        'Access-Domain': 'customer',
        userId: Auth.hasUserInfo().userId,
        tenantId: Auth.hasUserInfo().tenantId,
        Language: Auth.hasLanguage(),
        resource: 'P2'
      },
      dialogVisible: false,
      imgUrlList: [],
      uploadList: [],
      // 新增分片上传
      fileList: [],
      currentFile: null,
      loadingFile: false,
      totalChunks: {}
    };
  },
  methods: {
    handleSubmit () {
      const imagePathList = this.imgUrlList.map(v => v.url);
      this.$emit('successCBK', imagePathList);
      this.$refs.upload.clearFiles();
      this.imgUrlList = [];
      this.dialogVisible = false;
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    beforeUpload (file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('上传文件大小不能超过 5MB!');
      }
      this.fileName.fileName = file.name;
      // this.uploadTitle = '上传中';
      return isLt5M;
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
            console.log('上传的文件大于10m才能分片上传');
        }
        // 计算当前选择文件需要的分片数量
        const chunkCount = Math.ceil(fileSize / chunkSize);
        console.log('文件大小：', `${File.size / 1024 / 1024}Mb`, `分片数：${chunkCount}`);
        // 获取文件md5
        const fileMd5 = await this.getFileMd5(file, chunkCount);
        console.log('文件md5：', fileMd5);

        console.log('向后端请求本次分片上传初始化');
        const uploaded = [];
        // 定义分片开始上传的序号
        // 由于是顺序上传，可以判断后端返回的分片数组的长度，为0则说明文件是第一次上传，分片开始序号从0开始
        // 如果分片数组的长度不为0，我们取最后一个序号作为开始序号
        const num = uploaded.length === 0 ? 0 : uploaded[uploaded.length - 1];
        console.log(num, '分片开始序号');
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
            console.log(File, '0000');
            const _chunkFile = File.slice(start, end);
            console.log(_chunkFile);
            console.log(`开始上传第${i}个分片`);
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
            console.log('文件上传完毕，请求后端合并文件并传入参数:', this.totalChunks[mergerData.identifier], mergerData.totalChunks);
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
        console.log('开始请求后端合并文件');
        this.$store.dispatch('publicApi/uploadTenantMergerPublicApi', mergerData).then(res => {
            if (res.status === 0) {
              this.uploadList.push(res.results);
              const attachment = JSON.parse(JSON.stringify(this.uploadList));
              this.$message({
                message: '文件上传成功',
                type: 'success'
              });
              this.$store.dispatch('publicApi/fileDownloadList', {fileIds: attachment}).then(res => {
                const results = res.results;
                for (const i in results) {
                  results[i].name = results[i].fileName;
                  results[i].url = config.imageUrl + results[i].filePath;
                }
                this.imgUrlList = results;
              });
            }
        });
    },
    handleError (error, file, fileList) {
      this.$message.error('文件上传失败');
    }
  }
};
</script>

<style scoped lang="scss">
.picture {
  display: flex;
  padding: 25px 25px 30px;
}
/deep/.el-dialog__body {
  text-align: initial;
  padding: 25px 25px 30px;
}
</style>
