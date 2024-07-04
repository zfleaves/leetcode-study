/*
 * @Author: your name
 * @Date: 2020-08-05 09:12:52
 * @LastEditTime: 2021-08-02 10:26:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\warManagement\warWarehouseShelves\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    saveUrl: {
      url: 'warWarehouseShelves/setEdit'
    }
  },
  // 数据字典
  dictionary: [],
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
      // 创建人
      {show: true, label: 'fConfig.createBy', prop: 'createByName', span: 8, formType: 'input', maxlength: 32},
      // 仓库库位名称
      {show: true, label: 'fConfig.warehouseShelvesName', prop: 'warehouseShelvesName', span: 8, formType: 'input', maxlength: 64},
      // 仓库库位编号
      {show: true, label: 'fConfig.warehouseShelvesCode', prop: 'warehouseShelvesCode', span: 8, formType: 'input', maxlength: 32}
    ],
    // 是否显示重置按钮
    isReset: false
  },
  mainBtnSlotShow: false,
  // 表格操作按钮
  mainOperateBtn: [
    {isCustom: false, code: 'sysHandleAdd', authCode: 'create', noAuth: true}
  ],
  // 主表渲染参数
  mainTable: {
    // 单选
    isRadio: true,
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
      showColumnCtrl: true, // 显示/隐藏列
      refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleFirstLine: false,
    // 子系统表头渲染参数
    tableList: [
      // 仓库库位编号
      {show: true, prop: 'warehouseShelvesCode', label: 'fConfig.warehouseShelvesCode', minWidth: '120'},
      // 仓库库位名称
      {show: true, prop: 'warehouseShelvesName', label: 'fConfig.warehouseShelvesName'},
      // 创建人
      {show: true, prop: 'createByName', label: 'fConfig.createBy', minWidth: '80'},
      // 修改人
      {show: true, prop: 'updateByName', label: 'fConfig.updateByName', minWidth: '80'},
      // 最后更新日期
      {show: true, filterName: 'date', prop: 'updateTime', label: 'fConfig.updateTime', minWidth: '120'},
      // 操作
      {show: true, prop: 'operate', formType: 'operate', label: 'fConfig.operate', minWidth: '150',
        buts: [
          {name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update', noAuth: true},
          {name: 'button.delete', class: 'danger', fn: 'handleDelete', authCode: 'delete', noAuth: true}
        ]
      }
    ]
  },
  mainFormConfig: {
    formList: [
        // 仓库库位名称
        { label: 'fConfig.warehouseShelvesName', prop: 'warehouseShelvesName', span: 24, formType: 'input', isRule: true, maxlength: 64},
        // 仓库库位编号
        { label: 'fConfig.warehouseShelvesCode', prop: 'warehouseShelvesCode', span: 24, formType: 'input', inputStatus: 'disable', maxlength: 32, placeholder: 'tips.automaticGeneration'}
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
