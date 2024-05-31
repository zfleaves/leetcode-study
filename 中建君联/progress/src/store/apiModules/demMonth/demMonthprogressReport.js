/*
 * @Author: your name
 * @Date: 2021-01-29 17:41:17
 * @LastEditTime: 2022-03-01 09:28:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demMonth\demMonthprogressReport.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/plan/monthprogress/report/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/plan/monthprogress/report/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/plan/monthprogress/report/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/plan/monthprogress/report/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/plan/monthprogress/report/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/plan/monthprogress/report/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/plan/monthprogress/report/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/plan/monthprogress/report/workflow/approve',
        method: 'post'
    },
    // 校验项目是否存在主计划(存在返回true, 不存在返回false
    checkAreadyProject: {
        url: '/proprogress/plan/monthprogress/report/check/project/monthprogress/exist',
        method: 'get'
    },
    // 查询该项目下的月计划信息
    getProjectMonthInfo: {
        url: '/proprogress/plan/month/byproject/list',
        method: 'get'
    },
    // 查询任务节点的周计划填报情况
    getProjectWeekReportInfo: {
        url: '/proprogress/plan/weekprogress/report/detail/list',
        method: 'post'
    },
    // 查询该项目下所选月份的周资源数据
    getProjectWeekResourceInfo: {
        url: '/proprogress/plan/weekprogress/report/detail/resourse/list',
        method: 'post',
        loading: true
    },
    // 获取日志数据
    getProjectBuildLogApplyInfo: {
        url: '/proprogress/log/apply/detail/month/progress/list',
        method: 'post',
        loading: true
    }
};
