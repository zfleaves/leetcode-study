/*
 * @Author: your name
 * @Date: 2021-04-19 11:59:26
 * @LastEditTime: 2022-07-11 15:52:36
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\subcontractorMaterial\materialApproach\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'materialApproach/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'materialApproach/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'materialApproach/setDelete',
      params: 'subcontractMaterialEnterId'
    },
    // 删除明细
    deleteDetailsParams: {
      url: 'materialApproach/setDeleteDetails'
    },
    // info
    infoUrl: {
      url: 'materialApproach/getInfo',
      params: 'subcontractMaterialEnterId'
    },
    // save
    saveUrl: {
      url: 'materialApproach/setEdit'
    },
    dowanloadDetail: {
      url: 'materialApproach/getDownloadTemplate',
      tableName: 'detail'
    },
    exportDetail: {
      url: 'materialApproach/exportDetail',
      params: 'subcontractMaterialEnterId'
    }
  },
    // 数据字典
    dictionary: [
      { dicCode: 'taxRate', propCode: 'taxRate' }
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
              check: true, isRule: true, isRelation: true,
              relationList: [{receive: 'projectCode', value: 'projectCode'},
              {receive: 'projectUnitName', value: 'projectUnitName'},
              {receive: 'projectUnitId', value: 'projectUnitId'}],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 分包商名称
            {
              label: 'materialApproach.projectUnitName', prop: 'projectUnitId', span: 8, formType: 'select', isRule: true,
              isRelation: true, relationList: [{receive: 'projectUnitName', value: 'name'}],
              nameCode: 'name', valueCode: 'id',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, pintIdName: 'projectUnitName'
            },
            // 供应商名称
            {
              label: 'materialApproach.supplierName', prop: 'supplierName', span: 8, formType: 'input', isRule: false, maxlength: 64,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 登记人
            { label: 'materialApproach.registerName', prop: 'registerName', span: 8, formType: 'input', maxlength: 32, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 进场日期
            { label: 'materialApproach.enterTime', prop: 'enterTime', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0,
              otherOperate: true, otherOperateFun: 'handleSetRequiredDateUsePlace'
            },
            // 价税合计
            {
              label: 'dialog.totalPriceTax', prop: 'totalIncludeTaxAmount', span: 8, formType: 'elNumber', precision: 2, maxlength: 12, inputStatus: 'disable',
              printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0, filterName: 'setMoney'
            },
            // 主要进场材料
            { label: 'materialApproach.mainEnterMaterial', prop: 'mainEnterMaterial', span: 16, formType: 'input',
              inputStatus: 'disable', placeholder: 'materialApproach.mainEnterMaterialTips', // 自动获取明细前1-5行明细名称
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
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
      {value: 'details', assignment: 'subcontractMaterialEnterDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      subcontractMaterialEnterDetail: {
          subTableName: 'subcontractMaterialEnterDetail',
          titleTips: 'subcontractMaterialEnterDetailTips',
          isSelection: true,
          // 子表按钮
        subTableButton: [

            // 下载模板
            { noAuth: true, code: 'sysHandleDownloadTemplate', subTableCode: 'subcontractMaterialEnterDetail', name: 'button.downloadTemplate', authCode: 'downloadTemplate' },
            // 导入明细
            { noAuth: true, code: 'sysHandleImport', subTableCode: 'subcontractMaterialEnterDetail', name: 'button.Import', disabled: false, slot: true },
             // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'subcontractMaterialEnterDetail', name: 'button.export', authCode: 'export' },
            { noAuth: true, code: 'sysHandleDeletaAdd', subTableCode: 'subcontractMaterialEnterDetail', disabled: false },
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'subcontractMaterialEnterDetail', disabled: false }
          ],
          tableList: {
              // 表头配置
              slaveColumns: [
                  // 材料名称
                  { label: 'fConfig.materialName', prop: 'varietiesName', formType: 'input', maxlength: 64,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 规格
                  { label: 'fConfig.standards', prop: 'standards', formType: 'input', minWidth: 120, maxlength: 64,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 型号
                  { label: 'fConfig.models', prop: 'models', formType: 'input', minWidth: 120, maxlength: 64,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 品牌
                  { label: 'fConfig.brand', prop: 'brand', formType: 'input', minWidth: 120, maxlength: 128,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 计量单位
                  { label: 'fConfig.unit', prop: 'unit', formType: 'input', minWidth: 100, maxlength: 32,
                    printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  进场数量
                  { label: 'materialApproach.enterQuantity', prop: 'enterQuantity', formType: 'number',
                    precision: 4, min: 1, maxlength: 12, operateData: true,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 税率(%)
                  {
                    label: 'fConfig.taxRate', prop: 'taxRate', formType: 'dicSelect', operateData: true,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0, minWidth: 100, filterName: 'taxRate', selectList: []
                  },
                  //  单价(含税)
                  {
                    label: 'fConfig.includeUnitPrice', prop: 'includeUnitPrice', formType: 'number', operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  金额(含税)
                  {
                    label: 'fConfig.includeTaxAmount', prop: 'includeTaxAmount', formType: 'number', operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  单价(不含税)
                  {
                    label: 'fConfig.unitPrice', prop: 'excludeUnitPrice', formType: 'number', operateData: true, precision: 8, min: 0, maxlength: 18, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  金额(不含税)
                  {
                    label: 'fConfig.excludeTaxAmount', prop: 'excludeTaxAmount', formType: 'number', operateData: true, precision: 2, min: 0, maxlength: 12, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  税额
                  {
                    label: 'fConfig.taxAmount', prop: 'taxAmount', formType: 'number', filterName: 'setMoney',
                    precision: 2,
                    printWidth: 8, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  //  进场日期
                  { label: 'materialApproach.enterTime', prop: 'enterTime', formType: 'date',
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 备注
                  { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  }
              ],
              // 校验
              rules: {
                varietiesName: [
                  { required: true, trigger: 'blur'}
                ],
                standards: [
                  { required: true, trigger: 'blur'}
                ],
                unit: [
                  { required: true, trigger: 'blur'}
                ],
                enterQuantity: [
                  { required: true, trigger: 'blur'}
                ],
                enterTime: [
                  { required: true, trigger: 'blur'}
                ]
              },
              // 初始化行数据
              tableDataRow: {
                brand: '',
                enterQuantity: '',
                enterTime: '',
                excludeTaxAmount: '',
                excludeUnitPrice: '',
                exitApplyQuantity: '',
                includeTaxAmount: '',
                includeUnitPrice: '',
                models: '',
                remarks: '',
                standards: '',
                taxAmount: '',
                taxRate: '',
                unit: '',
                varietiesName: ''
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
  init () {
    Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
    Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
  }
}
export default Page;
