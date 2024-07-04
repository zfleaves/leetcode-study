/*
 * @Author: your name
 * @Date: 2020-07-23 15:47:21
 * @LastEditTime: 2022-03-16 13:49:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\basic\materialVarieties\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    saveUrl: {
      url: 'materialVarieties/setVarietiesEdit'
    },
    exportUrl: {
      url: 'materialVarieties/getExportData'
    }
  },
  // 数据字典
  dictionary: [
    {dicCode: 'costType', propCode: 'costType'}
  ],
  // 接口数据
  selectList: [],
  // 搜索
  searchControls: {
    // 是否显示
    formShow: true,
    // 搜索使用插槽
    searchSlotShow: false,
    // 表单配置
    formList: [
      // 分类名称
      {show: true, label: 'fConfig.classifyName', prop: 'classifyName', span: 8, formType: 'input', maxlength: 64},
      // 分类编码
      {show: true, label: 'fConfig.classifyCode', prop: 'classifyCode', span: 8, formType: 'input', maxlength: 32},
      // 填写人
      {show: true, label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', maxlength: 32},
      // 材料品种名称
      {show: true, label: 'fConfig.varietiesName', prop: 'varietiesName', span: 8, formType: 'input', maxlength: 64},
      // 规格
      {show: true, label: 'fConfig.standards', prop: 'standards', span: 8, formType: 'input', maxlength: 64},
      // 材料品种编码
      {show: true, label: 'fConfig.varietiesCode', prop: 'varietiesCode', span: 8, formType: 'input', maxlength: 20}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  mainBtnSlotShow: true,
  // 表格操作按钮
  mainOperateBtn: [
    {isCustom: false, code: 'sysHandleAdd', authCode: 'create'},
    {isCustom: true, icon: 'el-icon-plus', slot: false, type: 'primary', plain: false,
    code: 'handleBindClassifyBtn', name: 'materialVarieties.build', authCode: 'build'},
    {isCustom: false, code: 'sysHandleDeleteAll', name: 'button.oneClickClear', authCode: 'oneClickClear'},
    {isCustom: false, code: 'sysHandleDeletaBatch', authCode: 'batchDelete'},
    {isCustom: false, code: 'sysHandleDownloadTemplate', name: 'button.downloadTemplate', authCode: 'downloadTemplate'},
    {isCustom: false, code: 'sysHandleImport', slot: true, name: 'button.Import', authCode: 'Import'},
    {isCustom: false, code: 'sysHandleExport', name: 'button.export', authCode: 'export'}
  ],
  // 主表渲染参数
  mainTable: {
    // 多选
    isCheckbox: true,
    // 表格数据
    tableData: [],
    // 表格高度
    maxHeight: 500,
    pageSize: 10,
    // 页码
    total: 0,
    // 是否显示分页
    paging: true,
    // 表头操作行配置
    tableHeader: {
      showColumnCtrl: false, // 显示/隐藏列
      refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 子系统表头渲染参数
    tableList: [
      // 材料品种编码
      {show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120'},
      // 材料品种名称
      {show: true, prop: 'varietiesName', label: 'fConfig.varietiesName', minWidth: '140'},
      // 规格
      {show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '120'},
      // 单位
      {show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '50'},
      // 所属分类名称
      {show: true, prop: 'classifyName', label: 'fConfig.classifyName'},
      // 所属分类编码
      { show: true, prop: 'classifyCode', label: 'fConfig.classifyCode', minWidth: '80' },
      // 参考价
      { show: true, label: 'materialVarieties.referencePrice', prop: 'referencePrice', minWidth: '100', filterName: 'setMoney', align: 'right'},
       // 别名
      { show: true, prop: 'aliasName', label: 'materialVarieties.aliasName', minWidth: '120' },
       // 图片
      {show: true, prop: 'attachment', label: 'fConfig.img', formType: 'slot', align: 'center', minWidth: '120' },
      // 备注
      {show: true, prop: 'remarks', label: 'fConfig.purposeRemarks', minWidth: '120'},
      // 状态
      {show: true, prop: 'status', label: 'fConfig.status', minWidth: '80', formType: 'slot'},
      // 填写人
      {show: true, prop: 'createByName', label: 'fConfig.createByName', minWidth: '80'},
      // 修改人
      {show: true, prop: 'updateByName', label: 'fConfig.updateByName', minWidth: '80'},
      // 最后更新日期
      {show: true, filterName: 'date', prop: 'updateTime', label: 'fConfig.updateTime', minWidth: '120'},
      // 操作
      {show: true, prop: 'operate', formType: 'operate', label: 'fConfig.operate', minWidth: '150',
        buts: [
          {name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update'},
          {name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete'}
        ]
      }
    ]
  },
  mainFormConfig: {
    formList: [
        // 分类名称
        { label: 'fConfig.classifyName', prop: 'classifyName', span: 24, formType: 'slot'},
        // 材料品种名称
        { label: 'fConfig.varietiesName', prop: 'varietiesName', span: 24, formType: 'input', isEdit: true, maxlength: 64, isRule: true},
        // 材料品种编码
        { label: 'fConfig.varietiesCode', prop: 'varietiesCode', span: 24, formType: 'input', maxlength: 20},
        // 规格
        { label: 'fConfig.standards', prop: 'standards', span: 24, formType: 'input', isEdit: true, maxlength: 64, isRule: true},
        // 单位
        { label: 'fConfig.unit', prop: 'unit', span: 24, formType: 'input', isEdit: true, maxlength: 32, isRule: true },
        // 参考价
        { label: 'materialVarieties.referencePrice', prop: 'referencePrice', span: 24, formType: 'elNumber', maxlength: 12, precision: 2, min: 0 },
        // 别名
        { label: 'materialVarieties.aliasName', prop: 'aliasName', span: 24, formType: 'input', maxlength: 128},
        // 备注
        { label: 'fConfig.purposeRemarks', prop: 'remarks', span: 24, formType: 'input', maxlength: 128},
        // 附件
        { label: 'fConfig.img', prop: 'attachment', span: 24, formType: 'upload', arrayNumber: 1, limit: 1, multiple: false, isPhoto: true}
    ]
  }
};
class Page {
  constructor() {
    this.PageConfig = JSON.parse(JSON.stringify(PageConfig));
    this.init();
  }
  init () {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
