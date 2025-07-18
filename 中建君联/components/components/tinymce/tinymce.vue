<template>
  <div class='tinymce'>
    <Editor class="tinymce-editor" :id='keyId' v-model='tinymceHtml' placeholder="请输入内容" :init='init'>
    </Editor>
    <div class="editor-custom-btn-container">
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK">
      </editorImage>
    </div>
    <div class="preview">
      <el-button type="primary" size="mini" @click="previewClikc">预览</el-button>
    </div>

    <el-dialog
      :visible.sync="previewShow"
      v-if="previewShow"
      :append-to-body="true"
      title="富文本内容预览" center
      top="50px" width="84%">
      <div class="preview-cons" :style="{height: previewHeight+ 'px'}">
        <div class="fixed-scroll">
          <div class="content" v-html="tinymceHtml"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 'tinymce/skins/ui/oxide/skin.css'
  import editorImage from './editorImage.vue';
  import tinymce from 'tinymce/tinymce';
  import 'tinymce/themes/modern/theme';
  import Editor from '@tinymce/tinymce-vue';

  import 'tinymce/plugins/image';
  import 'tinymce/plugins/link';
  import 'tinymce/plugins/code';
  import 'tinymce/plugins/table';
  import 'tinymce/plugins/lists';
  import 'tinymce/plugins/contextmenu';
  import 'tinymce/plugins/wordcount';
  import 'tinymce/plugins/colorpicker';
  import 'tinymce/plugins/textcolor';

  export default {
    name: 'tinymce',
    data() {
      return {
        previewShow: false,
        tinymceHtml: '',
        init: {
          language_url: require('assets/tinymce/zh_CN.js'),
          language: 'zh_CN',
          selector: `#${this.tinymceId}`,
          skin_url: require('assets/tinymce/skins/lightgray/skin.min.css'),
          height: 600,
          plugins: 'codesample link lists image code table colorpicker textcolor wordcount contextmenu ',
          // eslint-disable-next-line
          toolbar: 'codesample bold italic underline strikethrough   | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | undo redo | link unlink image code | removeformat',
          branding: false,
          codesample_languages: [
              {text: 'HTML/XML', value: 'markup'},
              {text: 'JavaScript', value: 'javascript'},
              {text: 'CSS', value: 'css'},
              {text: 'PHP', value: 'php'}
          ],
          codesample_content_css: '/static/prism.css'
        },
        previewHeight: 200
      };
    },
    props: {
      keyId: {
        default: 'tinymce'
      }
    },
    mounted() {
      tinymce.init({});
      this.tinymceId = `#${this.keyId}`;
      this.previewHeight = document.body.offsetHeight * 0.84 - 55 - 40;
    },
    methods: {
      destroyTinymce() {
        if (tinymce.get(this.tinymceId)) {
          tinymce.get(this.tinymceId).destroy();
        }
      },
      setContent(value) {
        Editor.get(this.tinymceId).setContent(value);
      },
      getContent() {
        tinymce.get(this.tinymceId).getContent();
      },
      getTinymceValue() {
        return this.tinymceHtml;
      },
      setTinymceValue(val) {
        this.tinymceHtml = val;
      },
      clearTinymce() {
        this.tinymceHtml = '';
      },
      imageSuccessCBK(arr) {
        arr.forEach(v => {
          this.tinymceHtml += `<img style="max-width: 500px" class="wscnph" src="${v}" >`;
        });
      },
      previewClikc() {
        this.previewShow = !this.previewShow;
      }
    },
    destroyed() {
      this.destroyTinymce();
    },
    components: {Editor, editorImage}
  };
</script>
<style lang="scss">
.tinymce{
 .mce-tinymce{
    box-shadow: none !important;
  }
  .mce-panel{
    border: 0 !important;
  }
}
</style>
<style scoped lang="scss">
  .tinymce {
    width: 100%;
    position: relative;
    .tinymce-editor{
      height: 100px;
    }
    .editor-custom-btn-container {
      max-height: 100px;
      position: absolute;
      width: 100px;
      right: 10px;
      top: 5px
    }
    .preview {
      position: absolute;
      width: 100px;
      right: 116px;
      top: 2px
    }

    .wscnph {
      width: 50px;
    }
  }
  .preview-cons {
    position: relative;
    overflow: hidden;
    .fixed-scroll {
      height: 100%;
      .content {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
