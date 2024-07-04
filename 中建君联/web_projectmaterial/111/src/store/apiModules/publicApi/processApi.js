/*
 * @Author: your name
 * @Date: 2020-07-15 15:40:10
 * @LastEditTime: 2020-08-07 15:20:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\store\apiModules\publicApi\processApi.js
 */
export default {
    // ====== 我的意见
    // 查询
    tagList: {
        url: '/basic/workflow/tag/list',
        method: 'get'
    },
    // 删除 tagId
    tagDelete: {
        url: '/basic/workflow/tag/delete',
        method: 'get'
    },
    // 创建
    tagCreate: {
        url: '/basic/workflow/tag/create',
        method: 'get'
    },
    // 修改
    tagUpdate: {
        url: '/basic/workflow/tag/update',
        method: 'get'
    },
    // 是否能发送短信  0 是可以发 1 不能发 companyId
    canSendMessage: {
        url: '/passport/api/company/sms/can/send',
        method: 'get'
    },
    // 查询单个节点的任务信息 taskDetailId
    workflowTaskDetailInfo: {
        url: '/basic/workflow/task/query/detail/info',
        method: 'get'
    },
    // 企业表单字段状态
    workflowFormColumns: {
        url: '/basic/workflow/dpm/form/columns',
        method: 'get'
    },
    // 查询租户流程定义的节点和连接信息 processCode
    getProcessNodeList: {
        url: '/basic/workflow/build/publish/process',
        method: 'get'
    },
    // 获取流程任务详情 taskId
    getTaskInfo: {
        url: '/basic/workflow/task/query/info',
        method: 'get'
    },
    // 查看流程监控日志列表 taskId
    getTasksQueryLogs: {
        url: '/basic/workflow/task/query/logs',
        method: 'get'
    },
    // 退回上一步
    workflowProcessReturnPrev: {
        url: '/basic/workflow/task/execute/return/prev',
        method: 'post'
    },
    // 退回发起人
    workflowProcessReturnStart: {
        url: '/basic/workflow/task/execute/return/start',
        method: 'post'
    },
    // 删除流程
    workflowProcessDelete: {
        url: '/basic/workflow/task/execute/delete',
        method: 'get'
    }
};

