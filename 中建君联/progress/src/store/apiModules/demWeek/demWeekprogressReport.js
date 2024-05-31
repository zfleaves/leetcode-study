/*
 * @Author: your name
 * @Date: 2021-02-01 17:26:38
 * @LastEditTime: 2021-04-13 15:20:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demWeek\demWeekprogressReport.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/plan/weekprogress/report/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/plan/weekprogress/report/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/plan/weekprogress/report/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/plan/weekprogress/report/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/plan/weekprogress/report/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/plan/weekprogress/report/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/plan/weekprogress/report/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/plan/weekprogress/report/workflow/approve',
        method: 'post'
    },
    // 校验项目是否存在主计划(存在返回true, 不存在返回false
    checkAreadyProject: {
        url: '/proprogress/plan/weekprogress/report/check/project/monthprogress/exist',
        method: 'get'
    },
    // 查询该项目下的月计划信息
    getProjectWeekInfo: {
        url: '/proprogress/plan/week/byproject/list',
        method: 'get'
    },
    // 获取日志数据
    getProjectBuildLogApplyInfo: {
        url: '/proprogress/log/apply/detail/progress/list',
        method: 'post',
        loading: true
    }
};
