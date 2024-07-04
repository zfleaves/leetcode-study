
import Utils from 'util';

const PageConfig = {
  getProjectUnitInfo: {
      // info
      infoUrl: {
        url: '/project/major/info',
        params: 'id'
      },
      // save
      saveProjectUnit: {
          url: 'projectMajor/saveProject'
      }
    },
    // 数据字典
    dictionary: [
      { dicCode: 'majorCode', propCode: 'majorCode' }
    ],
    // 接口数据
    selectList: [],
    // 主表
    mainFormConfig: {
        formList: [
            // 专业
            { label: 'projectMajor.majorValue', prop: 'majorValue', span: 24, isRule: true,
              formType: 'input', maxlength: 64, inputStatus: 'edit'
            },
            // 编号
            { label: 'projectMajor.majorCode', prop: 'majorCode', span: 24, isRule: true,
              formType: 'input', maxlength: 32, inputStatus: 'edit'
            },
            // 状态
            { label: 'projectMajor.status', prop: 'status', span: 24, isRule: true,
              formType: 'dicSelect', selectList: [
                {dataName: '启用', dataCode: 0},
                {dataName: '禁用', dataCode: 1}
              ], inputStatus: 'edit'
            },
            // 排序
            { label: 'projectMajor.sorts', prop: 'sorts', span: 24,
              formType: 'elNumber', maxlength: 12, precision: 0, min: 0
            },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', minRows: 2, maxRows: 4, maxlength: 256}
        ]
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
