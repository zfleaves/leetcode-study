/*
 * @Author: your name
 * @Date: 2020-06-17 10:37:52
 * @LastEditTime: 2020-07-24 18:38:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_portal\src\views\task\task.js
 */
const rolesTypeList = [
    {dataName: '项目角色', dataCode: '01'},
    {dataName: '企业角色', dataCode: '02'}
];

export default (self) => ({
    // 搜索配置
    searchConfigForm: {
        // 是否显示
        formShow: true,
        // 表单配置
        formList: [
            // 任务名称
            {label: '任务名称', prop: 'taskName', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 64},
            // 当前节点名称
            {label: '当前节点名称', prop: 'nodeName', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 32},
            // 发起人
            {label: '发起人', prop: 'taskCreateByName', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 12},
            // 上一步处理人
            {label: '上一步处理人', prop: 'prevAssigneeName', span: 8, formType: 'input', clearable: true, inputStatus: 'edit', maxlength: 12},
            // 当前节点处理人
            {label: '当前节点处理人', prop: 'taskCreateByName', span: 8, formType: 'input', clearable: true, inputStatus: 'hide', maxlength: 12},
            // 到达时间
            {label: '到达时间', prop: 'taskDetailCreateTime', span: 8, formType: 'daterange-split', clearable: true, inputStatus: 'edit',
                propStart: 'processCreateTimeStart', propEnd: 'processCreateTimeEnd'
            }
        ],
        // 表单按钮
        buttonList: [
            {isCustom: false, code: 'sysHandleResetForm'},
            {isCustom: false, code: 'sysHandleSearch'}
        ]
    },
    // 表头操作行配置
    tableHeader: {
        showColumnCtrl: true, // 显示/隐藏列
        refresh: false // 刷新
    },
    // 是否默认选中第一行
    defaultSeleOne: false,
    // 表格参数
    toConfigure: {
        size: 'small', // 表格的尺寸
        border: false, // 是否显示边框
        stripe: false, // 是否显示斑马纹
        highlightCurrentRow: true, // 当前行高亮
        choice: 'checkbox', // radio => 单选  checkbox => 多选
        spanMethod: '', // 表格合并函数,
        getRowId: 'id' // row-key
    },
    //   待办事项
    getTaskUndo: {
        // 自表格操作按钮
        button: [
            // 批量委托
            {isCustom: true, name: '批量委托', class: 'other', type: 'primary', icon: 'el-icon-upload2', code: 'handleBatchDelegation'},
            // 导出
            {isCustom: true, name: '导出', class: 'success', type: 'primary', icon: 'el-icon-download', code: 'handleExport'}
        ],
        // 子系统表头渲染参数
        tableList: [
            // 任务名称
            {show: true, prop: 'taskName', label: '任务名称'},
            // 到达时间
            {show: true, prop: 'taskDetailCreateTime', label: '到达时间'},
            // 当前节点名称
            {show: true, prop: 'nodeName', label: '当前节点名称'},
            // 上一步处理人
            {show: true, prop: 'prevAssigneeName', label: '上一步处理人'},
            // 发起人
            {show: true, prop: 'taskCreateByName', label: '发起人'},
            // 发起时间
            {show: true, formType: 'date', prop: 'taskCreateTime', label: '发起时间', minWidth: '100'},
            // 操作
            {show: true, formType: 'operate', label: '操作', minWidth: '60',
            buts: [
                // 办理
                {name: '办理', class: 'success', has: '', fn: 'handleTask'},
                // 委托
                {name: '委托', class: 'warning', has: '', fn: 'handleEntrust'},
                // 查看审批记录
                {name: '查看审批记录', class: '', has: '', fn: 'handleViewApprovalRecords'}
            ]}
        ]
    },
    // 我的待阅
    getTaskUnRead: {
        // 自表格操作按钮
        button: [
            // 批量委托
            {isCustom: true, name: '批量委托', class: 'other', type: 'primary', icon: 'el-icon-upload2', code: 'handleBatchDelegation'},
            // 导出
            {isCustom: true, name: '导出', class: 'success', type: 'primary', icon: 'el-icon-download', code: 'handleExport'}
        ],
        // 任务名称、到达时间、当前节点名称、上一步处理人、发起人、发起时间、操作（查阅、查看审批记录）
        // 子系统表头渲染参数
        tableList: [
            // 任务名称
            {show: true, prop: 'taskName', label: '任务名称'},
            // 到达时间
            {show: true, prop: 'taskDetailCreateTime', label: '到达时间'},
            // 当前节点名称
            {show: true, prop: 'nodeName', label: '当前节点名称'},
            // 上一步处理人
            {show: true, prop: 'prevAssigneeName', label: '上一步处理人'},
            // 发起人
            {show: true, prop: 'taskCreateByName', label: '发起人'},
            // 发起时间
            {show: true, formType: 'date', prop: 'taskCreateTime', label: '发起时间', minWidth: '100'},
            // 操作
            {show: true, formType: 'operate', label: '操作', minWidth: '60',
            buts: [
                // 查阅
                {name: '查阅', class: 'success', has: '', fn: 'handleConsult'},
                // 查看审批记录
                {name: '查看审批记录', class: '', has: '', fn: 'handleViewApprovalRecords'}
            ]}
        ]
    },
    // 我的已办
    getTaskDone: {
        // 自表格操作按钮
        button: [
            // 批量委托
            {isCustom: true, name: '批量委托', class: 'other', type: 'primary', icon: 'el-icon-upload2', code: 'handleBatchDelegation'},
            // 导出
            {isCustom: true, name: '导出', class: 'success', type: 'primary', icon: 'el-icon-download', code: 'handleExport'}
        ],
        // 任务名称、到达时间、当前节点名称、上一步处理人、发起人、发起时间、操作（查看单据、查看审批记录）
        // 子系统表头渲染参数
        tableList: [
            // 任务名称
            {show: true, prop: 'taskName', label: '任务名称'},
            // 到达时间
            {show: true, prop: 'taskDetailCreateTime', label: '到达时间'},
            // 当前节点名称
            {show: true, prop: 'nodeName', label: '当前节点名称'},
            // 上一步处理人
            {show: true, prop: 'prevAssigneeName', label: '上一步处理人'},
            // 发起人
            {show: true, prop: 'taskCreateByName', label: '发起人'},
            // 发起时间
            {show: true, formType: 'date', prop: 'taskCreateTime', label: '发起时间', minWidth: '100'},
            // 操作
            {show: true, formType: 'operate', label: '操作', minWidth: '60',
            buts: [
                // 查看单据
                {name: '查看单据', class: 'success', has: '', fn: 'handleViewDocuments'},
                // 查看审批记录
                {name: '查看审批记录', class: '', has: '', fn: 'handleViewApprovalRecords'}
            ]}
        ]
    },
    // 我的已阅
    getTaskRead: {
        // 自表格操作按钮
        button: [
            // 批量委托
            {isCustom: true, name: '批量委托', class: 'other', type: 'primary', icon: 'el-icon-upload2', code: 'handleBatchDelegation'},
            // 导出
            {isCustom: true, name: '导出', class: 'success', type: 'primary', icon: 'el-icon-download', code: 'handleExport'}
        ],
        // 任务名称、到达时间、当前节点名称、上一步处理人、发起人、发起时间、操作（查看单据、查看审批记录）
        // 子系统表头渲染参数
        tableList: [
            // 任务名称
            {show: true, prop: 'taskName', label: '任务名称'},
            // 到达时间
            {show: true, prop: 'taskDetailCreateTime', label: '到达时间'},
            // 当前节点名称
            {show: true, prop: 'nodeName', label: '当前节点名称'},
            // 上一步处理人
            {show: true, prop: 'prevAssigneeName', label: '上一步处理人'},
            // 发起人
            {show: true, prop: 'taskCreateByName', label: '发起人'},
            // 发起时间
            {show: true, formType: 'date', prop: 'taskCreateTime', label: '发起时间', minWidth: '100'},
            // 操作
            {show: true, formType: 'operate', label: '操作', minWidth: '60',
            buts: [
                // 查看单据
                {name: '查看单据', class: 'success', has: '', fn: 'handleViewDocuments'},
                // 查看审批记录
                {name: '查看审批记录', class: '', has: '', fn: 'handleViewApprovalRecords'}
            ]}
        ]
    },
    // 我的申请
    getTaskApply: {
        // 自表格操作按钮
        button: [
            // 批量委托
            {isCustom: true, name: '批量委托', class: 'other', type: 'primary', icon: 'el-icon-upload2', code: 'handleBatchDelegation'},
            // 导出
            {isCustom: true, name: '导出', class: 'success', type: 'primary', icon: 'el-icon-download', code: 'handleExport'}
        ],
        // 审批状态、任务名称、当前节点名称、当前节点处理人、发起时间、操作（查看单据、查看审批记录）
        // 子系统表头渲染参数
        tableList: [
            // 任务名称
            {show: true, prop: 'taskName', label: '任务名称'},
            // 当前节点名称
            {show: true, prop: 'nodeName', label: '当前节点名称'},
            // 上一步处理人
            {show: true, prop: 'taskCreateByName', label: '当前节点处理人'},
            // 发起时间
            {show: true, formType: 'date', prop: 'taskCreateTime', label: '发起时间', minWidth: '100'},
            // 操作
            {show: true, formType: 'operate', label: '操作', minWidth: '60',
            buts: [
                // 查看单据
                {name: '查看单据', class: 'success', has: '', fn: 'handleViewDocuments'},
                // 查看审批记录
                {name: '查看审批记录', class: '', has: '', fn: 'handleViewApprovalRecords'}
            ]}
        ]
    }
});
