/*
 * @Author: your name
 * @Date: 2020-07-24 15:17:14
 * @LastEditTime: 2022-01-10 14:48:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\demandPlan\quarterPlan\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  applyQuarterList: [],
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'quarterPlan/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'quarterPlan/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'quarterPlan/setDelete',
      params: 'quarterPlanId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'quarterPlan/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'quarterPlan/getInfo',
      params: 'quarterPlanId'
    },
    // save
    saveUrl: {
      url: 'quarterPlan/setEdit'
    },
    exportDetail: {
      url: 'quarterPlan/exportDetail',
      params: 'quarterPlanId'
    }
  },
    // 数据字典
    dictionary: [
        {dicCode: 'currencyType', propCode: 'currencyCode'},
        {dicCode: 'seasonStatus', propCode: 'applyQuarter'}
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
              relationList: [{receive: 'projectCode', value: 'projectCode'},
                              { receive: 'partyAUnitId', value: 'partyAUnitId' },
                              {receive: 'partyAUnitName', value: 'partyAUnitName'}],
              isRule: true, check: true,
              relationTable: ['demandQuarterPlanDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 甲方单位
            { label: 'fConfig.partyA', prop: 'partyAUnitName', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 填报季度
            { label: 'quarterPlan.applyQuarter', prop: 'applyQuarter', span: 8, formType: 'slot', isRule: true,
              relationTable: ['demandQuarterPlanDetail'], isRelationTable: true, clearable: false,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 申请原因(备注)
            { label: 'quarterPlan.remarks', prop: 'remarks', span: 16, formType: 'textarea', maxlength: 256,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload'}
        ],
        oldRelationList: []
    },
    subTableMatch: [
      {value: 'quarterPlanDetails', assignment: 'demandQuarterPlanDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      demandQuarterPlanDetail: {
          subTableName: 'demandQuarterPlanDetail',
          titleTips: 'demandQuarterPlanDetailTips',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'demandQuarterPlanDetail', disabled: false },
             // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'demandQuarterPlanDetail', name: 'button.export', authCode: 'export' },
            {noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'demandQuarterPlanDetail', disabled: false}
          ],
          tableList: {
              // 表头配置
              slaveColumns: [
                  // 材料编码
                  { label: 'fConfig.varietiesCode', prop: 'varietiesCode', formType: 'text', maxlength: 64, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 材料名称
                  { label: 'fConfig.varietiesName', prop: 'varietiesName', formType: 'text', maxlength: 32,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 规格
                  { label: 'fConfig.standards', prop: 'standards', formType: 'text', maxlength: 32, minWidth: 160,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 计量单位
                  { label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 80,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  预算数量
                  { label: 'quarterPlan.budgetQuantity', prop: 'budgetQuantity', formType: 'text', filterName: 'number', minWidth: 100,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  已申请数量
                  { label: 'quarterPlan.alreadyApplyQuantity', prop: 'alreadyApplyQuantity', formType: 'text', filterName: 'number', minWidth: 120,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  季度需求数量
                  { label: 'quarterPlan.currentApplyQuantity', prop: 'currentApplyQuantity', formType: 'number', operateData: true, precision: 4, maxlength: 12, minWidth: 120,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 物资类别
                  {
                    label: 'fConfig.materialClassifyValue', prop: 'materialClassifyValue', formType: 'text', minWidth: 100,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 拟供应来源
                  {
                    label: 'fConfig.supplySourceValue', prop: 'supplySourceValue', formType: 'text', minWidth: 100,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 专业
                  {
                    label: 'fConfig.majorValue', prop: 'majorValue', formType: 'text', minWidth: 100,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 备注
                  { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  }
              ],
              // 校验
              rules: {},
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
