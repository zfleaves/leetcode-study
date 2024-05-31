/*
 * @Author: your name
 * @Date: 2021-01-26 10:17:22
 * @LastEditTime: 2021-01-26 10:18:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\inspect\inspectRegister.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/inspect/register/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/inspect/register/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/inspect/register/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/inspect/register/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/inspect/register/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/inspect/register/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/inspect/register/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/inspect/register/workflow/approve',
        method: 'post'
    }
};
