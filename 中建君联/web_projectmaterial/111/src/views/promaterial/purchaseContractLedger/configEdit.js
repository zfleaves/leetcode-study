/*
 * @Author: your name
 * @Date: 2020-07-22 14:05:27
 * @LastEditTime: 2021-06-22 17:37:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_contract-合同管理\src\views\contractExpend\purchaseContractLedger\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    // 流程
    processParmas: {
      // info
      infoUrl: {
        url: 'purchaseContractLedger/getInfo',
        params: 'expendRegisterId'
      },
      exportDetail: {
        url: 'purchaseContractLedger/exportDetail',
        params: 'expendRegisterId'
      }
    },
    // 数据字典
    dictionary: [
        {dicCode: 'qualityDepositScale', propCode: 'qualityDepositScale'},
        {dicCode: 'taxRate', propCode: 'taxRate'}
    ],
    // 接口数据
    selectList: [],
    // 主表
    mainFormConfig: {
        formList: [
            // 项目名称
            { label: 'dialog.projectName', prop: 'proProjectInfoDtos', span: 8, formType: 'multipleProject', isCheckbox: true, nameCode: 'projectName'},
            // 填写人
            { label: 'fConfig.createByName', prop: 'createByName', span: 8, formType: 'input', inputStatus: 'disable'},
            // 填写日期
            { label: 'fConfig.createTime', prop: 'createTime', span: 8, formType: 'date', inputStatus: 'disable'},
            // 中标通知书编号
            { label: 'purchaseContractLedger.bidNoticeNo', prop: 'bidNoticeNo', span: 8, formType: 'input', maxlength: 32},
            // 乙方单位
            { label: 'dialog.partyB', prop: 'partyBUnitName', span: 8, formType: 'input', maxlength: 64, isRule: true},
            // 币种
            {
                label: 'dialog.currencyValue', prop: 'currencyValue', span: 8, formType: 'input', isRule: true
            },
            // 合同名称
            { label: 'dialog.contractName', prop: 'contractName', span: 8, formType: 'input', maxlength: 64, isRule: true},
            // 合同编号
            { label: 'dialog.contractCode', prop: 'contractCode', span: 8, formType: 'input', maxlength: 32, inputStatus: 'disable'},
            // 合同类型
            {
                label: 'dialog.contractClassifyName', prop: 'contractClassifyName', span: 8, formType: 'input', isRule: true
            },
            // 合同性质
            {
                label: 'dialog.contractNatureValue', prop: 'contractNatureName', span: 8, formType: 'input', isRule: true
            },
            // 签订人
            { label: 'dialog.partyASignName', prop: 'signUserName', span: 8, formType: 'input', isRule: true, maxlength: 32},
            // 签订日期
            { label: 'dialog.signTime', prop: 'signTime', span: 8, formType: 'date', isRule: true},
            // 签订金额
            { label: 'dialog.signAmount', prop: 'signAmount', span: 8, formType: 'elNumber', maxlength: 12, precision: 2, min: 0, isRule: true, filterName: 'setMoney'},
            // 代理人
            { label: 'purchaseContractLedger.agentUserName', prop: 'agentUserName', span: 8, formType: 'input', maxlength: 32, isRule: true},
            // 代理人电话
            { label: 'purchaseContractLedger.agentUserMobile', prop: 'agentUserMobile', span: 8, formType: 'input', maxlength: 32, isRule: true},
            // 计价方式
            {
                label: 'purchaseContractLedger.valuationValue', prop: 'valuationValue', span: 8, formType: 'input'
            },
            // 计税方式
            {
                label: 'purchaseContractLedger.taxationValue', prop: 'taxationValue', span: 8, formType: 'input'
            },
            // 发票类型
            {
                label: 'purchaseContractLedger.invoiceValue', prop: 'invoiceValue', span: 8, formType: 'input'
            },
            // 税率%
            { label: 'purchaseContractLedger.taxRate', prop: 'taxRate', span: 8, formType: 'dicSelect', isRule: true},
            // 质保金比例%
            { label: 'purchaseContractLedger.qualityDepositScale', prop: 'qualityDepositScale', span: 8, formType: 'dicSelect', isRule: true},
            // 质保金金额
            { label: 'purchaseContractLedger.qualityDepositAmount', prop: 'qualityDepositAmount', span: 8, formType: 'elNumber',
            maxlength: 12, precision: 2, min: 0, isRule: true, filterName: 'setMoney'},
            // 质保期
            { label: 'purchaseContractLedger.warrantyPeriod', prop: 'warrantyPeriod', span: 8, formType: 'input', maxlength: 32, isRule: false},
            // 付款条款
            { label: 'purchaseContractLedger.paymentProvision', prop: 'paymentProvision', span: 16, formType: 'input', maxlength: 255, minRows: 2, maxRows: 5},
            // 质量及性能要求
            { label: 'purchaseContractLedger.qualityRequirement', prop: 'qualityRequirement', span: 24, formType: 'input', maxlength: 128},
            // 核心章节扫描件
            { label: 'purchaseContractLedger.attachment', prop: 'attachment', span: 24, formType: 'upload'}
        ]
    },
    subTableMatch: [
        {value: 'registerDetails', assignment: 'purchaseContractLedgerDetail'}
    ],
    // 子表
    subTableConfig: {
        // 评标明细情况
        purchaseContractLedgerDetail: {
            subTableName: 'purchaseContractLedgerDetail',
            // 子表按钮
            subTableButton: [
                {noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'purchaseContractLedgerDetail', disabled: false},
                //  // 导出明细
                // { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'purchaseContractLedgerDetail', name: 'button.export', authCode: 'export' },
                { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'purchaseContractLedgerDetail', disabled: false } // 添加明细
            ],
            tableList: {
                // 表头配置 - 材料采购合同 CLHT
                slaveColumns: [
                    // 材料名称
                    { label: 'fConfig.materialName', prop: 'itemName', formType: 'input', maxlength: 64,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 规格
                    { label: 'fConfig.standards', prop: 'standards', formType: 'input', maxlength: 64, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 型号
                    { label: 'fConfig.models', prop: 'models', formType: 'input', maxlength: 32,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 单位
                    { label: 'fConfig.unit', prop: 'unit', formType: 'input', minWidth: 80, maxlength: 32,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 品牌
                    { label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 120, maxlength: 64,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    //  签订数量
                    { label: 'purchaseContractLedger.quantity', prop: 'quantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 签订单价
                    { label: 'purchaseContractLedger.unitPrice', prop: 'unitPrice', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 金额
                    { label: 'fConfig.amount', prop: 'amount', formType: 'text', filterName: 'setMoney', precision: 2, minWidth: 120, operateData: true,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 约定交货日期
                    { label: 'purchaseContractLedger.buildDate', prop: 'buildDate', formType: 'date', maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 备注
                    { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                    }
                ],
                CLHT: [
                    // 材料名称
                    { label: 'fConfig.materialName', prop: 'itemName', formType: 'input', maxlength: 64,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 规格
                    { label: 'fConfig.standards', prop: 'standards', formType: 'input', maxlength: 64, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 型号
                    { label: 'fConfig.models', prop: 'models', formType: 'input', maxlength: 32,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 单位
                    { label: 'fConfig.unit', prop: 'unit', formType: 'input', minWidth: 80, maxlength: 32,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 品牌
                    { label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 120, maxlength: 64,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    //  签订数量
                    { label: 'purchaseContractLedger.quantity', prop: 'quantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 签订单价
                    { label: 'purchaseContractLedger.unitPrice', prop: 'unitPrice', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 金额
                    { label: 'fConfig.amount', prop: 'amount', formType: 'text', filterName: 'setMoney', precision: 2, minWidth: 120, operateData: true,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 约定交货日期
                    { label: 'purchaseContractLedger.buildDate', prop: 'buildDate', formType: 'date', maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 备注
                    { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                    }
                ],
                // 租赁合同 ZLHT
                ZLHT: [
                    // 机械名称
                    { label: 'purchaseContractLedger.ZLitemName', prop: 'itemName', formType: 'input', maxlength: 64,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 规格
                    { label: 'fConfig.standards', prop: 'standards', formType: 'input', maxlength: 64, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 型号
                    { label: 'fConfig.models', prop: 'models', formType: 'input', maxlength: 32,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 单位
                    { label: 'fConfig.unit', prop: 'unit', formType: 'input', minWidth: 80, maxlength: 32,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 品牌
                    { label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 120, maxlength: 64,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    //  拟租赁数量
                    { label: 'purchaseContractLedger.ZLquantity', prop: 'quantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 拟租赁时长
                    { label: 'purchaseContractLedger.leaseDuration', prop: 'leaseDuration', formType: 'input', minWidth: 120, maxlength: 64,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 租赁单价
                    { label: 'purchaseContractLedger.ZLunitPrice', prop: 'unitPrice', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 金额
                    { label: 'fConfig.amount', prop: 'amount', formType: 'text', filterName: 'setMoney', precision: 2, minWidth: 120, operateData: true,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 拟定进场日期
                    { label: 'purchaseContractLedger.ZLbuildDate', prop: 'buildDate', formType: 'date', maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 备注
                    { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                    }
                ],
                // 劳务合同 LWHT
                LWHT: [
                    // 分包项
                    { label: 'purchaseContractLedger.LWitemName', prop: 'itemName', formType: 'input', maxlength: 64,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 特征描述
                    { label: 'purchaseContractLedger.featuresDescription', prop: 'featuresDescription', formType: 'input', maxlength: 128,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 工作内容
                    { label: 'purchaseContractLedger.detailContent', prop: 'detailContent', formType: 'input', maxlength: 32,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 单位
                    { label: 'fConfig.unit', prop: 'unit', formType: 'input', minWidth: 80, maxlength: 32,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    //  数量
                    { label: 'fConfig.quantity', prop: 'quantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 单价
                    { label: 'fConfig.price', prop: 'unitPrice', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 金额
                    { label: 'fConfig.amount', prop: 'amount', formType: 'text', filterName: 'setMoney', precision: 2, minWidth: 120, operateData: true,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 拟进场日期
                    { label: 'purchaseContractLedger.ZLbuildDate', prop: 'buildDate', formType: 'date', maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 备注
                    { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                    }
                ],
                // 专业分包合同 ZYFBHT
                ZYFBHT: [
                    // 分包项
                    { label: 'purchaseContractLedger.LWitemName', prop: 'itemName', formType: 'input', maxlength: 64,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 特征描述
                    { label: 'purchaseContractLedger.featuresDescription', prop: 'featuresDescription', formType: 'input', maxlength: 128,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 工作内容
                    { label: 'purchaseContractLedger.detailContent', prop: 'detailContent', formType: 'input', maxlength: 32,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 单位
                    { label: 'fConfig.unit', prop: 'unit', formType: 'input', minWidth: 80, maxlength: 32,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    //  数量
                    { label: 'fConfig.quantity', prop: 'quantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 单价
                    { label: 'fConfig.price', prop: 'unitPrice', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 金额
                    { label: 'fConfig.amount', prop: 'amount', formType: 'text', filterName: 'setMoney', precision: 2, minWidth: 120, operateData: true,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 拟开工日期
                    { label: 'purchaseContractLedger.ZYbuildDate', prop: 'buildDate', formType: 'date', maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 备注
                    { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                    }
                ],
                // 其它 QTHT
                QTHT: [
                    // 明细名称
                    { label: 'purchaseContractLedger.QTitemName', prop: 'itemName', formType: 'input', maxlength: 64,
                        printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 特征描述
                    { label: 'purchaseContractLedger.featuresDescription', prop: 'featuresDescription', formType: 'input', maxlength: 128,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 详细内容
                    { label: 'purchaseContractLedger.QTdetailContent', prop: 'detailContent', formType: 'input', maxlength: 32,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 单位
                    { label: 'fConfig.unit', prop: 'unit', formType: 'input', minWidth: 80, maxlength: 32,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 品牌
                    { label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 120, maxlength: 64,
                        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    //  签订数量
                    { label: 'purchaseContractLedger.quantity', prop: 'quantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 签订单价
                    { label: 'purchaseContractLedger.unitPrice', prop: 'unitPrice', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 120,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 金额
                    { label: 'fConfig.amount', prop: 'amount', formType: 'text', filterName: 'setMoney', precision: 2, minWidth: 120, operateData: true,
                        printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                    },
                    // 备注
                    { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                        printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                    }
                ],
                // 校验
                rules: {
                    itemName: [{ required: true, message: '', trigger: 'blur' }],
                    standards: [{ required: true, message: '', trigger: 'blur' }],
                    model: [{ required: true, message: '', trigger: 'blur' }],
                    unit: [{ required: true, message: '', trigger: 'blur' }],
                    quantity: [{ required: true, message: '', trigger: 'blur' }],
                    unitPrice: [{ required: true, message: '', trigger: 'blur' }],
                    buildDate: [{ required: true, message: '', trigger: 'blur' }],
                    featuresDescription: [{ required: true, message: '', trigger: 'blur' }],
                    etailContent: [{ required: true, message: '', trigger: 'blur' }]
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
