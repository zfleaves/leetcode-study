<!-- eslint-disable indent -->
<template>
  <div class="local-quill-editor" :class="!isToolBar ? 'no-tool-bar' : ''">
    <quill-editor
      ref="myLQuillEditor"
      v-model="content"
      :options="editorOption"
      :disabled="disabled"
      class="editor"
      @blur="onEditorBlur"
      @focus="onEditorFocus"
      @change="onEditorChange"
    >
    </quill-editor>
    <div class="limit-word" v-if="limitNumber">当前已输入{{ `${total}/${limitNumber}` }}</div>
  </div>
</template>

<script>
import { getAlertDemandList } from '@/services/publicInterface'
import { quillEditor } from 'vue-quill-editor'
import Quill from 'quill'
// import mention from 'quill-mention'
import mention from './quill-mention-test'
import { upload } from '@/services/upload.js'
// 引入样式和quillEditor
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'quill-mention/dist/quill.mention.min.css'
import _debounce from 'lodash/debounce' // 引入mention 组件
import { ImageDrop } from 'quill-image-drop-module'
import imageResize from 'quill-image-resize-module'
// import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
import {
  container,
  ImageExtend,
  QuillWatch
} from './quill-image-extend-module-test'
// const deltaToHtml = require('quill-delta-to-html')
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', imageResize)
Quill.register('modules/ImageExtend', ImageExtend)

