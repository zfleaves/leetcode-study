/*
 * @Author: your name
 * @Date: 2020-07-30 10:35:19
 * @LastEditTime: 2021-08-02 10:51:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\equipInstall\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
  // 流程
  processParmas: {
    // 获取下一个节点的处理人信息
    nextInfo: {
      url: 'equipInstall/getWorkflowNextNode',
      parmasList: [
        {receive: 'sid', value: 'taskSid'},
        {receive: 'projectId', value: 'projectId'}
      ]
    },
    // 流程审批
    approveSubmit: {
      url: 'equipInstall/setWorkflowApprove'
    },
    // 删除
    deleteParams: {
      url: 'equipInstall/setDelete',
      params: 'installId'
    },
    // info
    infoUrl: {
      url: 'equipInstall/getInfo',
      params: 'installId'
    },
    // save
    saveUrl: {
      url: 'equipInstall/setEdit'
    },
    exportDetail: {
      url: 'equipInstall/exportDetail',
      params: 'installId'
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
              isRule: true, relationTable: ['equipmentInstallDetail'],
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 项目编号
            { label: 'fConfig.projectCode', prop: 'projectCode', span: 8, formType: 'input', inputStatus: 'disable',
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 整体安装情况
            { label: 'equipInstall.installSituation', prop: 'installSituation', span: 8, formType: 'input', maxlength: 128, isRule: true,
              printWidth: 8, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 主要安装设备
            { label: 'equipInstall.mainInstallEquipment', prop: 'mainInstallEquipment', span: 16, formType: 'input',
              inputStatus: 'disable', placeholder: 'equipInstall.mainInstallEquipmentTips', // 自动获取明细前1-5行明细名称
              printWidth: 16, printFlag: true, defaultFlag: true, printStatus: 0
            },
            // 安装日期
            { label: 'equipInstall.installDate', prop: 'installDate', span: 8, formType: 'date', isRule: true,
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
      {value: 'installDetails', assignment: 'equipmentInstallDetail'}
    ],
    // 子表
    subTableConfig: {
      // 明细清单
      equipmentInstallDetail: {
          subTableName: 'equipmentInstallDetail',
          isSelection: true,
          // 子表按钮
          subTableButton: [
            { noAuth: true, code: 'sysHandleDeletaBatch', subTableCode: 'equipmentInstallDetail', disabled: false },
             // 导出明细
            { noAuth: true, code: 'sysHandleExportDetail', subTableCode: 'equipmentInstallDetail', name: 'button.export', authCode: 'export' },
            {noAuth: true, code: 'sysHandleSelectDetail', subTableCode: 'equipmentInstallDetail', disabled: false}
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
                  //  安装数量
                  { label: 'equipInstall.installQuantity', prop: 'installQuantity', formType: 'number',
                    precision: 4, min: 0, maxlength: 12, minWidth: 100,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  安装人
                  { label: 'equipInstall.installUserName', prop: 'installUserName', formType: 'input', maxlength: 32, minWidth: 100,
                    printWidth: 6, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  安装结果
                  { label: 'equipInstall.installResult', prop: 'installResult', formType: 'input', maxlength: 32, minWidth: 100,
                    printWidth: 10, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  //  安装位置
                  { label: 'equipInstall.usePlaceName', prop: 'usePlaceName', formType: 'slot', minWidth: 140,
                    printWidth: 12, printFlag: true, defaultFlag: true, printStatus: 0
                  },
                  // 附件
                  { label: 'equipInstall.detailAttachment', prop: 'detailAttachment', formType: 'attachment', limit: 1, multiple: false, minWidth: 140,
                    printWidth: 10, printFlag: false, defaultFlag: false, printStatus: 0
                  },
                  // 备注
                  { label: 'fConfig.remarks', prop: 'remarks', formType: 'input', maxlength: 255,
                    printWidth: 12, printFlag: false, defaultFlag: false, printStatus: 0
                  }
              ],
              // 校验
              rules: {
                installUserName: [
                  { required: true, message: 'equipInstall.installUserNameTips', trigger: 'blur'}
                ],
                installResult: [
                  { required: true, message: 'equipInstall.installResultTips', trigger: 'blur'}
                ],
                usePlaceName: [
                  { required: true, message: 'equipInstall.usePlaceNameTips', trigger: 'blur'}
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
