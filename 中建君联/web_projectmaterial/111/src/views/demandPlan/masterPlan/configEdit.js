/*
 * @Author: your name
 * @Date: 2020-07-24 15:15:01
 * @LastEditTime: 2023-01-15 11:34:30
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\demandPlan\masterPlan\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  formCode: 'demandMasterPlan',
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'masterPlan/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'taskSid' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'masterPlan/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'masterPlan/setDelete',
      params: 'masterPlanId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'masterPlan/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'masterPlan/getInfo',
      params: 'masterPlanId'
    },
    // save
    saveUrl: {
      url: 'masterPlan/setEdit'
    }
  },
  // 数据字典
  dictionary: [
    { dicCode: 'materialClassifyCode', propCode: 'materialClassifyCode' },
    { dicCode: 'supplySourceCode', propCode: 'supplySourceCode' },
    { dicCode: 'currencyType', propCode: 'currencyCode' },
    { dicCode: 'taxRate', propCode: 'taxRate' }
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
        isRelation: true, relationList: [{ receive: 'projectCode', value: 'projectCode' },
        { receive: 'costControlRuleValue', value: 'costControlRuleValue' },
        { receive: 'costControlRuleCode', value: 'costControlRuleCode' },
        { receive: 'majorCode', value: 'majorCode' },
        { receive: 'majorValue', value: 'majorValue' },
        { receive: 'masterCostControl', value: 'masterCostControl' },
        { receive: 'settlementCostControl', value: 'settlementCostControl' }], isRule: true, check: true,
        relationTable: ['demandMasterPlanDetail'], clearRelation: [{ prop: 'incomeContractName', clearFun: 'handleClearContractIncome' }],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 项目编号
      // {
      //   label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 收入合同名称
      // {
      //   label: 'masterPlan.incomeContractName', prop: 'incomeContractName', span: 8, formType: 'contractIncome',
      //   key: 'incomeContractId', relationKey: { receive: 'projectId', value: 'projectName' }, contractNatureCode: '02',
      //   isRelation: true,
      //   relationList: [{ receive: 'incomeContractCode', value: 'contractCode' },
      //   { receive: 'currencyCode', value: 'currencyPropertyType' },
      //   { receive: 'currencyValue', value: 'currencyPropertyName' },
      //   { receive: 'partyAUnitName', value: 'partyAUnitName' },
      //   { receive: 'partyAUnitId', value: 'partyAUnitId' }],
      //   relationTable: ['demandMasterPlanDetail'],
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 收入合同编号
      // {
      //   label: 'masterPlan.incomeContractCode', prop: 'incomeContractCode', span: 8, formType: 'input', inputStatus: 'disable',
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 甲方单位
      // {
      //   label: 'fConfig.partyA', prop: 'partyAUnitName', span: 8, formType: 'input', inputStatus: 'disable',
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 预算总金额
      {
        label: 'masterPlan.afterBudgetTotalAmount', prop: 'afterBudgetTotalAmount', span: 8, formType: 'elNumber', precision: 2, inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
      },
      // 成控规则
      {
        label: 'fConfig.costControlRuleValue', prop: 'costControlRuleValue', span: 8, formType: 'text', inputStatus: 'disable',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 主表增加字段：策划内容概述(*)、图纸号、图纸附件、主要施工内容、
      // 策划次数(不可编辑，默认按次数自增，审批完成以后显示，第一次策划、第二次策划、……)、物资类别、拟供应来源、专业
      // 策划内容概述(*)
      {
        label: 'masterPlan.schemeContent', prop: 'schemeContent', span: 8, formType: 'input', maxlength: 128, isRule: true,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 图纸号
      {
        label: 'masterPlan.drawingCode', prop: 'drawingCode', span: 8, formType: 'input', maxlength: 128,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 策划次数
      {
        label: 'masterPlan.schemeNum', prop: 'schemeNum', span: 8, formType: 'slot', inputStatus: 'hide',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 物资类别
      {
        label: 'masterPlan.materialClassifyCode', prop: 'materialClassifyCode', span: 8,
        formType: 'dicSelect', selectList: [],
        isRelation: true, relationList: [{ receive: 'materialClassifyValue', value: 'dataName' }],
        otherOperate: true, otherOperateFun: 'changeMaterialClassify',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'materialClassifyValue'
      },
      // 拟供应来源
      {
        label: 'masterPlan.supplySourceCode', prop: 'supplySourceCode', span: 8,
        formType: 'dicSelect', selectList: [], isRule: true,
        isRelation: true, relationList: [{ receive: 'supplySourceValue', value: 'dataName' }],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'supplySourceValue'
      },
      // 专业
      {
        label: 'masterPlan.majorValue', prop: 'majorCode', span: 8, formType: 'select',
        selectList: [],
        isRelation: true, relationList: [{ receive: 'majorValue', value: 'majorValue' }],
        nameCode: 'majorValue', valueCode: 'majorCode',
        otherOperate: true, otherOperateFun: 'changeMajor',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'majorValue'
      },
      // 税率(%)
      {
        label: 'fConfig.taxRate', prop: 'taxRate', span: 8, formType: 'dicSelect', selectList: [],
        otherOperate: true, otherOperateFun: 'changeTaxRate',
        printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0, filterName: 'taxRate'
      },
      // 主要施工内容
      {
        label: 'masterPlan.mainConstructContent', prop: 'mainConstructContent', span: 24, formType: 'textarea', maxlength: 256,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 备注
      {
        label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 图纸附件
      { label: 'masterPlan.drawingAttachment', prop: 'drawingAttachment', span: 24, formType: 'upload' },
      // 附件
      { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
    ]
  },
  subTableMatch: [
    { value: 'masterPlanDetails', assignment: 'demandMasterPlanDetail' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    demandMasterPlanDetail: {
      subTableName: 'demandMasterPlanDetail',
      titleTips: 'demandMasterPlanDetailTips',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        // 获取参考价
        {
          isCustom: true, noAuth: true, icon: 'el-icon-document', name: 'masterPlan.getReferencePrice', code: 'getReferencePrice',
          subTableCode: 'demandMasterPlanDetail', disabled: false, slot: true
        },
        // 演算单价
        {
          isCustom: true, noAuth: true, icon: 'el-icon-document', name: 'masterPlan.calculateUnitPrice', code: 'setCalculateUnitPrice',
          subTableCode: 'demandMasterPlanDetail', disabled: false, slot: true
        },
        // 批量删除
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'demandMasterPlanDetail', disabled: false },
        // 下载模板
        { noAuth: true, code: 'sysHandleDownloadTemplate', subTableCode: 'demandMasterPlanDetail', name: 'button.downloadTemplate', slot: true },
        // 导入明细
        { noAuth: false, authCode: 'importDetail', code: 'sysHandleImport', subTableCode: 'demandMasterPlanDetail', name: 'button.Import', disabled: false, slot: true },
        // 导出明细
        { noAuth: true, code: 'sysHandleExport', subTableCode: 'demandMasterPlanDetail', name: 'button.export' },
        // 添加明细
        { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'demandMasterPlanDetail', disabled: false, slot: true },
        // 选择明细
        { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'demandMasterPlanDetail', disabled: false }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 材料编码
          {
            label: 'fConfig.varietiesCode', prop: 'varietiesCode', formType: 'text', maxlength: 20, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料名称 originVarietiesName（原）
          {
            label: 'fConfig.varietiesName', prop: 'varietiesName', formType: 'changeProp', maxlength: 64, minWidth: 140,
            originProp: 'originVarietiesName', relationKeyIds: ['varietiesId', 'preDetailId'],
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // // 预算规格（原）
          // {
          //   label: 'masterPlan.budgetStandards', prop: 'budgetStandards', formType: 'text', maxlength: 64, minWidth: 160,
          //   printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          // },
          // 规格 => 执行规格
          {
            label: 'masterPlan.standards', prop: 'standards', formType: 'changeProp', maxlength: 64, minWidth: 160,
            originProp: 'budgetStandards', relationKeyIds: ['varietiesId', 'preDetailId'],
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 计量单位
          {
            label: 'fConfig.unit', prop: 'unit', formType: 'slot', minWidth: 100, maxlength: 32,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 税率(%)
          {
            label: 'fConfig.taxRate', prop: 'taxRate', span: 8, formType: 'dicSelect', selectList: [],
            printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0, filterName: 'taxRate', operateData: true
          },
          // 变更后总数量 => 策划数量
          {
            label: 'masterPlan.changeAfterQuantity', prop: 'changeAfterQuantity', operateData: true,
            formType: 'number', precision: 4, maxlength: 17, minWidth: 100, min: 0,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 变更后单价 => 策划单价
          {
            label: 'masterPlan.changeAfterUnitPrice', prop: 'changeAfterUnitPrice', operateData: true,
            formType: 'number', precision: 2, maxlength: 17, filterName: 'setMoney', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 变更后合价 => 策划合价
          {
            label: 'masterPlan.changeAfterAmount', prop: 'changeAfterAmount', operateData: true,
            formType: 'number', precision: 2, maxlength: 17, filterName: 'setMoney', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 预估利润
          {
            label: 'masterPlan.estimateProfitAmount', prop: 'estimateProfitAmount', formType: 'text', precision: 2, maxlength: 17, filterName: 'setMoney', minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // //  预算数量
          // { label: 'masterPlan.budgetQuantity', prop: 'budgetQuantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
          //   printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // // 预算单价
          // { label: 'masterPlan.budgetUnitPrice', prop: 'budgetUnitPrice', formType: 'number', operateData: true, precision: 2, maxlength: 12, minWidth: 120,
          //   printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // // 预算合价
          // { label: 'masterPlan.budgetAmount', prop: 'budgetAmount', formType: 'number', precision: 2, minWidth: 120, operateData: true,
          //   printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // 其中变更数量
          // { label: 'masterPlan.changeQuantity', prop: 'changeQuantity', formType: 'text', filterName: 'number', minWidth: 120,
          //   printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // 中标数量、中标单价、中标合价、成控数量、成控单价、成控合价，不可编辑
          // 中标数量
          {
            label: 'masterPlan.bidQuantity', prop: 'bidQuantity', formType: 'text', operateData: true, precision: 4, maxlength: 17, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 中标单位
          {
              label: 'dialog.bidUnit', prop: 'bidUnit', formType: 'text', maxlength: 32, minWidth: 100,
              printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 中标单价
          {
            label: 'masterPlan.bidUnitPrice', prop: 'bidUnitPrice', formType: 'text', operateData: true, precision: 2, maxlength: 17, filterName: 'setMoney',
            minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 中标合价
          {
            label: 'masterPlan.bidTotalAmount', prop: 'bidTotalAmount', formType: 'text', precision: 2, maxlength: 17, filterName: 'setMoney', minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 成控数量
          {
            label: 'masterPlan.controlQuantity', prop: 'controlQuantity', formType: 'text', operateData: true, precision: 4, maxlength: 17, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 成控单价
          {
            label: 'masterPlan.controlUnitPrice', prop: 'controlUnitPrice', formType: 'text', operateData: true, precision: 2, maxlength: 17, filterName: 'setMoney', minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 成控合价
          {
            label: 'masterPlan.controlTotalAmount', prop: 'controlTotalAmount', formType: 'text', precision: 2, maxlength: 17, filterName: 'setMoney', minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 图纸数量，必填，数值，4位小数；
          {
            label: 'masterPlan.drawingQuantity', prop: 'drawingQuantity', formType: 'number', precision: 4, maxlength: 17, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 损耗率(%)
          {
            label: 'masterPlan.lossRate', prop: 'lossRate', formType: 'number', operateData: true, precision: 2, maxlength: 17, minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 已策划数量
          {
            label: 'fConfig.alreadySchemeQuantity', prop: 'alreadySchemeQuantity', formType: 'text', precision: 4, minWidth: 100, operateData: true, min: 0, maxlength: 9
          },
          // 所属工程量清单、所属工程量清单编号、所属费用科目、所属费用科目编号
          // 所属工程量清单
          {
            label: 'masterPlan.quantitiesName', prop: 'quantitiesName', formType: 'slot', maxlength: 64, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属工程量清单编号
          {
            label: 'masterPlan.quantitiesCode', prop: 'quantitiesCode', formType: 'text', maxlength: 32, minWidth: 140,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属费用科目
          {
            label: 'masterPlan.expenseName', prop: 'expenseName', formType: 'text', maxlength: 64, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属费用科目编号
          {
            label: 'masterPlan.expenseCode', prop: 'expenseCode', formType: 'text', maxlength: 32, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 型号
          {
            label: 'fConfig.models', prop: 'models', formType: 'input', maxlength: 64, minWidth: 140,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 品牌
          {
            label: 'fConfig.brand', prop: 'brand', formType: 'input', maxlength: 64, minWidth: 140,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // '物资类别’、‘拟供应来源、‘专业’.，主表有数据时赋值过来，可修改，拟供应来源必选
          // 物资类别
          {
            label: 'masterPlan.materialClassifyCode', prop: 'materialClassifyCode', minWidth: 120,
            formType: 'dicSelect', selectList: [],
            isRelation: true, relationList: [{ receive: 'materialClassifyValue', value: 'dataName' }],
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'materialClassifyValue'
          },
          // 拟供应来源
          {
            label: 'masterPlan.supplySourceCode', prop: 'supplySourceCode', minWidth: 120,
            formType: 'dicSelect', selectList: [],
            isRelation: true, relationList: [{ receive: 'supplySourceValue', value: 'dataName' }],
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'supplySourceValue'
          },
          // 专业
          {
            label: 'masterPlan.majorValue', prop: 'majorCode', minWidth: 120, formType: 'select',
            selectList: [],
            isRelation: true, relationList: [{ receive: 'majorValue', value: 'majorValue' }],
            nameCode: 'majorValue', valueCode: 'majorCode',
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'majorValue'
          },
          // 备注
          {
            label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 依据、依据单号
          // 依据   数据来源(02目标成本分解,03施工签证)
          {
            label: 'masterPlan.sourceType', prop: 'sourceType', formType: 'dicSelect', filterName: 'otherSelect', selectList: [
              { dataCode: '02', dataName: '目标成本分解' },
              { dataCode: '03', dataName: '施工签证' }
            ], minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0, inputStatus: 'disable'
          },
          // 依据单号
          {
            label: 'masterPlan.preDocNo', prop: 'preDocNo', formType: 'text', minWidth: 140,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          }
        ],
        // 校验
        rules: {
          varietiesName: [{ required: true, trigger: 'blur' }],
          lossRate: [{ required: true, trigger: 'blur' }],
          standards: [{ required: true, trigger: 'blur' }],
          unit: [{ required: true, trigger: 'blur' }],
          supplySourceCode: [{ required: true, trigger: 'change' }],
          changeAfterUnitPrice: [{ required: true, trigger: 'blur' }],
          changeAfterAmount: [{ required: true, trigger: 'blur' }],
          changeAfterQuantity: [{ required: true, trigger: 'blur' }]
        },
        // 初始化行数据
        tableDataRow: {
          createTime: Utils.commonUtil.formatTime(new Date()),
          bidQuantity: '',
          bidTotalAmount: '',
          bidUnitPrice: '',
          brand: '',
          budgetAmount: '',
          budgetQuantity: '',
          budgetStandards: '',
          budgetUnitPrice: '',
          changeAfterAmount: '',
          changeAfterQuantity: '',
          changeAfterUnitPrice: '',
          changeAmount: '',
          changeQuantity: '',
          controlQuantity: '',
          controlTotalAmount: '',
          controlUnitPrice: '',
          drawingQuantity: '',
          estimateProfitAmount: '',
          expenseCode: '',
          expenseName: '',
          lossRate: '',
          majorCode: '',
          majorValue: '',
          masterPlanId: '',
          materialClassifyCode: '',
          materialClassifyValue: '',
          models: '',
          preDetailId: '',
          preDocNo: '',
          preMainId: '',
          quantitiesCode: '',
          quantitiesName: '',
          budgetCode: '',
          remarks: '',
          sourceType: '',
          standards: '',
          supplySourceCode: '',
          supplySourceValue: '',
          unit: '',
          varietiesCode: '',
          varietiesId: '',
          varietiesName: '',
          alreadySchemeQuantity: 0
        }
      }, // 子表配置
      tableData: [] // 子表数据
    }
  },
  // 更新时弹窗显示
  reNewFormConfig: {
    formList: [
      {
        label: 'masterPlan.updateReason', prop: 'updateReason', span: 24, formType: 'textarea', maxlength: 256,
        minRows: '4', maxRows: '8', isRule: true,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      }
    ]
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