export default {
  name: 'QuillEditor',
  components: {
    quillEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    limitNumber: {
      type: Number,
      default: 0
    },
    // 是否开启@功能
    isMention: {
      type: Boolean,
      default: false
    },
    // 工具栏配置项
    toolbarOptions: {
      type: Array,
      default: () => {
        return [
          // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
          ['bold', 'italic', 'underline', 'strike'],
          // 引用  代码块-----['blockquote', 'code-block']
          ['blockquote'],
          // 1、2 级标题-----[{ header: 1 }, { header: 2 }]
          // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
          [{ list: 'ordered' }, { list: 'bullet' }],
          // 上标/下标-----[{ script: 'sub' }, { script: 'super' }]
          [{ script: 'sub' }, { script: 'super' }],
          // 缩进-----[{ indent: '-1' }, { indent: '+1' }]
          [{ indent: '-1' }, { indent: '+1' }],
          // 对齐方式-----[{ align: [] }]
          [{ align: [] }],
          // 文本方向-----[{'direction': 'rtl'}]
          // 字体大小-----[{ size: ['small', false, 'large', 'huge'] }]
          // [{ size: ['12px', '14px', '14px', '16px', '18px'] }],
          // [{ size: ['small', 'normal', 'large', 'huge'] }],
          // 标题-----[{ header: [1, 2, 3, 4, 5, 6, false] }]
          // [{ header: [1, 2, 3, 4, 5, 6, false] }],
          // 字体颜色、字体背景颜色-----[{ color: [] }, { background: [] }]
          [{ color: [] }, { background: [] }],
          // 字体种类-----[{ font: [] }]
          // [{ font: [] }],
          // 清除文本格式-----['clean']
          ['clean'],
          // 链接、图片、视频-----['link', 'image', 'video']
          ['link'],
          ['image']
        ]
      }
    },
    alertUsers: {
      type: Array,
      default: () => {
        return []
      }
    },
    alertTasks: {
      type: Array,
      default: () => {
        return []
      }
    },
    alertDemands: {
      type: Array,
      default: () => {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tabs: {
      type: Array,
      default: () => {
        return [
          { prop: 'all', title: '全部' },
          { prop: 'user', title: '人' },
          { prop: 'task', title: '任务' },
          { prop: 'demand', title: '需求' }
        ]
      }
    },
    isToolBar: {
      type: Boolean,
      default: true
    },
    isSelectionchange: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.content = val
    },
    alertUsers(val) {
      this.selectUsers = this.alertUsers?.slice()
    },
    alertTasks(val) {
      this.selectTasks = this.alertTasks?.slice()
    },
    alertDemands(val) {
      this.selectDemands = this.alertDemands?.slice()
    }
  },
  computed: {
    personList() {
      const personList = this.$store.state.user.personList.filter(
        (v) => v.code !== this.$store.state.user.userInfo.code
      )
      return personList
    },
    demandList() {
      return this.$store.state.user.demandList
    },
    taskList() {
      return this.$store.state.user.taskList
    }
  },
  data() {
    return {
      content: '',
      total: 0,
      showQill: true,
      editorOption: {
        modules: {
          imageDrop: false,
          imageResize: {
            displaySize: true
          },
          clipboard: {
            // 粘贴版，处理粘贴时候带图片
            matchers: [[Node.ELEMENT_NODE, this.handleCustomMatcher]]
          },
          toolbar: {
            handlers: {
              image: function () {
                // 触发图片上传的时候返回的信息
                QuillWatch.emit(this.quill.id) // 使用图片上传插件的统一写法
              }
            }
          },
          ImageExtend: {
            // 使用的图片上传扩展插件
            name: 'file', // 传的参数名
            // size: 2, // 单位为M, 1M = 1024KB
            action: 'api/sys/file/upload', // 后台上传图片的接口地址
            headers: (xhr) => {
              xhr.setRequestHeader(
                'Authorization',
                this.$store?.state?.user?.token
              )
              xhr.setRequestHeader('userId', this.$store?.state?.user?.empId)
            }, // 请求头,
            response: (res) => {
              return res.data.url
            }
          },
          mention: this.isMention
            ? {
              dataAttributes: [
                'index',
                'name',
                'code',
                'taskId',
                'demandId',
                'prop',
                'type'
              ],
              tabs: this.tabs,
              tabsIndex: 0,
              // allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/, // 匹配字母搜索
              allowedChars: /^[\u4e00-\u9fa5]*$/, // 匹配中文搜索
              mentionDenotationChars: ['@'], // 通过@拉起人员框
              positioningStrategy: 'fixed',
              itemIndex: 0,
              onSelect: (tabItem, data, insertItem) => {
                // 注意：选中后的回调函数
                this.selectItem(tabItem, data)
                insertItem(data)
              },
              // 人员框渲染内容vscode-file://vscode-app/d:/%E5%8A%9E%E5%85%AC%E8%BD%AF%E4%BB%B6/vscode/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html
              renderItem: (data, searchTerm, tabItem) => {
                // // console.log('tabItem: ', tabItem)
                // const { prop } = tabItem
                const display = data.type === 'user' ? 'block' : 'none'
                const textplay = data.type !== 'user' ? 'block' : 'none'
                const img = data.avatar
                  ? `<image class="avatar-icon" style="display: ${display}" src=${data.avatar}/>`
                  : `<span class="avatar-icon" style="display: ${display}"></span>`
                return `<div class="user">
                  ${img}
                  <div class="text-type ${data.type}" style="display: ${textplay}">
                  </div>
                  <div class="user-info">
                    <div class="name">${data.name}</div>
                    <div  style="display: ${display}">${
  data.orgName || ''
}</div>
                  </div>
                </div>`
              },
              // 加载人员框loading
              renderLoading: () => {
                return 'Loading...'
              },
              source: (tabItem, searchTerm, renderList, mentionChar) => {
                // console.log('tabItem: ', tabItem)
                const newPersonList = this.getSearchSourecList(
                  tabItem,
                  searchTerm
                )
                // console.log('newPersonList: ', newPersonList)
                renderList(newPersonList)
              }
            }
            : null
        },
        theme: 'snow',
        placeholder: '请输入正文'
      },
      selectUsers: [],
      selectTasks: [],
      selectDemands: [],
      userList: [],
      editor: null,
      emitter: null
    }
  },
  created() {
    // 由于任务每时都在刷新
    getAlertDemandList().then((res) => {
      // console.log('res-getAlertDemandList: ', res)
      this.$store.commit('user/setOtherList', JSON.parse(JSON.stringify(res)))
    })
    this.content = this.getInitVal(this.value)
    // this.content = this.value.replace(/mention/g, 'mentionInit')
    this.editorOption.placeholder = this.placeholder
    this.editorOption.modules.toolbar.container = this.toolbarOptions
  },
  mounted() {
    this.editor = this.$refs.myLQuillEditor.quill
    this.emitter = this.editor?.selection.emitter
    if (this.isSelectionchange) {
      this.emitter.listenDOM('selectionchange', document, this.selectionchange)
    }
  },
  beforeDestroy() {
    const dom = document.getElementsByClassName('ql-mention-list-container')
    if (dom && dom.length) {
      document.body.removeChild(dom[0])
    }
    this.emitter = null
  },
  methods: {
    selectionchange() {
      // console.log('e: ', e)
      const range = this.editor.getSelection() // 获取选区
      // console.log('range: ', range)
      if (range && range.length > 0) {
        // 使用 Quill 的 getContents 方法获取选中内容的 Delta 对象
        const delta = this.editor.getContents(range.index, range.length)
        if (!delta.ops[0].insert?.length) return
        const length = delta.ops[0].insert?.split('\n')?.[0]?.length
        const obj = this.editor.getBounds(range.index, length)
        const converter = new QuillDeltaToHtmlConverter(delta.ops)
        var html = converter.convert()
        this.emitSelectionchange(obj, html)
      }
    },
    emitSelectionchange: _debounce(function (obj, html) {
      const qlEditor = document.getElementsByClassName('ql-editor')[0]
      const scrollTop = qlEditor.scrollTop
      console.log('scrollTop: ', scrollTop)
      this.$emit('selectionchange', { position: obj, content: html })
    }, 300),
    setQuillIndex(index) {
      const quill = this.$refs['myLQuillEditor'].quill
      quill.setSelection(index)
    },
    setQuillIsFocus(flag) {
      const quill = this.$refs['myLQuillEditor'].quill
      quill.enable(flag)
    },
    getSearchSourecList(tabItem, searchTerm) {
      const { prop } = tabItem
      if (prop === 'user') return this.getSearchPersonList(searchTerm)
      if (prop === 'task') return this.getSearchTaskList(searchTerm)
      if (prop === 'demand') return this.getSearchDemandList(searchTerm)
      return this.getSearchAllList(searchTerm)
    },
    // 获取所有人员来源
    getSearchAllList(searchTerm) {
      const list = [...this.personList, ...this.taskList, ...this.demandList]
      const newPersonList = list
        .filter((v) => {
          return (
            v.name.indexOf(searchTerm) > -1 ||
            v.orgName.indexOf(searchTerm) > -1
          )
        })
        .map((v, index) => {
          return {
            ...v,
            index
          }
        })
      return newPersonList
    },
    // 获取人员来源
    getSearchPersonList(searchTerm) {
      const newPersonList = this.personList
        .filter((v) => {
          return (
            v.name.indexOf(searchTerm) > -1 ||
            v.orgName.indexOf(searchTerm) > -1
          )
        })
        .map((v, index) => {
          return {
            ...v,
            index
          }
        })
      return newPersonList
    },
    // 获取任务来源
    getSearchTaskList(searchTerm) {
      const newPersonList = this.taskList
        .filter((v) => v.name.indexOf(searchTerm) > -1)
        .map((v, index) => {
          return {
            ...v,
            index
          }
        })
      return newPersonList
    },
    // 获取需求来源
    getSearchDemandList(searchTerm) {
      const newPersonList = this.demandList
        .filter((v) => v.name.indexOf(searchTerm) > -1)
        .map((v, index) => {
          return {
            ...v,
            index
          }
        })
      return newPersonList
    },
    getInitVal(val) {
      if (!val) return val
      let str = val.replace(
        /class="mention"/g,
        'style=\'color: #37f;border-radius: 20px;background: rgba(51, 119, 255, 0.11);padding: 2px 12px;\''
      )
      str = str.replace(/<span class="">@<\/span>/, '@')
      return str
    },
    // 失去焦点事件
    onEditorBlur(e) {
      // console.log('onEditorBlur: ', e)
    },
    // 获得焦点事件
    onEditorFocus(e) {
      // console.log('onEditorFocus: ', e)
    },

    selectItem(tabItem, data) {
      // console.log('tabItem: ', tabItem)
      this.getTabSelectItem(data.type, data)
    },
    // 选中的人
    getTabSelectItem(prop, data) {
      // if (prop === 'user') {
      //   this.selectUsers.push(data.code)
      //   this.$emit('update:alertUsers', this.selectUsers)
      //   return
      // }
      // if (prop === 'task') {
      //   this.selectTasks.push(data.taskId)
      //   this.$emit('update:alertTasks', this.selectTasks)
      //   return
      // }
      // if (prop === 'demand') {
      //   this.selectDemands.push(data.demandId)
      //   this.$emit('update:alertDemands', this.selectDemands)
      //   console.log('this.selectDemands: ', this.selectDemands)
      // }
    },
    // 处理字数限制
    onEditorChange(e) {
      if (this.limitNumber) {
        const evt = this.$refs.myLQuillEditor
        this.total = e.text.trim().length
        if (e.text.length > this.limitNumber) {
          evt.quill.deleteText(this.limitNumber, 1)
        }
      }
      this.editorChange(e)
    },
    // 内容改变事件
    editorChange: _debounce(function (e) {
      if (e.html.includes('href="') && !e.html.includes('href="http')) {
        e.html = e.html.replaceAll('href="', 'href="http://')
      }
      this.$emit('editorChange', e.html)
      this.getAlertData()
    }, 300),
    // 获取@数据
    getAlertData() {
      const users = []
      const tasks = []
      const demands = []
      const doms =
        this.$refs.myLQuillEditor.quill.container.getElementsByClassName(
          'mention'
        )
      try {
        const n = doms.length
        for (let i = 0; i < n; i++) {
          const mention = doms[i]
          // console.log('mention: ', mention)
          const type = mention.getAttribute('data-type')
          if (type === 'user') {
            const code = mention.getAttribute('data-code')
            users.push(code)
          }
          if (type === 'task') {
            const id = mention.getAttribute('data-task-id')
            tasks.push(id)
          }
          if (type === 'demand') {
            const id = mention.getAttribute('data-demand-id')
            demands.push(id)
          }
        }
      } catch (error) {
        console.log('error: ', error)
      } finally {
        this.selectUsers = [...users]
        this.$emit('update:alertUsers', this.selectUsers)
        this.selectTasks = [...tasks]
        this.$emit('update:alertTasks', this.selectTasks)
        this.selectDemands = [...demands]
        this.$emit('update:alertDemands', this.selectDemands)
      }
    },
    handleCustomMatcher(node, Delta) {
      let ops = []
      Delta.ops.forEach(async (op) => {
        // console.log('op: ', op)
        if (op.insert && typeof op.insert === 'string') {
          // 如果粘贴了图片，这里会是一个对象，所以可以这样处理
          ops.push({
            insert: op.insert,
            attributes: op.attributes
          })
        } else {
          const Expression = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
          const objExp = new RegExp(Expression)
          if (op.insert.image && !objExp.test(op.insert.image)) {
            const file = this.base64toFile(op.insert.image)
            this.copyFun(file)
          } else if (op.insert.image && objExp.test(op.insert.image)) {
            ops.push({
              insert: op.insert,
              attributes: op.attributes
            })
          }
        }
      })
      Delta.ops = ops
      return Delta
    },

    copyFun(file) {
      let quill = this.$refs.myLQuillEditor.quill
      let cursorIndex = quill.selection.savedRange.index
      const formData = new FormData()
      formData.append('file', file)
      upload(formData)
        .then((res) => {
          const url = res.url
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function (e) {
            quill.insertEmbed(cursorIndex, 'image', url)
          }
        })
        .catch((e) => {})
    },

    base64toFile(urlData) {
      if (typeof urlData !== 'string') {
        this.$toast('urlData不是字符串')
        return
      }
      var arr = urlData.split(',')
      var type = arr[0].match(/:(.*?);/)[1]
      var fileExt = type.split('/')[1]
      var bstr = window.atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File(
        [u8arr],
        `${(Math.random() + '').replace('.', '')}.` + fileExt,
        {
          type: type
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">
.editor {
  /deep/ {
    .ql-toolbar {
      padding: 6px;
    }
    .ql-container {
      height: 100px;
      white-space: pre;
    }
    .ql-snow {
      .ql-picker-label {
        &::before {
          vertical-align: top !important;
        }
      }
      .ql-color-picker,
      .ql-icon-picker {
        .ql-picker-label {
          padding: 0 4px;
        }
      }
      .ql-picker {
        &.ql-size {
          .ql-picker-label,
          .ql-picker-item {
            &::before {
              content: attr(data-value);
              vertical-align: top !important;
            }
          }
        }
      }
      .ql-tooltip {
        &::before {
          content: '输入网址：';
        }
        .ql-preview {
          margin-top: 3px;
        }
        a.ql-action {
          &::after {
            content: '编辑';
          }
        }
        &.ql-editing {
          a.ql-action {
            &::after {
              content: '保存';
            }
          }
        }
        a.ql-remove {
          &::before {
            content: '删除';
          }
        }
      }
    }
    .ql-editor {
      &.ql-blank {
        &::before {
          color: #c5c5c5;
          font-style: normal;
        }
      }
    }

    .ql-disabled {
      cursor: not-allowed;
    }
  }
}
.local-quill-editor {
  /deep/ {
    .ql-toolbar {
      &.ql-snow {
        border-bottom: none;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          display: block;
          border-radius: 999px;
          height: 1px;
          background-color: #CCC;
          bottom: 0;
          left: 10px;
          right: 10px;
        }
        .ql-stroke {
          stroke: rgba(134, 144, 156, 1);
        }
        button svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    .ql-container.ql-snow {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
    .ql-editor {
      p {
        img {
          max-width: 50% !important;
        }
      }
    }
  }
}
.no-tool-bar {
  /deep/ .quill-editor {
    border-radius: 8px;
    border: 1px solid #E5E6EC;
  }
  /deep/ .ql-toolbar {
    display: none;
  }
  /deep/ .ql-container {
    // border-top: 1px;
    border: 0 !important;
    border-radius: 8px;
    padding: 6px 15px !important;
    height: 32px !important;
  }
}
.limit-word {
  text-align: right;
  font-size: 12px;
  color: #606266;
}
</style>
<style lang="scss"></style>
