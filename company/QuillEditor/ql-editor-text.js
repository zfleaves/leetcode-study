// 全局组件
import Vue from 'vue'
import qlEditorText from './ql-editor-text.vue'

const components = {
  'qlEditorText': qlEditorText
}

Object.keys(components).forEach(name => Vue.component(name, components[name]))

export default {}
