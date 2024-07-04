/*
 * @Author: your name
 * @Date: 2020-07-30 10:34:13
 * @LastEditTime: 2021-05-18 09:47:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\supplyOrderA\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'supplyOrderA/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'supplyOrderA/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'supplyOrder/setDelete',
      params: 'supplyOrderId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'supplyOrder/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'supplyOrder/getInfo',
      params: 'supplyOrderId'
    },
    // save
    saveUrl: {
      url: 'supplyOrder/setEdit'
    },
    // 导出明细
    exportDetail: {
      url: 'supplyOrder/exportDetail',
      params: 'supplyOrderId'
    }
  },
    // 数据字典
    dictionary: [
      {dicCode: 'purchaseMethod', propCode: 'purchaseMethodCode'},
      {dicCode: 'invoiceType', propCode: 'invoiceCode'},
      {dicCode: 'currencyType', propCode: 'currencyCode'},
      {dicCode: 'taxRate', propCode: 'taxRate'},
      {dicCode: 'orderType', propCode: 'orderTypeCode'}
    ],
    // 接口数据
    selectList: [],
    // 主表
    mainFormConfig: {
        formList: [
            // 单据编号
            { label: 'fConfig.docNo', prop: 'docNo', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 填写人
            { label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 填写日期
            { label: 'fConfig.createTime', prop: 'createTime', span: 8, formType: 'date', inputStatus: 'disable', placeholder: 'tips.automaticGeneration',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目名称
            { label: 'fConfig.projectName', prop: 'projectName', span: 8, formType: 'project', key: 'projectId',
              isRelation: true,
              relationList: [
                {receive: 'projectCode', value: 'projectCode'},
                { receive: 'address', value: 'address' },
                {receive: 'areas', value: 'areas'},
                {areaCode: true, receive: 'areas'}
              ],
              isRule: true,
              relationTable: ['purchaseSupplyPartyAOrderDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 订单名称
            { label: 'supplyOrderA.orderName', prop: 'orderName', span: 8, formType: 'input', maxlength: 64,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 下达人
            { label: 'supplyOrderA.releaseUserName', prop: 'releaseUserName', span: 8, formType: 'userRadio', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, key: 'releaseUserId'
            },
            // 下达日期
            { label: 'supplyOrderA.releaseDate', prop: 'releaseDate', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 供应商名称
            {
              label: 'supplyOrderA.supplierName', prop: 'supplierName', span: 8, formType: 'partyB', key: 'supplierId', isRule: true,
              isRelation: true, relationList: [{receive: 'contactName', value: 'contactName'}, {receive: 'contactMobile', value: 'contactMobile'}],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 业务联系人
            { label: 'supplyOrderA.contactName', prop: 'contactName', span: 8, formType: 'input', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 业务联系人手机号码
            { label: 'supplyOrderA.contactMobile', prop: 'contactMobile', span: 8, formType: 'input', maxlength: 32,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 约定到货日期
            { label: 'supplyOrderA.arrivalDate', prop: 'arrivalDate', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 收货地址
            {
              label: 'supplyOrderA.areas', prop: 'areas', span: 8, formType: 'area',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 详细地址
            {
              label: 'supplyOrderA.address', prop: 'address', span: 8, formType: 'input', maxlength: 256,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 主要供货明细
            { label: 'supplyOrderA.mainSupplyDetail', prop: 'mainSupplyDetail', span: 8, formType: 'input', inputStatus: 'disable', placeholder: 'tips.mainDemandDetailTips' },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload'}
        ],
        oldRelationList: []
    },
    subTableMatch: [
      {value: 'supplyOrderDetails', assignment: 'purchaseSupplyPartyAOrderDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      purchaseSupplyPartyAOrderDetail: {
        subTableName: 'purchaseSupplyPartyAOrderDetail',
          titleTips: 'purchaseSupplyOrderDetailTips',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'purchaseSupplyPartyAOrderDetail', disabled: false },
             // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'purchaseSupplyPartyAOrderDetail', name: 'button.export', authCode: 'export' },
            { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'purchaseSupplyPartyAOrderDetail', disabled: false }
          ],
          tableList: {
              // 表头配置
              slaveColumns: [
                  // 需求计划单号
                  { label: 'supplyOrderA.demandPlanCode', prop: 'demandPlanCode', formType: 'text', maxlength: 64, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 材料编码
                  { label: 'fConfig.varietiesCode', prop: 'varietiesCode', formType: 'text', maxlength: 64, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 材料名称
                  { label: 'fConfig.varietiesName', prop: 'varietiesName', formType: 'text', maxlength: 32, minWidth: 120,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 规格
                  { label: 'fConfig.standards', prop: 'standards', formType: 'text', maxlength: 32, minWidth: 80,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 计量单位
                  { label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 50,
                    printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 型号
                  { label: 'fConfig.models', prop: 'models', formType: 'input', minWidth: 100, maxlength: 64,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 品牌
                  { label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 80, maxlength: 128,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 需求类型
                  { label: 'supplyOrderA.demandPlanTypeValue', prop: 'demandPlanTypeValue', formType: 'text', maxlength: 32, minWidth: 100,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  需求数量
                  { label: 'supplyOrderA.demandPlanQuantity', prop: 'demandPlanQuantity', formType: 'text', filterName: 'number', minWidth: 100,
                    printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  需求日期
                  { label: 'supplyOrderA.requiredDate', prop: 'requiredDate', formType: 'text', filterName: 'date', minWidth: 120,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 拟使用部位
                  { label: 'supplyOrderA.usePlaceName', prop: 'usePlaceName', formType: 'text',
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 要求备注
                  { label: 'supplyOrderA.subTableRemarks', prop: 'remarks', formType: 'text', maxlength: 255,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  已申请供货数量
                  { label: 'supplyOrderA.alreadyApplyQuantity', prop: 'alreadyApplyQuantity', formType: 'text', filterName: 'number', minWidth: 120,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  本次申请数量
                  { label: 'supplyOrderA.currentApplyQuantity', prop: 'currentApplyQuantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 供货备注
                  { label: 'supplyOrderA.supplyRemarks', prop: 'supplyRemarks', formType: 'input', minWidth: 120, maxlength: 255,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  }
              ],
              // 校验
              rules: {
                unitPrice: [
                  { required: true, message: 'supplyOrderA.unitPriceTips', trigger: 'blur' }
                ]
              },
              // 初始化行数据
              tableDataRow: {}
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
  init () {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
