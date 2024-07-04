/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:19
 * @LastEditTime: 2021-08-02 10:53:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\equipCheck\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'equipCheck/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'equipCheck/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'equipCheck/setDelete',
      params: 'checkId'
    },
    // info
    infoUrl: {
      url: 'equipCheck/getInfo',
      params: 'checkId'
    },
    // save
    saveUrl: {
      url: 'equipCheck/setEdit'
    },
    exportDetail: {
      url: 'equipCheck/exportDetail',
      params: 'checkId'
    }
  },
    // 数据字典
    dictionary: [],
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
              isRelation: true, relationList: [{receive: 'projectCode', value: 'projectCode'}],
              isRule: true, relationTable: ['equipmentCheckDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 整体检测情况
            { label: 'equipCheck.checkSituation', prop: 'checkSituation', span: 8, formType: 'input', maxlength: 128, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 主要检测对象
            { label: 'equipCheck.mainCheckEquipment', prop: 'mainCheckEquipment', span: 16, formType: 'input',
              inputStatus: 'disable', placeholder: 'equipCheck.mainCheckEquipmentTips', // 自动获取明细前1-5行明细名称
              printWidth: 16, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 检测日期
            { label: 'equipCheck.checkDate', prop: 'checkDate', span: 8, formType: 'date', isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', maxlength: 256,
              minRows: 2, maxRows: 3,
              printWidth: 24, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 附件
            { label: 'fConfig.attachment', prop: 'attachment', span: 24, formType: 'upload'}
        ],
        oldRelationList: []
    },
    subTableMatch: [
      {value: 'checkDetails', assignment: 'equipmentCheckDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      equipmentCheckDetail: {
          subTableName: 'equipmentCheckDetail',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'equipmentCheckDetail', disabled: false },
             // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'equipmentCheckDetail', name: 'button.export', authCode: 'export' },
            {noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'equipmentCheckDetail', disabled: false}
          ],
          tableList: {
              // 表头配置
              slaveColumns: [
                  // 材料编码
                  { label: 'fConfig.materialCode', prop: 'materialCode', formType: 'text', minWidth: 120,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 材料名称
                  { label: 'fConfig.materialName', prop: 'materialName', formType: 'text', minWidth: 140,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 规格
                  { label: 'fConfig.standards', prop: 'standards', formType: 'text',
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 型号
                  { label: 'fConfig.models', prop: 'models', formType: 'text',
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 品牌
                  { label: 'fConfig.brand', prop: 'brand', formType: 'text',
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 计量单位
                  { label: 'fConfig.unit', prop: 'unit', formType: 'text', minWidth: 60,
                    printWidth: 5, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  检测数量
                  { label: 'equipCheck.checkQuantity', prop: 'checkQuantity', formType: 'number',
                    precision: 4, operateData: true, min: 0, maxlength: 12, minWidth: 100,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  检测通过数量
                  { label: 'equipCheck.checkPassQuantity', prop: 'checkPassQuantity', formType: 'number',
                    maxValue: 'checkQuantity', operateData: true, precision: 4, min: 0, maxlength: 12, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  检测人
                  { label: 'equipCheck.checkUserName', prop: 'checkUserName', formType: 'input', maxlength: 32, minWidth: 100,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  检测通过率%
                  { label: 'equipCheck.passRate', prop: 'passRate', formType: 'text',
                    maxlength: 12, minWidth: 100,
                    printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  检测结果
                  { label: 'equipCheck.checkResult', prop: 'checkResult', formType: 'input', maxlength: 32, minWidth: 120,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 附件
                  { label: 'equipCheck.detailAttachment', prop: 'detailAttachment', formType: 'attachment', limit: 1, multiple: false, minWidth: 140,
                    printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 备注
                  { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', minWidth: 120, maxlength: 255,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  }
              ],
              // 校验
              rules: {
                checkPassQuantity: [
                    { required: true, message: 'equipCheck.checkPassQuantityTips', trigger: 'blur'}
                  ],
                checkUserName: [
                  { required: true, message: 'equipCheck.checkUserNameTips', trigger: 'blur'}
                ],
                checkResult: [
                  { required: true, message: 'equipCheck.checkResultTips', trigger: 'blur'}
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
