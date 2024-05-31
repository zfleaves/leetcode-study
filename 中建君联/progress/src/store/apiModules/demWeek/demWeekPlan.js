/*
 * @Author: your name
 * @Date: 2021-02-01 17:26:23
 * @LastEditTime: 2021-02-01 17:29:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demWeek\demWeekPlan.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/plan/week/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/plan/week/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/plan/week/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/plan/week/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/plan/week/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/plan/week/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/plan/week/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/plan/week/workflow/approve',
        method: 'post'
    },
    // 校验项目是否存在主计划(存在返回true, 不存在返回false
    checkAreadyProject: {
        url: '/proprogress/plan/week/check/project/weekplan/exist',
        method: 'get'
    },
    // 查询项目下的主计划主表数据
    getProjectMainInfo: {
        url: '/proprogress/plan/week/byproject/list',
        method: 'get'
    }
};
