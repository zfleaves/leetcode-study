/*
 * @Author: your name
 * @Date: 2021-01-29 17:41:10
 * @LastEditTime: 2021-02-01 15:12:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demMonth\demMonthPlanAdjust.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/plan/monthadjust/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/plan/monthadjust/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/plan/monthadjust/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/plan/monthadjust/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/plan/monthadjust/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/plan/monthadjust/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/plan/monthadjust/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/plan/monthadjust/workflow/approve',
        method: 'post'
    },
    // 校验项目是否存在主计划(存在返回true, 不存在返回false
    checkAreadyProject: {
        url: '/proprogress/plan/monthadjust/check/project/masterplan/exist',
        method: 'get'
    },
    // 查询该项目下的月计划信息
    getProjectMonthInfo: {
        url: '/proprogress/plan/month/byproject/list',
        method: 'get'
    },
    // 查询月计划调整次数
    getAdjustMonthCounts: {
        url: '/proprogress/plan/monthadjust/project/counts',
        method: 'get'
    }
};
