/*
 * @Author: your name
 * @Date: 2021-04-14 09:40:08
 * @LastEditTime: 2021-04-25 15:26:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\durationRiskConfig\durationRiskConfigConfig\config.js
 */
import Utils from 'util';
import i18n from '@/mixins/i18n/index.js';

const PageConfig = {
    // 流程
    processParmas: {
        saveUrl: {
            url: 'durationRiskConfig/setEdit'
        }
    },
    // 数据字典
    dictionary: [
        // { dicCode: 'warStatus', propCode: 'status' }
    ],
    // 接口数据
    selectList: [],
    // 搜索
    searchControls: {
        // 是否显示
        formShow: true,
        // 搜索使用插槽
        searchSlotShow: false,
        // 表单配置
        formList: [
            // 状态
            {
                show: true, label: 'fConfig.status', prop: 'stauts', span: 8, formType: 'dicSelect', maxlength: 32, multiple: true,
                selectList: [{ dataCode: 0, dataName: 'button.enable' }, { dataCode: 1, dataName: 'button.disable' }], isTranslate: true
            },
            // 风险内容
            { show: true, label: 'durationRiskConfig.riskContent', prop: 'riskContent', span: 8, formType: 'input', maxlength: 256 },
            // 计划时间
            { show: true, label: 'durationRiskConfig.planTimeContent', prop: 'planTimeContent', span: 8, formType: 'input', maxlength: 256 }
        ],
        // 是否显示重置按钮
        isReset: false
    },
    mainBtnSlotShow: false,
    // 表格操作按钮
    mainOperateBtn: [
        { isCustom: false, code: 'sysHandleAdd', authCode: 'create' }
    ],
    // 主表渲染参数
    mainTable: {
        // 单选
        isRadio: true,
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        pageSize: 10,
        // 页码
        total: 0,
        // 是否显示分页
        paging: true,
        // 表头操作行配置
        tableHeader: {
            showColumnCtrl: true, // 显示/隐藏列
            refresh: false // 刷新
        },
        // 是否默认选中第一行
        defaultSeleFirstLine: false,
        // 子系统表头渲染参数
        tableList: [
            // 状态
            {
                show: true, prop: 'status', label: 'fConfig.status', formType: 'slot', align: 'center', minWidth: '80',
                selectList: [{ dataCode: 0, dataName: 'button.enable' }, { dataCode: 1, dataName: 'button.disable' }], isTranslate: true
            },
            // 风险内容
            { show: true, prop: 'riskContent', label: 'durationRiskConfig.riskContent', fn: 'handleInfo' },
            // 计划时间
            { show: true, prop: 'planTimeContent', label: 'durationRiskConfig.planTimeContent'},
            // 正产延误(绿色)
            { show: true, prop: 'deliveryDelay', label: 'durationRiskConfig.deliveryDelay', minWidth: '110'},
            // 可控延误(蓝色)
            { show: true, prop: 'controllableDelay', label: 'durationRiskConfig.controllableDelay', minWidth: '110' },
            // 一般延误(黄色)
            { show: true, prop: 'generalDelay', label: 'durationRiskConfig.generalDelay', minWidth: '110' },
            // 严重延误(红色)
            { show: true, prop: 'seriousDelay', label: 'durationRiskConfig.seriousDelay', minWidth: '110' },
            // 创建人
            { show: true, prop: 'createByName', label: 'fConfig.createBy', minWidth: '80' },
             // 排序
             { show: true, prop: 'sorts', label: 'fConfig.sorts', minWidth: '50' },
            // 最后更新日期
            // { show: true, filterName: 'date', prop: 'createTime', label: 'fConfig.createDate', minWidth: '100' },
            // 操作
            {
             show: true, prop: 'operate', formType: 'operate', label: 'fConfig.operate', minWidth: '120'
             // buts: [
             //     { name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update' }
             // ]
            }
        ]
    }
};
class Page {
    constructor() {
        // console.log(i18n, 'i18n');
        // console.log(i18n.t('durationRiskConfig.address'));
        this.PageConfig = JSON.parse(JSON.stringify(PageConfig));
        this.init();
    }
    init() {
        Utils.commonUtil.getSelectList(this.PageConfig.selectList, this);
        Utils.commonUtil.getDicAllDataList(this.PageConfig.dictionary, this);
    }
}
export default Page;
