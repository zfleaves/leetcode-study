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
            <div style="min-width: 60px;display: inline-block;text-decoration: none;"
               @click="downFilePath(scope.row)">
              <span type="text" class="midFont set" size="small" :disabled="false">{{$t('button.download')}}</span>
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
    name: 'fileAttachmen',
    components: {
      imageViewer (resolve) {
        require(['./imageViewer.vue'], resolve);
      }
    },
    data () {
      return {
        currentImg: '',
        visible: false
      };
    },
    props: {
      gridData: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    computed: {
      imageViewerList () {
        if (this.gridData.length === 0) return;
        const arr = [];
        for (const i in this.gridData) {
          const item = this.gridData[i];
          item.imagePath = `data:image/png;base64, ${item.data}`;
          if (this.judgeFileImage(item.fileSuffix)) {
            arr.push(item);
          }
        }
        return arr;
      }
    },
    filters: {
      fileNameFilter (val) {
        return val ? val.substr(0, val.lastIndexOf('.')) : '';
      }
    },
    methods: {
      judgeFileImage (val) {
        val = val.toLowerCase();
        return /jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga/.test(val);
      },
      judgeFile (val) {
        val = val.toLowerCase();
        return /txt|pdf/.test(val);
      },
      handleImageViewer (row) {
        this.currentImg = `data:image/png;base64, ${row.data}`;
        this.visible = true;
      },
      getClearImg () {
        this.visible = false;
      },
      // 将base64转为file类型
      base64ToFile(row) {
        const bstr = atob(row.data);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], row.fileName, { type: row.fileSuffix });
      },
      // 下载资源
      downFilePath (row) {
          let file = null;
          if (/jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga|pdf/.test(row.fileSuffix)) {
            file = this.base64ToFile(row);
          } else {
            file = new File([row.data], row.fileName);
          }
          const href = URL.createObjectURL(file);
          const link = document.createElement('a');
          link.download = row.fileName;
          link.href = href;
          link.target = '_Blank';
          document.body.appendChild(link);
          link.click();
          URL.revokeObjectURL(href);
      },
      // 文件预览
      handleViewer(item) {
        if (/pdf/.test(item.fileSuffix)) {
          // pdf预览
          const newWindow = window.open('');
          newWindow.document.write(`<iframe width='100%' height='100%' src='data:application/pdf;base64, ${item.data}'></iframe>`);
        }
        if (/txt/.test(item.fileSuffix)) {
          // txt
          const newWindow = window.open('');
          newWindow.document.write(`<pre>${item.data}</pre>`);
        }
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
    width: 100%;
    display: flex;
    justify-content: end;
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
