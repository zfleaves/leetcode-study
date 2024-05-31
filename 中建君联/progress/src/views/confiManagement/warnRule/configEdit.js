/*
 * @Author: your name
 * @Date: 2021-01-26 17:34:38
 * @LastEditTime: 2021-01-26 17:34:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\confiManagement\warnRule\configEdit.js
 */
import Utils from 'util';

const PageConfig = {
    getProjectUnitInfo: {
        // info
        infoUrl: {
            url: '/project/unit/info',
            params: 'id'
        },
        // save
        saveProjectUnit: {
            url: 'projectUnit/saveProject'
        }
    },
    // 数据字典
    dictionary: [],
    // 接口数据
    selectList: [],
    // 主表
    mainFormConfig: {
        formList: [
            // 名称
            {
                label: 'warnRule.ifFlag', prop: 'ifFlag', span: 24, isRule: true, formType: 'dicSelect',
                selectList: [{ dataName: 'tips.yes', dataCode: 1 }, { dataName: 'tips.no', dataCode: 0 }], isTranslate: true
            },
            // 负责人
            { label: 'warnRule.excludeName', prop: 'excludeName', isRule: true, span: 24, formType: 'input', maxlength: 32 },
            // 日期
            { label: 'warnRule.time', prop: 'time', isRule: true, span: 24, formType: 'daterange' },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'input', maxlength: 255 }
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
