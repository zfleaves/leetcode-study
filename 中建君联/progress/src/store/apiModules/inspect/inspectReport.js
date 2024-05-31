/*
 * @Author: your name
 * @Date: 2021-04-14 09:38:45
 * @LastEditTime: 2021-04-14 14:04:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\inspect\inspectReport.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/inspect/report/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/inspect/report/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/inspect/report/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/inspect/report/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/inspect/report/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/inspect/report/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/inspect/report/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/inspect/report/workflow/approve',
        method: 'post'
    }
};
