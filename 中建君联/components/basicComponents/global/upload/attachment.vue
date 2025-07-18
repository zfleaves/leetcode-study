<template>
  <div class="attachment">
    <el-table :data="gridData" border stripe height="500">
      <template slot="empty">
        <no-data>
        </no-data>
      </template>
      <el-table-column prop="fileName" :label="$t('fConfig.fileName')">
        <template slot-scope="scope">
          <span>{{scope.row.fileName | fileNameFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileSuffix" :label="$t('fConfig.fileSuffix')"  width="100">
      </el-table-column>
      <el-table-column prop="fileSize" :label="$t('fConfig.fileSize')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.fileSize}}KB</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('fConfig.operate')" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <div class="popover-img">
            <span
              slot="reference"
              class="midFont set"
              style="min-width: 60px;"
              v-if="judgeFileImage(scope.row.fileSuffix)"
              @click="handleImageViewer(scope.row)"
              type="text" size="small">
              {{$t('button.info')}}
            </span>
            <span
              slot="reference"
              class="midFont set"
              style="min-width: 60px;" v-if="judgeFile(scope.row.fileSuffix)"
              @click="handleViewer(scope.row)"
              type="text" size="small">
              {{$t('button.info')}}
            </span>
            <div v-if="isUpload" style="min-width: 60px;display: inline-block;text-decoration: none;"
               @click="downFilePath(scope.row)">
              <span type="text" class="midFont set" size="small" :disabled="false">{{$t('button.download')}}</span>
            </div>
            <div v-if="isEdit" style="min-width: 60px;display: inline-block;text-decoration: none;"
               @click="deleteFilePath(scope.row)">
              <span type="text" class="midFont set" size="small" :disabled="false">{{$t('button.delete')}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <imageViewer
      v-if="visible"
      :image-viewer-list="imageViewerList"
      @clearImg="getClearImg"
      :current-img="currentImg" :visible="visible">
    </imageViewer>

  </div>
</template>

<script>
  export default {
    name: 'attachment',
    components: {
      imageViewer (resolve) {
        require(['./imageViewer.vue'], resolve);
      }
    },
    data () {
      return {
        imageUrl: this.$utils.config.imageUrl,
        viewerShow: false,
        maskBtn: false,
        currentImg: '',
        visible: false,
        fileViewShow: false,
        fileId: ''
      };
    },
    props: {
      gridData: {
        type: Array,
        default() {
          return [];
        }
      },
      isEdit: {
        type: Boolean,
        default() {
          return false;
        }
      },
      isUpload: {
        type: Boolean,
        default() {
          return true;
        }
      }
    },
    computed: {
      imageViewerList () {
        if (this.gridData.length === 0) return;
        const arr = [];
        for (const i in this.gridData) {
          const item = this.gridData[i];
          item.imagePath = this.imageUrl + item.filePath;
          arr.push(item);
        }
        return arr;
      }
    },
    filters: {
      filterFile (val) {
        if (/jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(val)) {
          return false;
        } else {
          return true;
        }
      },
      fileNameFilter (val) {
        return val ? val.substr(0, val.lastIndexOf('_')) : '';
      }
    },
    methods: {
      // 文件名称
      fileNameFilvalter(item) {
        // console.log(item);
        const fileName = item.fileName ? item.fileName.substr(0, item.fileName.lastIndexOf('_')) : '';
        return fileName ? `${fileName}.${item.fileSuffix}` : '';
      },
      judgeFileImage (val) {
        val = val.toLowerCase();
        return /jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(val);
      },
      judgeFile (val) {
        val = val.toLowerCase();
        return /ppt|doc|xls|xlsx|txt|docx|pptx|pdf/.test(val);
      },
      handleClickGridData () {
        this.viewerShow = true;
      },
      handleImageViewer (row) {
        this.currentImg = this.imageUrl + row.filePath;
        this.visible = true;
      },
      getClearImg () {
        this.visible = false;
      },
      // 下载图片资源
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
      // 文件预览
      handleViewer(item) {
        const fileSuffix = item.fileSuffix.toLowerCase();
        // 为图片预览
        if (/jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(fileSuffix)) {
          this.handleImageViewer(item);
        }
        if (/ppt|doc|xls|xlsx|docx|pptx|txt|pdf/.test(fileSuffix)) {
          this.handleFileInfo(item);
        }
      },
      // 文件预览
      handleFileInfo (row) {
        const url = `${this.$utils.config.fileViewUrl}${row.id}`;
        window.open(url);
      },
      // 文件删除
      deleteFilePath(row) {
        this.$emit('deleteFile', row);
      }
    }
  };
</script>

<style scoped lang="scss">
.attachment{
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
  .popover-img {
    display: flex;
    justify-content: space-around;
    align-items: center;
    img {
      margin: 0 auto;
    }
    .img-show-mask {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 3000;
      background: rgba(0, 0, 0, .5);
    }

    .img-show-mask .bigImg {
      width: 500px;
      height: 280px;
      position: absolute;
      z-index: 3100;
      top: 0;
      left: 0;
      margin: auto;
    }
  }
</style>
