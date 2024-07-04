/*
 * @Author: your name
 * @Date: 2020-07-27 10:33:28
 * @LastEditTime: 2020-09-17 15:22:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\demandPlan\masterPlanAdjust\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'masterPlanAdjust/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'masterPlanAdjust/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'masterPlanAdjust/setDelete',
      params: 'masterPlanAdjustId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'masterPlanAdjust/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'masterPlanAdjust/getInfo',
      params: 'masterPlanAdjustId'
    },
    // save
    saveUrl: {
      url: 'masterPlanAdjust/setEdit'
    },
    exportDetail: {
      url: 'masterPlanAdjust/exportDetail',
      params: 'masterPlanAdjustId'
    }
  },
    // 数据字典
    dictionary: [
        {dicCode: 'currencyType', propCode: 'currencyCode'}
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
              isRelation: true, relationList: [{receive: 'projectCode', value: 'projectCode'}], isRule: true, check: true,
              relationTable: ['demandMasterPlanAdjustDetail'], clearRelation: [{prop: 'incomeContractName', clearFun: 'handleClearContractIncome'}],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 收入合同名称
            { label: 'masterPlanAdjust.incomeContractName', prop: 'incomeContractName', span: 8, formType: 'contractIncome',
              key: 'incomeContractId', relationKey: {receive: 'projectId', value: 'projectName'}, inputStatus: 'disable', contractNatureCode: '02',
              isRelation: true,
              relationList: [{receive: 'incomeContractCode', value: 'contractCode'},
              {receive: 'currencyCode', value: 'currencyPropertyType'},
              {receive: 'currencyValue', value: 'currencyPropertyName'},
              {receive: 'partyAUnitName', value: 'partyAUnitName'},
              {receive: 'partyAUnitId', value: 'partyAUnitId'}],
              relationTable: ['demandMasterPlanAdjustDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 收入合同编号
            { label: 'masterPlanAdjust.incomeContractCode', prop: 'incomeContractCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 甲方单位
            { label: 'fConfig.partyA', prop: 'partyAUnitName', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 币种
            {
                label: 'masterPlanAdjust.currencyCode', prop: 'currencyCode', span: 8,
                formType: 'dicSelect', selectList: [],
                isRelation: true, relationList: [{receive: 'currencyValue', value: 'dataName'}],
                printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, inputStatus: 'disable'
            },
            // 预算总金额
            { label: 'masterPlanAdjust.budgetTotalAmount', prop: 'budgetTotalAmount', span: 8, formType: 'elNumber', precision: 2, inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, filterName: 'setMoney'
            },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload'}
        ]
    },
    subTableMatch: [
      {value: 'masterPlanAdjustDetails', assignment: 'demandMasterPlanAdjustDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      demandMasterPlanAdjustDetail: {
          subTableName: 'demandMasterPlanAdjustDetail',
          titleTips: 'demandMasterPlanAdjustDetailTips',
          isSelection: false,
          // 子表按钮
        subTableButton: [
          // 导出明细
          { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'demandMasterPlanAdjustDetail', name: 'button.export', authCode: 'export' },
          // 选择明细
          {noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'demandMasterPlanAdjustDetail', disabled: false}
          ],
          tableList: {
              // 表头配置
              slaveColumns: [
                  // 材料编码
                { label: 'fConfig.varietiesCode', prop: 'varietiesCode', formType: 'text', maxlength: 64, minWidth: 120,
                  printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                },
                // 材料名称
                { label: 'fConfig.varietiesName', prop: 'varietiesName', formType: 'text', maxlength: 32, minWidth: 140,
                  printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                },
                // 规格
                { label: 'fConfig.standards', prop: 'standards', formType: 'text', maxlength: 32, minWidth: 120,
                  printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                },
                // 计量单位
                { label: 'fConfig.unit', prop: 'unit', formType: 'text',
                  printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                },
                //  预算数量
                { label: 'masterPlanAdjust.budgetQuantity', prop: 'budgetQuantity', formType: 'text', filterName: 'number', maxlength: 12, minWidth: 100,
                  printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                },
                // 预算单价
                { label: 'masterPlanAdjust.budgetUnitPrice', prop: 'budgetUnitPrice', formType: 'text',
                  filterName: 'setMoney', precision: 2, maxlength: 12, min: 0, minWidth: 100, operateData: true,
                  printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                },
                // 预算合价
                { label: 'masterPlanAdjust.budgetAmount', prop: 'budgetAmount', formType: 'text', filterName: 'setMoney', minWidth: 120,
                  printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                },
                // 其中变更数量
                { label: 'masterPlanAdjust.changeQuantity', prop: 'changeQuantity', formType: 'number', filterName: 'number', precision: 4, minWidth: 120, operateData: true,
                  printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                },
                // 变更后总数量
                { label: 'masterPlanAdjust.changeAfterQuantity', prop: 'changeAfterQuantity', formType: 'text', filterName: 'number', minWidth: 120,
                  printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                },
                // 变更后单价
                { label: 'masterPlanAdjust.changeAfterUnitPrice', prop: 'changeAfterUnitPrice', formType: 'number', filterName: 'setMoney', min: 0, precision: 2, minWidth: 120, operateData: true,
                  printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                },
                // 变更后合价
                { label: 'masterPlanAdjust.changeAfterAmount', prop: 'changeAfterAmount', formType: 'text', filterName: 'setMoney', minWidth: 120,
                  printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                },
                // 备注
                { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                  printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                },
                // 操作
                {show: true, formType: 'operate', label: 'fConfig.operate', minWidth: '60'}
              ],
              // 校验
              rules: {
                changeQuantity: [
                  { required: true, message: 'masterPlanAdjust.changeQuantityTips', trigger: 'blur' }
                ],
                // budgetUnitPrice: [{ required: true, trigger: 'blur' }],
                changeAfterUnitPrice: [{ required: true, trigger: 'blur' }]
              },
              // 初始化行数据
              tableDataRow: {}
          }, // 子表配置
          tableData: [], // 子表数据
          isRelationTable: true,
          isNaNTableMust: false
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
