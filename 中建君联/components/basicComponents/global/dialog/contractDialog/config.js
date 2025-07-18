/*
 * @Author: your name
 * @Date: 2020-07-25 09:18:04
 * @LastEditTime: 2021-08-02 14:46:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\basicComponents\global\dialog\contractIncomeDialog\config.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {},
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
      { show: true, name: '合同名称', prop: 'contractName', label: 'fConfig.contractName', span: 8, formType: 'input', maxlength: 64 },

      { show: true, name: '合同编号', prop: 'contractCode', label: 'fConfig.contractCode', span: 8, formType: 'input', maxlength: 32 },

      { show: true, name: '乙方单位', prop: 'partyBName', label: 'dialog.partyBName', span: 8, formType: 'input', maxlength: 64 },

      {
        name: '签订日期', label: 'fConfig.signDate', span: 8, formType: 'daterange-split',
        propStart: 'signDateFrom', propEnd: 'signDateTo',
        inputStatus: 'edit'
      }
    ],
    // 是否显示重置按钮
    isReset: true
  },
  // 表格操作按钮
  mainOperateBtn: [],
  isFooterShow: true,
  // 主表渲染参数
  mainTable: {
    //  单选
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

      { show: true, name: '合同编号', prop: 'contractCode', label: 'fConfig.contractCode', minWidth: '180'},

      { show: true, name: '合同名称', prop: 'contractName', label: 'fConfig.contractName' },

      { show: true, name: '合同类型', prop: 'contractTypeValue', label: 'fConfig.contractType', minWidth: '140' },

      { show: true, name: '乙方单位', prop: 'partyBName', label: 'dialog.partyBName' },

      { show: true, name: '签订金额(元)', prop: 'contractAmount', label: 'dialog.contractAmount', filterName: 'setMoney', minWidth: '120' },

      { show: true, name: '签订日期', filterName: 'date', prop: 'signDate', label: 'fConfig.signDate', minWidth: '140', align: 'center' }
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
