import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    saveUrl: {
      url: 'warWarehouse/setEdit'
    }
  },
  // 数据字典
  dictionary: [
    {dicCode: 'warStatus', propCode: 'status'}
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
      // 状态
      {show: true, label: 'fConfig.status', prop: 'status', span: 8, formType: 'dicSelect', maxlength: 32},
      // 创建人
      {show: true, label: 'fConfig.createBy', prop: 'createByName', span: 8, formType: 'input', maxlength: 32},
      // 仓库名称
      {show: true, label: 'fConfig.warehouseName', prop: 'warehouseName', span: 8, formType: 'input', maxlength: 64},
      // 仓库编号
      {show: true, label: 'fConfig.warehouseCode', prop: 'warehouseCode', span: 8, formType: 'input', maxlength: 32},
      // 最后更新日期
      {label: 'fConfig.updateTime', span: 8, formType: 'daterange-split',
            propStart: 'updateTimeFrom', propEnd: 'updateTimeTo',
            inputStatus: 'edit'}
    ],
    // 是否显示重置按钮
    isReset: true
  },
  mainBtnSlotShow: false,
  // 表格操作按钮
  mainOperateBtn: [
    {isCustom: false, code: 'sysHandleAdd', authCode: 'create'}
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
      // 状态
      {show: true, prop: 'status', label: 'fConfig.status', formType: 'slot', align: 'center', minWidth: '100'},
      // 仓库编号
      {show: true, prop: 'warehouseCode', label: 'fConfig.warehouseCode', fn: 'handleSetRouter', minWidth: '100'},
      // 仓库名称
      {show: true, prop: 'warehouseName', label: 'fConfig.warehouseName'},
      // 主要存放材料
      {show: true, prop: 'materials', label: 'warWarehouse.materials', minWidth: '120'},
      // 项目名称
      {show: true, prop: 'projectName', label: 'fConfig.projectName'},
      // 项目编号
      {show: true, prop: 'projectCode', label: 'fConfig.projectCode', minWidth: '120'},
      // 库库位/货架子目管理
      {show: true, prop: 'warWarehouseShelves', label: 'warWarehouse.warWarehouseShelves', formType: 'slot', minWidth: '180'},
      // 创建人
      {show: true, prop: 'createByName', label: 'fConfig.createBy', minWidth: '80'},
      // 修改人
      {show: true, prop: 'updateByName', label: 'fConfig.updateByName', minWidth: '80'},
      // 最后更新日期
      {show: true, filterName: 'date', prop: 'updateTime', label: 'fConfig.updateTime', minWidth: '120'},
      // 操作
      {show: true, prop: 'operate', formType: 'operate', label: 'fConfig.operate', minWidth: '140',
        buts: [
          {name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update'}
        ]
      }
    ]
  },
  mainFormConfig: {
    formList: [
        // 项目名称
        { label: 'fConfig.projectName', prop: 'projectName', span: 24, formType: 'project', key: 'projectId',
          isRelation: true,
          relationList: [
            {receive: 'projectCode', value: 'projectCode'}
          ],
          isRule: true
        },
        // 仓库名称
        { label: 'fConfig.warehouseName', prop: 'warehouseName', span: 24, formType: 'input', isRule: true, maxlength: 64},
        // 仓库编号
        { label: 'fConfig.warehouseCode', prop: 'warehouseCode', span: 24, formType: 'input', maxlength: 32},
        // 主要存放材料
        { label: 'warWarehouse.materials', prop: 'materials', span: 24, formType: 'textarea', minRows: 2, maxRows: 4, maxlength: 256, isRule: true},
        // 仓库地址
        { label: 'warWarehouse.address', prop: 'address', span: 24, formType: 'textarea', minRows: 2, maxRows: 4, maxlength: 256, isRule: true},
        // 备注
        { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', minRows: 2, maxRows: 4, maxlength: 256}
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
