/*
 * @Author: your name
 * @Date: 2021-01-28 09:13:24
 * @LastEditTime: 2022-03-02 16:11:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demMaster\demMasterPlan.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/plan/master/page',
        method: 'post'
    },
    // 查询项目执行分页
    getPageExecuteList: {
        url: '/proprogress/plan/master/execute/details',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/plan/master/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/plan/master/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/plan/master/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/plan/master/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/plan/master/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/plan/master/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/plan/master/workflow/approve',
        method: 'post'
    },
    // 校验项目是否存在主计划(存在返回true, 不存在返回false
    checkAreadyProject: {
        url: '/proprogress/plan/master/check/project/masterplan/exist',
        method: 'get'
    },
    // edit批量保存甘特图任务及连线信息
    // 编辑
    batchGanttEdit: {
        url: '/proprogress/plan/gant/batch/edit',
        method: 'post',
        loading: true
    },
    // 保存甘特图任务及连线信息
    setGanttEdit: {
        url: '/proprogress/plan/gant/edit',
        method: 'post',
        loading: true
    },
    getLink: {
        url: '/proprogress/plan/link/target/list',
        method: 'get'
    },
    // 校验wbs的值是否存在(存在就返回true, 不存在就返回false)
    checkWbsExist: {
        url: '/proprogress/plan/gant/check/project/wbs/exist',
        method: 'get'
    },
    // 查询项目执行分页
    getPageHistoryList: {
        url: '/proprogress/planmaster/bak/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getHistoryInfo: {
        url: '/proprogress/planmaster/bak/info',
        method: 'get'
    },

    // 预算数据
    // 人工预算
    getProjectMasterLaboursInfo: {
        url: '/prolabour/budget/project/info',
        method: 'get'
    },
    // 材料预算
    getProjectMasterMaterialsInfo: {
        url: '/promaterial/demand/master/project/detials',
        method: 'get'
    },
    // 机械预算
    getProjectMasterMachineriesInfo: {
        url: '/promachinery/demand/master/project/detials',
        method: 'get'
    },
    // 其他策划
    getProjectMasterProoverInfo: {
        url: '/proover/master/plan/project/detials',
        method: 'get'
    },
    // 工程量及资源信息
    // 删除甘特图对应的工程量及资源信息
    deleteResourceDetail: {
        url: '/proprogress/plan/gant/resource/delete',
        method: 'get'
    },
    // 下载甘特图工程量及资源信息明细模板
    downloadResourceDetailTemplate: {
        url: '/proprogress/plan/gant/resource/download/resource/detail/template',
        method: 'get',
        isExport: true,
        loading: true
    },
    // 新增、修改甘特图对应的工程量及资源信息
    editResourceDetail: {
        url: '/proprogress/plan/gant/resource/edit',
        method: 'post',
        loading: true
    },
    // 新增、修改甘特图对应的工程量及资源信息
    batchEditResourceDetail: {
        url: '/proprogress/plan/gant/resource/batch/edit',
        method: 'post',
        loading: true
    },
    // 查询甘特图对应的工程量及资源详细信息
    getResourceDetailInfo: {
        url: '/proprogress/plan/gant/resource/info',
        method: 'get'
    },
    // 查询甘特图对应的工程量及资源信息列表(不分页)
    getResourceDetailList: {
        url: '/proprogress/plan/gant/resource/list',
        method: 'get'
    },
    // 查询甘特图对应的工程量及资源信息列表(分页)
    getResourceDetailPage: {
        url: '/proprogress/plan/gant/resource/page',
        method: 'get'
    },
    // 查询甘特图对应的工程量及资源信息列表(分页)
    getPlanLogList: {
        url: '/proprogress/plan/master/byproject/log/list',
        method: 'get'
    },
    // 查询项目下的主计划主表数据(月度计划使用)
    getPlanMonthList: {
        url: '/proprogress/plan/master/byproject/month/list',
        method: 'get'
    },
    // 查询项目下的主计划主表数据(周计划使用)
    getPlanWeekList: {
        url: '/proprogress/plan/master/byproject/week/list',
        method: 'get'
    }
};
