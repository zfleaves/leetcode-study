/*
 * @Author: your name
 * @Date: 2021-04-14 09:41:59
 * @LastEditTime: 2021-04-14 10:05:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\durationRisk\durationRiskRegister.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/durationrisk/register/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/durationrisk/register/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/durationrisk/register/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/durationrisk/register/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/durationrisk/register/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/durationrisk/register/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/durationrisk/register/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/durationrisk/register/workflow/approve',
        method: 'post'
    }
};
