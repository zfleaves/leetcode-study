/*
 * @Author: your name
 * @Date: 2021-04-19 11:00:36
 * @LastEditTime: 2022-07-11 16:31:10
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\subcontractorMaterial\materialParameter\config.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'materialParameter',
  // 流程
  processParmas: {
    // 初始化信息
    startInfo: {
      url: 'materialParameter/getStartNode',
      parmasList: [
        {receive: 'sid', value: 'id'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 提交
    startSubmit: {
      url: 'materialParameter/startSubmit'
    },
    // 导出
    exportUrl: {
        url: 'materialParameter/getExportExcel'
    }
  },
  // 数据字典
  dictionary: [
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
      // 项目名称
      {show: true, label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'input', maxlength: 64},
      // 分包商名称
      {show: true, label: 'materialParameter.projectUnitName', prop: 'projectUnitName', span: 8, formType: 'input', maxlength: 64},
      // 材料名称
      {show: true, label: 'fConfig.materialName', prop: 'varietiesName', span: 8, formType: 'input', maxlength: 64},
      // 规格
      {show: true, label: 'fConfig.standards', prop: 'standards', span: 8, formType: 'input', maxlength: 64}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [
    { isCustom: false, code: 'sysHandleExport', authCode: 'export' }
  ],
  // 主表渲染参数
  mainTable: {
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
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName', minWidth: '160'},
      // 分包商名称
      {show: true, prop: 'projectUnitName', label: 'materialParameter.projectUnitName', minWidth: '160'},
      // 材料名称
      {show: true, prop: 'varietiesName', label: 'fConfig.materialName', minWidth: '140'},
      // 规格
      { show: true, label: 'fConfig.standards', prop: 'standards', formType: 'text', maxlength: 64,
      printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 型号
      {show: true, label: 'fConfig.models', prop: 'models', formType: 'text', maxlength: 64,
      printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 品牌
      {show: true, label: 'fConfig.brand', prop: 'brand', formType: 'text', maxlength: 128,
      printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 计量单位
      {show: true, label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 60, maxlength: 32,
      printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 进场日期
      {show: true, filterName: 'date', prop: 'enterTime', label: 'materialParameter.enterTime', minWidth: '100'},
      // 进场数量
      {show: true, label: 'materialParameter.enterQuantity', prop: 'enterQuantity', minWidth: '100'},
      // 退场日期
      {show: true, filterName: 'date', prop: 'exitTime', label: 'materialParameter.exitTime', minWidth: '100'},
      // 累计退场数量
      {show: true, label: 'materialParameter.exitQuantity', prop: 'exitQuantity', minWidth: '120'},
      // 在场数量
      {show: true, label: 'materialParameter.onEnterQuantity', prop: 'onEnterQuantity', minWidth: '100'},
      //  单价(含税)
      {show: true, label: 'fConfig.includeUnitPrice', prop: 'includeUnitPrice', minWidth: '100', filterName: 'setMoney'},
      //  金额(含税)
      {show: true, label: 'fConfig.includeTaxAmount', prop: 'onEnterQuantityAmount', minWidth: '100', filterName: 'setMoney'}
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
