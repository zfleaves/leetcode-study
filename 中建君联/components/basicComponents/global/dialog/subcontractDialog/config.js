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
        // 甲方单位
        {show: true, label: 'dialog.partyB', prop: 'partyBName', span: 8, formType: 'input',
            clearable: true, inputStatus: 'edit', maxlength: 64},
        // 分包计划内容
        {show: true, label: 'dialog.subcontractContent', prop: 'subcontractContent', span: 8,
            formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 255},
        // 分包开工日期
        {label: 'dialog.subContractStartTime', span: 8, formType: 'daterange-split', clearable: true,
            propStart: 'subContractStartTimeStart', propEnd: 'subContractStartTimeEnd', inputStatus: 'edit'},
        // 分包竣工日期
        {label: 'dialog.subContractEndTime', span: 8, formType: 'daterange-split', clearable: true,
            propStart: 'subContractEndTimeStart', propEnd: 'subContractEndTimeEnd', inputStatus: 'edit'}
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
      paging: false,
      // 表头操作行配置
      tableHeader: {
        showColumnCtrl: true, // 显示/隐藏列
        refresh: false // 刷新
      },
      // 是否默认选中第一行
      defaultSeleFirstLine: false,
      // 子系统表头渲染参数
      tableList: [
          // 单据编号
        {show: true, prop: 'docNo', label: 'fConfig.docNo', minWidth: '160'},
        // 项目名称
        {show: true, prop: 'projectName', label: 'fConfig.projectName'},
        // 项目编号
        // {show: true, prop: 'projectCode', label: 'dialog.projectCode', minWidth: '150'},
        // 分包计划内容
        {show: true, prop: 'subcontractContent', label: 'dialog.subcontractContent'},
        // 乙方单位
        {show: true, prop: 'partyBName', label: 'dialog.partyB'},
        // 分包开工日期
        {show: true, filterName: 'date', prop: 'subContractStartTime', label: 'dialog.subContractStartTime', minWidth: '120', align: 'center'},
        // 分包竣工日期
        {show: true, filterName: 'date', prop: 'subContractEndTime', label: 'dialog.subContractEndTime', minWidth: '120', align: 'center'},
        // 填写人
        {show: true, prop: 'createByName', label: 'fConfig.createByName', align: 'center', minWidth: '100'},
        // 填写日期
        {show: true, filterName: 'date', prop: 'createTime', label: 'fConfig.createTime', minWidth: '120', align: 'center'}
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
