/*
 * @Author: your name
 * @Date: 2021-01-26 09:50:59
 * @LastEditTime: 2021-02-04 09:15:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\buildLog\buildLogType\config.js
 */
import Utils from 'util';
import i18n from '@/mixins/i18n/index.js';

const PageConfig = {
    // 流程
    processParmas: {
        saveUrl: {
            url: 'buildLogType/setEdit'
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
            { show: true, label: 'fConfig.status', prop: 'status', span: 8, formType: 'dicSelect', maxlength: 32, multiple: true,
                selectList: [{ dataCode: 0, dataName: 'button.enable' }, { dataCode: 1, dataName: 'button.disable' }], isTranslate: true
            },
            // 分类名称
            { show: true, label: 'buildLogType.logTypeName', prop: 'logTypeName', span: 8, formType: 'input', maxlength: 64 },
            // 分类编号
            { show: true, label: 'buildLogType.logTypeCode', prop: 'logTypeCode', span: 8, formType: 'input', maxlength: 32 },
            // 备注
            { show: true, label: 'fConfig.remarks', prop: 'remarks', span: 8, formType: 'input', maxlength: 64 },
            // 最后更新日期
            {
                label: 'fConfig.createDate', span: 8, formType: 'daterange-split',
                propStart: 'updateTimeFrom', propEnd: 'updateTimeTo',
                inputStatus: 'edit'
            }
        ],
        // 是否显示重置按钮
        isReset: true
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
            { show: true, prop: 'status', label: 'fConfig.status', formType: 'slot', align: 'center', minWidth: '100',
                selectList: [{ dataCode: 0, dataName: 'button.enable' }, { dataCode: 1, dataName: 'button.disable' }], isTranslate: true
            },
            // 分类名称
            { show: true, prop: 'logTypeName', label: 'buildLogType.logTypeName' },
            // 分类编号
            { show: true, prop: 'logTypeCode', label: 'buildLogType.logTypeCode', fn: 'handleSetRouter', minWidth: '120' },
            // 同级排序
            { show: true, prop: 'sort', label: 'buildLogType.sort', minWidth: '100' },
            // 备注
            { show: true, prop: 'remarks', label: 'fConfig.remarks' },
            // 修改人
            { show: true, prop: 'updateByName', label: 'fConfig.updateByName', minWidth: '80' },
            // 创建人
            { show: true, prop: 'createByName', label: 'fConfig.createBy', minWidth: '80' },
            // 最后更新日期
            { show: true, filterName: 'date', prop: 'updateTime', label: 'fConfig.createDate', minWidth: '120' },
            // 操作
            {
                show: true, prop: 'operate', formType: 'operate', label: 'fConfig.operate', minWidth: '150'
                // buts: [
                //     { name: 'button.edit', class: 'warning', fn: 'handleEdit', authCode: 'update' }
                // ]
            }
        ]
    },
    mainFormConfig: {
        formList: [
            // 分类名称
            { label: 'buildLogType.logTypeName', prop: 'logTypeName', span: 24, formType: 'input', isRule: true, maxlength: 64 },
            // 分类编号
            { label: 'buildLogType.logTypeCode', prop: 'logTypeCode', span: 24, formType: 'input', maxlength: 32 },
            // 同级排序
            { label: 'buildLogType.sort', prop: 'sort', span: 24, formType: 'elNumber', precision: 0, min: 0, maxlength: 10 },
            // 备注
            { label: 'fConfig.remarks', prop: 'remarks', span: 24, formType: 'textarea', minRows: 2, maxRows: 4, maxlength: 256 }
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
