
import Utils from 'util';

const PageConfig = {
  formCode: 'warWasteMaterials',
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'wasteMaterials/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'taskSid' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'wasteMaterials/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'wasteMaterials/setDelete',
      params: 'warWasteMaterialsId'
    },
    // info
    infoUrl: {
      url: 'wasteMaterials/getInfo',
      params: 'warWasteMaterialsId'
    },
    // save
    saveUrl: {
      url: 'wasteMaterials/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'wasteMaterials/exportDetail',
      params: 'warWasteMaterialsId'
    }
  },
  // 数据字典
  dictionary: [
    { dicCode: 'handleMethodCode', propCode: 'handleMethodCode' },
    { dicCode: 'meterageMethodCode', propCode: 'meterageMethodCode' },
    { dicCode: 'payMethodType', propCode: 'paymentMethodCode' }
  ],
  // 接口数据
  selectList: [],
  // 主表
  mainFormConfig: {
    formList: [
      // 单据编号
      {
        label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 填写人
      {
        label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 填写日期
      {
        label: 'fConfig.createTime', prop: 'createTime', span: 8, formType: 'date', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 项目名称
      {
        label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'project', key: 'projectId',
        isRelation: true,
        relationList: [
          { receive: 'projectCode', value: 'projectCode' }
        ],
        isRule: true,
        isRelationTable: true,
        relationTable: ['warWasteMaterialsDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 项目编号
      {
        label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 拟处理方式
      {
        label: 'wasteMaterials.handleMethodValue', prop: 'handleMethodCode', span: 8,
        formType: 'dicSelect', selectList: [], isRule: true,
        isRelation: true, relationList: [{ receive: 'handleMethodValue', value: 'dataName' }],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'handleMethodValue'
      },
      // 处理负责人
      {
        label: 'wasteMaterials.handleDutyUserName', prop: 'handleDutyUserName', span: 8, formType: 'userRadio', key: 'handleDutyUserId', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 处置日期
      {
        label: 'wasteMaterials.handleDate', prop: 'handleDate', span: 8, formType: 'date', isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 计量方式
      {
        label: 'wasteMaterials.meterageMethodValue', prop: 'meterageMethodCode', span: 8,
        formType: 'dicSelect', selectList: [], isRule: true,
        isRelation: true, relationList: [{ receive: 'meterageMethodValue', value: 'dataName' }],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'meterageMethodValue'
      },
      // 收购单位
      {
        label: 'wasteMaterials.buyUnitName', prop: 'buyUnitName', span: 8, formType: 'input', isRule: true, maxlength: 64,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 估算后金额
      {
        label: 'wasteMaterials.totalAfterEstimateAmount', prop: 'totalAfterEstimateAmount', span: 8, formType: 'elNumber', min: 0, precision: 2, maxlength: 12, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 最终处置金额
      {
        label: 'wasteMaterials.totalFinalHandleAmount', prop: 'totalFinalHandleAmount', span: 8, formType: 'elNumber', min: 0, precision: 2, maxlength: 12, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 收款金额
      {
        label: 'wasteMaterials.totalCollectionAmount', prop: 'totalCollectionAmount', span: 8, formType: 'elNumber', min: 0, precision: 2, maxlength: 12, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 处理事由
      {
        label: 'wasteMaterials.handleReason', prop: 'handleReason', span: 16, formType: 'input', maxlength: 256, isRule: true,
        printWidth: 16, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 废旧物资名称
      {
        label: 'wasteMaterials.wasteMaterialsName', prop: 'wasteMaterialsName', span: 24, formType: 'input', inputStatus: 'disable',
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 备注
      {
        label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'input', maxlength: 256,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 处置前附件
      { label: 'wasteMaterials.beforeAttachment', prop: 'beforeAttachment', span: 24, formType: 'upload', isRule: true },
      // 处置后附件
      { label: 'wasteMaterials.afterAttachment', prop: 'afterAttachment', span: 24, formType: 'upload', isRule: true },
      // 附件
      { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'details', assignment: 'warWasteMaterialsDetail' },
    { value: 'payments', assignment: 'warWasteMaterialsPayment' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    warWasteMaterialsDetail: {
      subTableName: 'warWasteMaterialsDetail',
      titleTips: 'warWasteMaterialsDetailTips',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'warWasteMaterialsDetail', disabled: false },
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'warWasteMaterialsDetail', disabled: false },
        { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'warWasteMaterialsDetail', disabled: false },
        // 导出明细
        { noAuth: true, code: 'sysHandleExport', subTableCode: 'warWasteMaterialsDetail', name: 'button.export' }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 物资名称
          {
            label: 'wasteMaterials.materialName', prop: 'materialName', formType: 'input', maxlength: 64, minWidth: 160,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 规格
          {
            label: 'fConfig.standards', prop: 'standards', formType: 'input', minWidth: 120, maxlength: 64,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 型号
          {
            label: 'fConfig.models', prop: 'models', formType: 'input', minWidth: 100, maxlength: 64,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 品牌
          {
            label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 100, maxlength: 64,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 单位
          {
            label: 'fConfig.unit', prop: 'unit', formType: 'input', minWidth: 80, maxlength: 32,
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  处置数量
          {
            label: 'wasteMaterials.handleQuantity', prop: 'handleQuantity', formType: 'number', operateData: true, precision: 4, min: 0, maxlength: 12, minWidth: 100,
            printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  原采购单价
          {
            label: 'wasteMaterials.originPurchaseUnitPrice', prop: 'originPurchaseUnitPrice', formType: 'number',
            operateData: true, precision: 2, min: 0, maxlength: 17, minWidth: 120,
            printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
          },
          //  预计处置单价
          {
            label: 'wasteMaterials.estimateHandleUnitPrice', prop: 'estimateHandleUnitPrice', formType: 'number',
            operateData: true, precision: 2, min: 0, maxlength: 17, minWidth: 120,
            printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
          },
          //  估算后单价
          {
            label: 'wasteMaterials.afterEstimateUnitPrice', prop: 'afterEstimateUnitPrice', formType: 'number',
            operateData: true, precision: 2, min: 0, maxlength: 17, minWidth: 120,
            printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
          },
          //  最终处置单价
          {
            label: 'wasteMaterials.finalHandleUnitPrice', prop: 'finalHandleUnitPrice', formType: 'number',
            operateData: true, precision: 2, min: 0, maxlength: 17, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  最终处置金额
          {
            label: 'wasteMaterials.finalHandleAmount', prop: 'finalHandleAmount', formType: 'number',
            operateData: true, precision: 2, min: 0, maxlength: 17, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 备注
          {
            label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          }
        ],
        // 校验
        rules: {
          materialName: [
            { required: true, trigger: 'blur' }
          ],
          standards: [
            { required: true, trigger: 'blur' }
          ],
          unit: [
            { required: true, trigger: 'blur' }
          ],
          finalHandleUnitPrice: [
            { required: true, trigger: 'blur' }
          ],
          finalHandleAmount: [
            { required: true, trigger: 'blur' }
          ]
        },
        // 初始化行数据
        tableDataRow: {
            createTime: Utils.commonUtil.formatTime(new Date()),
            afterEstimateAmount: '',
            afterEstimateUnitPrice: '',
            brand: '',
            currencyCode: '',
            currencyValue: '',
            estimateHandleAmount: '',
            estimateHandleUnitPrice: '',
            finalHandleAmount: '',
            finalHandleUnitPrice: '',
            handleQuantity: '',
            hashColumn: '',
            materialId: '',
            materialName: '',
            models: '',
            originPurchaseAmount: '',
            originPurchaseUnitPrice: '',
            remarks: '',
            standards: '',
            stock: '',
            taxRate: '',
            unit: '',
            unitPrice: '',
            warehouseId: '',
            warehouseShelvesId: '',
            warehouseShelvesName: '',
            warrantyExpiredDate: ''
        }
      }, // 子表配置
      tableData: [] // 子表数据
    },
    // 明细清单
    warWasteMaterialsPayment: {
      subTableName: 'warWasteMaterialsPayment',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'warWasteMaterialsPayment', disabled: false },
        { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'warWasteMaterialsPayment', disabled: false }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 收款方式
          {
            label: 'wasteMaterials.paymentMethodCode', prop: 'paymentMethodCode', formType: 'dicSelect', selectList: [],
            isRelation: true, relationList: [{ receive: 'paymentMethodValue', value: 'dataName' }],
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0, printValue: 'paymentMethodValue'
          },
          // 收款金额
          {
            label: 'wasteMaterials.paymentAmount', prop: 'paymentAmount', formType: 'number', precision: 2, min: 0, maxlength: 12, operateData: true,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 实际收款日期
          {
            label: 'wasteMaterials.paymentDate', prop: 'paymentDate', formType: 'date',
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 收款账户
          {
            label: 'wasteMaterials.paymentAccount', prop: 'paymentAccount', formType: 'companyAccount',
            relationList: [
              { receive: 'paymentAccount', value: 'fullAccountName' }
            ], key: 'paymentCardNo',
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  收款卡号
          {
            label: 'wasteMaterials.paymentCardNo', prop: 'paymentCardNo', formType: 'input', minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0, inputStatus: 'disable'
          },
          //  经办人(出纳)
          {
            label: 'fConfig.agentUserName', prop: 'agentUserName', formType: 'input', maxlength: 32, minWidth: 120,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  回执单或其他附件
          {
            label: 'fConfig.detailAttachment', prop: 'detailAttachment', formType: 'attachment', inputStatus: 'edit', limit: 5,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 备注
          {
            label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          }
        ],
        // 校验
        rules: {
          paymentMethodCode: [
            { required: true, trigger: 'blur' }
          ],
          paymentAmount: [
            { required: true, trigger: 'blur' }
          ],
          paymentDate: [
            { required: true, trigger: 'blur' }
          ],
          paymentAccount: [
            { required: true, trigger: 'blur' }
          ],
          agentUserName: [
            { required: true, trigger: 'blur' }
          ]
        },
        // 初始化行数据
        tableDataRow: {
          createTime: Utils.commonUtil.formatTime(new Date()),
          agentUserName: '',
          detailAttachment: '',
          paymentAccount: '',
          paymentAmount: '',
          paymentCardNo: '',
          paymentDate: '',
          paymentMethodCode: '',
          paymentMethodValue: '',
          remarks: ''
        }
      }, // 子表配置
      tableData: [] // 子表数据
    }
  }
};
class Page {
  constructor() {
    this.PageConfig = JSON.parse(JSON.stringify(PageConfig));
    this.init();
  }
  init() {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
