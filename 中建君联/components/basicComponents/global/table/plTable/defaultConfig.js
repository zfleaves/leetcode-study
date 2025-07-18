/*
 * @Author: wumaoxia
 * @Date: 2020-06-28 18:23:56
 * @LastEditTime: 2022-03-21 09:37:49
 * @LastEditors: Please set LastEditors
 * @Description: 表格基础配置
 * @FilePath: ''
 */

export default () => ({
    showHeader: true,
    border: true,
    size: 'small',
    stripe: false,
    fit: true,
    highlightCurrentRow: true,
    defaultExpandAll: false,
    defaultSort: 'ascending',
    tooltipEffect: 'light',
    showSummary: false,
    sumText: '合计',
    selectOnIndeterminate: true,
    indent: 16,
    rowKey: 'id',
    defaultSeleFirstLine: false, // 是否默认选中第一行
    isRadio: false, // 是否为单选
    isCheckbox: false, // 是否为多选
    isIndexShow: true, // 是否显示序号列
    treeConfig: {
      children: 'children ',
      indent: 16,
      isLeaf: 'leaf'
    }
  }
);

