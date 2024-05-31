/*
 * @Author: your name
 * @Date: 2021-01-29 18:13:01
 * @LastEditTime: 2021-01-29 18:33:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\buildLog\buildLogOther.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/log/apply/other/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/log/apply/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/log/apply/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/log/apply/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/log/apply/other/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/log/apply/other/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/log/apply/other/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/log/apply/other/workflow/approve',
        method: 'post'
    }
};
