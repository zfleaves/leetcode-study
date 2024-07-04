/*
 * @Author: your name
 * @Date: 2020-07-24 16:38:08
 * @LastEditTime: 2021-11-23 10:26:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\demandPlan\quarterPlan.js
 */
export default {
    // 查询可以做季度预算的总预算数据接口
    getDemandQuarterList: {
        url: '/promaterial/demand/master/quarter/list',
        method: 'post'
    },
    // 查询分页
    getPageList: {
      url: '/promaterial/demand/quarter/page',
      method: 'post'
    },
    // 查询 quarterPlanId
    getInfo: {
        url: '/promaterial/demand/quarter/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/demand/quarter/edit',
        method: 'post',
        loading: true
    },
    // 删除 quarterPlanId
    setDelete: {
        url: '/promaterial/demand/quarter/delete',
        method: 'get'
    },
    // 删除明细 quarterPlanDetailIds
    setDeleteDetails: {
        url: '/promaterial/demand/quarter/details/delete',
        method: 'post'
    },
    // 查询项目的总预算主表数据 projectId
    getProjectInfo: {
        url: '/promaterial/demand/master/project/info',
        method: 'get'
    },
    // 校验项目是否做季计划(有返回true,没有返回false)
    checkQuarterplan: {
        url: '/promaterial/demand/quarter/check/quarterplan',
        method: 'get'
    },
    // 分页查询物资品种信息列表(模糊匹配) projectId varietiesName
    getVarietiesVaguePage: {
        url: '/promaterial/demand/master/project/yearquarter/detials',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/demand/quarter/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/demand/quarter/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/demand/quarter/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/demand/quarter/workflow/approve',
        method: 'post'
    },
     // 导出明细
    exportDetail: {
        url: '/promaterial/demand/quarter/detail/export',
        method: 'get',
        isExport: true
    }
};
