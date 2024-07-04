/*
 * @Author: your name
 * @Date: 2020-07-24 15:25:01
 * @LastEditTime: 2022-12-02 15:35:12
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\demandPlan\weekPlan\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'weekPlan/getWorkflowNextNode',
      parmasList: [
        { receive: 'sid', value: 'taskSid' },
        { receive: 'projectId', value: 'projectId' }
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'weekPlan/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'weekPlan/setDelete',
      params: 'weekPlanId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'weekPlan/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'weekPlan/getInfo',
      params: 'weekPlanId'
    },
    // save
    saveUrl: {
      url: 'weekPlan/setEdit'
    },
    exportDetail: {
      url: 'weekPlan/exportDetail',
      params: 'weekPlanId'
    }
  },
  // 数据字典
  dictionary: [
    {dicCode: 'materialClassifyCode', propCode: 'materialClassifyCode'},
    {dicCode: 'supplySourceCode', propCode: 'supplySourceCode'},
    { dicCode: 'currencyType', propCode: 'currencyCode' },
    { dicCode: 'demandType', propCode: 'demandType' }
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
        relationList: [{ receive: 'projectCode', value: 'projectCode' },
        { receive: 'partyAUnitId', value: 'partyAUnitId' },
        { receive: 'partyAUnitName', value: 'partyAUnitName' },
        { receive: 'usePlaceName', value: 'usePlaceName' },
        { receive: 'usePlaceId', value: 'usePlaceId' },
        { receive: 'costControlRuleValue', value: 'costControlRuleValue' },
        { receive: 'costControlRuleCode', value: 'costControlRuleCode' },
        { receive: 'masterCostControl', value: 'masterCostControl' }],
        isRule: true, check: true,
        relationTable: ['demandWeekPlanDetail'],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 项目编号
      // {
      //   label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 甲方单位
      // {
      //   label: 'fConfig.partyA', prop: 'partyAUnitName', span: 8, formType: 'input', inputStatus: 'disable',
      //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      // },
      // 填报周期
      {
        label: 'weekPlan.applyWeek', prop: 'applyDate', span: 8, formType: 'week', check: true, isRule: true, filterName: 'week',
        relationTable: ['demandWeekPlanDetail'], isRelation: true, isRelationTable: true, clearable: false,
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 需用日期
      {
        label: 'weekPlan.requiredDate', prop: 'requiredDate', span: 8, formType: 'date',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0,
        otherOperate: true, otherOperateFun: 'handleSetRequiredDateUsePlace'
      },
      // 申请班组 => 申报料单位
      {
        label: 'fConfig.applicant', prop: 'projectUnitId', span: 8, formType: 'slot',
        isRelation: true, relationList: [
          {receive: 'projectUnitName', value: 'name'},
          {receive: 'expendContractName', value: 'expendContractName'},
          {receive: 'expendContractId', value: 'expendContractId'},
          {receive: 'expendContractCode', value: 'expendContractCode'}
        ],
        nameCode: 'name', valueCode: 'id',
        printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0, pintIdName: 'projectUnitName'
        // otherOperate: true, otherOperateFun: 'projectUnitIdFun'
      },
      // 对应分包合同
      {
        label: 'fConfig.correspondingSubcontract', prop: 'expendContractName', span: 8, key: 'expendContractId',
        formType: 'slot', selectList: [],
        isRelation: true, relationList: [
          {receive: 'expendContractCode', value: 'contractCode'}
        ],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 所属成本结构
      {
        label: 'fConfig.costStructure', prop: 'usePlaceName', formType: 'usePlace', span: 8, key: 'usePlaceId',
        relationKey: { receive: 'projectId', value: 'projectName' },
        isRelation: true,
        relationList: [
          { receive: 'usePlaceCode', value: 'projectDetailCode' }
        ],
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0,
        otherOperate: true, otherOperateFun: 'handleSetRequiredDateUsePlace'
      },
      // 专业
      {
        label: 'fConfig.majorValue', prop: 'majorCode', span: 8, formType: 'select',
        selectList: [],
        isRelation: true, relationList: [{receive: 'majorValue', value: 'majorValue'}],
        nameCode: 'majorValue', valueCode: 'majorCode',
        otherOperate: true, otherOperateFun: 'changeMajor',
        printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'majorValue'
      },

      // 主要报量明细
      { label: 'fConfig.mainDemandDetailNew', prop: 'mainDemandDetail', span: 16, formType: 'input', placeholder: 'tips.mainDemandDetailTips' },
      // 申请原因(备注)
      {
        label: 'weekPlan.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
        printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
      },
      // 附件
      { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload' }
    ],
    oldRelationList: []
  },
  subTableMatch: [
    { value: 'weekPlanDetails', assignment: 'demandWeekPlanDetail' }
  ],
  // 子表
  subTableConfig: {
    // 明细清单
    demandWeekPlanDetail: {
      subTableName: 'demandWeekPlanDetail',
      titleTips: 'demandWeekPlanDetailTips',
      isSelection: true,
      // 子表按钮
      subTableButton: [
        // 添加明细
        { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'demandWeekPlanDetail', disabled: false, slot: true },
        // 删除明细
        { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'demandWeekPlanDetail', disabled: false },
         // 下载模板
        {noAuth: true, code: 'sysHandleDownloadTemplate', subTableCode: 'demandWeekPlanDetail', name: 'button.downloadTemplate'},
        // 导入明细
        {noAuth: false, authCode: 'importDetail', code: 'sysHandleImport', subTableCode: 'demandWeekPlanDetail', name: 'button.Import', disabled: false, slot: true},
        // 导出明细
        { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'demandWeekPlanDetail', name: 'button.export', authCode: 'export' },
        // 选择明细
        { noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'demandWeekPlanDetail', disabled: false }
      ],
      tableList: {
        // 表头配置
        slaveColumns: [
          // 策划类型
          {
            label: 'fConfig.demandTypeNew', prop: 'demandType', formType: 'dicSelect', inputStatus: 'disable',
            selectList: [], minWidth: 100,
            printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
          },
          // 材料编码
          {
            label: 'fConfig.varietiesCode', prop: 'varietiesCode', formType: 'text', maxlength: 64, minWidth: 120,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 材料名称
          {
            label: 'fConfig.varietiesName', prop: 'executeVarietiesName', formType: 'changeProp', maxlength: 64, minWidth: 140, inputStatus: 'disable',
            originProp: 'varietiesName', addPropId: 'varietiesId', relationKeyIds: ['varietiesId'],
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 规格
          {
            label: 'fConfig.standards', prop: 'executeStandards', formType: 'changeProp', maxlength: 64, minWidth: 160, inputStatus: 'disable',
             originProp: 'standards', addPropId: 'varietiesId', relationKeyIds: ['varietiesId'],
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 计量单位
          {
            label: 'fConfig.unit', prop: 'executeUnit', formType: 'changeProp', maxlength: 32, minWidth: 100, inputStatus: 'disable',
            originProp: 'unit', addPropId: 'varietiesId', relationKeyIds: ['varietiesId'],
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 型号
          {
            label: 'fConfig.models', prop: 'models', formType: 'input', maxlength: 32,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 品牌
          {
            label: 'fConfig.brand', prop: 'brand', formType: 'input', maxlength: 32,
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  预算数量
          {
            label: 'weekPlan.budgetQuantity', prop: 'budgetQuantity', formType: 'text', filterName: 'number', minWidth: 80,
            printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  已申请数量
          {
            label: 'weekPlan.alreadyApplyQuantity', prop: 'alreadyApplyQuantity', formType: 'text', filterName: 'number', minWidth: 100,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  本次申请数量
          {
            label: 'weekPlan.currentApplyQuantity', prop: 'currentApplyQuantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          //  需用日期
          {
            label: 'weekPlan.requiredDate', prop: 'requiredDate', formType: 'date', minWidth: 120,
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // // 拟使用部位
          // {
          //   label: 'weekPlan.usePlaceName', prop: 'usePlaceName', formType: 'slot', key: 'usePlaceId', minWidth: 120,
          //   printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // // 物资类别
          // {
          //   label: 'fConfig.materialClassifyValue', prop: 'materialClassifyValue', formType: 'text', minWidth: 100,
          //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // // 拟供应来源
          // {
          //   label: 'fConfig.supplySourceValue', prop: 'supplySourceValue', formType: 'text', minWidth: 100,
          //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // // 专业
          // {
          //   label: 'fConfig.majorValue', prop: 'majorValue', formType: 'text', minWidth: 100,
          //   printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          // },
          // 所属工程量名称（执行策划管控时显示）
          {
            label: 'fConfig.quantitiesName', prop: 'quantitiesName', formType: 'slot', minWidth: 120, inputStatus: 'edit', key: 'quantitiesCode',
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属工程量编号（执行策划管控时显示）
          {
            label: 'fConfig.quantitiesCode', prop: 'quantitiesCode', formType: 'text', minWidth: 140, inputStatus: 'edit',
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属费用科目 (费用类型管控时显示)
          {
            label: 'fConfig.expenseName', prop: 'expenseName', formType: 'slot', maxlength: 64, minWidth: 120, inputStatus: 'hide',
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 所属费用科目编号 (费用类型管控时显示)
          {
            label: 'fConfig.expenseCode', prop: 'expenseCode', formType: 'text', maxlength: 32, minWidth: 140, inputStatus: 'hide',
            printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 物资类别
          {
            label: 'fConfig.materialClassifyValue', prop: 'materialClassifyCode', minWidth: 120,
            formType: 'slot', selectList: [],
            isRelation: true, relationList: [{receive: 'materialClassifyValue', value: 'dataName'}],
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'materialClassifyValue'
          },
          // 拟供应来源
          {
            label: 'fConfig.supplySourceValue', prop: 'supplySourceCode', minWidth: 120,
            formType: 'slot', selectList: [],
            isRelation: true, relationList: [{receive: 'supplySourceValue', value: 'dataName'}],
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'supplySourceValue'
          },
          // 专业
          {
            label: 'fConfig.majorValue', prop: 'majorCode', minWidth: 120, formType: 'select',
            selectList: [],
            isRelation: true, relationList: [{receive: 'majorValue', value: 'majorValue'}],
            nameCode: 'majorValue', valueCode: 'majorCode',
            printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'majorValue'
          },
          // 所属进度工序
          {
              label: 'fConfig.progressProcess', prop: 'taskName', formType: 'slot', minWidth: 120,
              printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
          },
          // 型号/质量/性能/品牌等要求备注
          {
            label: 'weekPlan.subTableRemarks', prop: 'remarks', formType: 'input', maxlength: 255, minWidth: 230,
            printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
          }
        ],
        // 校验
        rules: {
          executeVarietiesName: [{ required: true, trigger: 'blur' }],
          executeStandards: [{ required: true, trigger: 'blur' }],
          executeUnit: [{ required: true, trigger: 'blur' }],
          supplySourceCode: [{ required: true, trigger: 'change' }]
        },
        // 初始化行数据
        tableDataRow: {
          createTime: Utils.commonUtil.formatTime(new Date()),
          alreadyApplyQuantity: 0,
          bidQuantity: '',
          bidTotalAmount: '',
          bidUnitPrice: '',
          brand: '',
          budgetCode: '',
          budgetQuantity: '',
          budgetTotalAmount: '',
          budgetUnitPrice: '',
          controlQuantity: '',
          controlTotalAmount: '',
          controlUnitPrice: '',
          currentApplyQuantity: '',
          demandType: '02',
          eId: '',
          executeStandards: '',
          executeUnit: '',
          executeVarietiesName: '',
          expenseCode: '',
          expenseName: '',
          majorCode: '',
          majorValue: '',
          masterPlanDocNo: '',
          masterPlanId: '',
          materialClassifyCode: '',
          materialClassifyValue: '',
          models: '',
          projectUnitId: '',
          projectUnitName: '',
          quantitiesCode: '',
          quantitiesName: '',
          remarks: '',
          requiredDate: '',
          supplySourceCode: '',
          supplySourceValue: '',
          usePlaceId: '',
          usePlaceName: '',
          varietiesId: ''
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
