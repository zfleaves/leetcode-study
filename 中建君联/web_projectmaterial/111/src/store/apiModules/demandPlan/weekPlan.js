/*
 * @Author: your name
 * @Date: 2020-07-24 16:38:37
 * @LastEditTime: 2022-05-23 09:08:21
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\demandPlan\weekPlan.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/demand/week/page',
      method: 'post'
    },
    // 查询 weekPlanId
    getInfo: {
        url: '/promaterial/demand/week/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/demand/week/edit',
        method: 'post',
        loading: true
    },
    // 删除 weekPlanId
    setDelete: {
        url: '/promaterial/demand/week/delete',
        method: 'get'
    },
    // 删除明细 weekPlanDetailIds
    setDeleteDetails: {
        url: '/promaterial/demand/week/details/delete',
        method: 'post'
    },
    // 查询项目的总预算主表数据 projectId
    getProjectInfo: {
        url: '/promaterial/demand/master/project/info',
        method: 'get'
    },
    // 校验项目是否做周计划(有返回true,没有返回false)
    checkWeekplan: {
        url: '/promaterial/demand/week/check/weekplan',
        method: 'get'
    },
    // 预算内
    getInnerDetials: {
        url: '/promaterial/demand/master/project/inner/detials',
        method: 'get'
    },
    // 预算外
    getOuterDetials: {
        url: '/promaterial/demand/master/project/outer/detials',
        method: 'post'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/demand/week/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/demand/week/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/demand/week/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/demand/week/workflow/approve',
        method: 'post'
    },
     // 导出明细
    exportDetail: {
        url: '/promaterial/demand/week/detail/export',
        method: 'get',
        isExport: true
    }
};
