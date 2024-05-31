/*
 * @Author: your name
 * @Date: 2021-01-28 09:13:32
 * @LastEditTime: 2021-02-01 16:15:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demMaster\demMasterPlanAdjust.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/planadjust/master/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/planadjust/master/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/planadjust/master/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/planadjust/master/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/planadjust/master/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/planadjust/master/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/planadjust/master/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/planadjust/master/workflow/approve',
        method: 'post'
    },
    // 校验项目是否存在主计划(存在返回true, 不存在返回false
    checkAreadyProject: {
        url: '/proprogress/planadjust/master/check/project/masterplanajust/exist',
        method: 'get'
    },
    // 查询项目下的主计划主表数据
    getProjectMainInfo: {
        url: '/proprogress/plan/master/byproject/list',
        method: 'get'
    },
    // 获取最初甘特图信息
    getInitGantt: {
        url: '/proprogress/planadjust/gant/init/masterplan',
        method: 'get'
    },
    // edit批量保存甘特图任务及连线信息
    // 初始化最新的进度信息
    initGantt: {
        url: '/proprogress/planadjust/gant/init/masterplan',
        method: 'get'
    },
    // 编辑
    batchGanttEdit: {
        url: '/proprogress/planadjust/gant/batch/edit',
        method: 'post',
        loading: true
    },
    // 保存甘特图任务及连线信息
    setGanttEdit: {
        url: '/proprogress/planadjust/gant/edit',
        method: 'post',
        loading: true
    },
    getLink: {
        url: '/proprogress/planadjust/link/target/list',
        method: 'get'
    },
    // 校验wbs的值是否存在(存在就返回true, 不存在就返回false)
    checkWbsExist: {
        url: '/proprogress/plan/gant/check/project/wbs/exist',
        method: 'get'
    }
};
