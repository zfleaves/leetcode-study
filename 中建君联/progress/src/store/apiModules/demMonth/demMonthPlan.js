/*
 * @Author: your name
 * @Date: 2021-01-29 17:41:03
 * @LastEditTime: 2022-03-02 16:16:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demMonth\demMonthPlan.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/plan/month/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/plan/month/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/plan/month/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/plan/month/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/plan/month/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/plan/month/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/plan/month/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/plan/month/workflow/approve',
        method: 'post'
    },
    // 校验项目是否存在主计划(存在返回true, 不存在返回false
    checkAreadyProject: {
        url: '/proprogress/plan/month/check/project/masterplan/exist',
        method: 'get'
    },
    // 查询该项目下填报的最大月计划月份
    getProjectMaxMonth: {
        url: '/proprogress/plan/month/maxmonth/byproject',
        method: 'get'
    },
    // 查询项目下的主计划主表数据
    getProjectMainInfo: {
        url: '/proprogress/plan/master/byproject/list',
        method: 'get'
    },
    // 下载甘特图工程量及资源信息明细模板
    downloadResourceDetailTemplate: {
        url: '/proprogress/plan/monthprogress/report/download/resource/detail/template',
        method: 'get',
        isExport: true,
        loading: true
    }
};

