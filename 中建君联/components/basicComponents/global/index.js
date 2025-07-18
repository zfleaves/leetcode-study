/*
 * @Author: your name
 * @Date: 2020-06-28 15:51:05
 * @LastEditTime: 2020-09-14 09:30:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration\src\components\global\index.js
 */
// 全局组件
import Vue from 'vue';

// 搜索表单
import searchForm from './form/searchForm.vue';
// 编辑表单
import editForm from './form/editForm.vue';
// 查询表格
import queryTable from './table/queryTable/queryTable.vue';
// 编辑表格
import editTable from './table/editTable/editTable.vue';
// 多数据编辑表格
import editPlTable from './table/plTable/editPlTable.vue';
// 多数据查看表格
import queryPlTable from './table/plTable/queryPlTable.vue';
// 树
import tree from './tree/tree.vue';
// 查询页面
import queryPage from './page/queryPage/queryPage.vue';
// 新增页面
import editPage from './page/editPage/editPage.vue';
// 分页
import toPage from './toPage/toPage.vue';
// 按钮
import button from './button/button.vue';
// 暂无数据
import noData from './noData/noData.vue';
// 抽屉
import drawer from './drawer/drawer.vue';
// 数字组件
import elNumber from './elNumber/elNumber.vue';
// 头部
import editTitle from './editTitle/editTitle.vue';
// 超出显示
import tooltips from './tooltips/tooltips';
// 多选
import multipleChoice from './multipleChoice/multipleChoice';
// dialog
import dialog from './dialog/dialog';
// importDialog
import importDialog from './dialog/importDialog/importDialog';
// 流程监控
import monitorDialog from 'components/basicComponents/process/monitorDialog';


const components = {
  'g-search-form': searchForm,
  'g-edit-form': editForm,
  'g-query-table': queryTable,
  'g-edit-table': editTable,
  'g-edit-pl-table': editPlTable,
  'g-query-pl-table': queryPlTable,
  'g-to-page': toPage,
  'g-button': button,
  'g-tree': tree,
  'no-data': noData,
  'g-drawer': drawer,
  'el-number': elNumber,
  'tooltips': tooltips,
  'g-edit-title': editTitle,
  'query-page': queryPage,
  'edit-page': editPage,
  'multiple-choice': multipleChoice,
  'g-dialog': dialog,
  'g-import-dialog': importDialog,
  'monitorDialog': monitorDialog
};


Object.keys(components).forEach(name => Vue.component(name, components[name]));

export default {};
