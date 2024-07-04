/*
 * @Author: your name
 * @Date: 2020-07-30 11:22:17
 * @LastEditTime: 2022-04-26 14:41:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\promaterial\sporadicPurchase.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/purchase/sporadic/page',
      method: 'post'
    },
    // 分页查询品种往期填写暂估单价单据信息
    getPreviousPeriodPage: {
        url: '/promaterial/purchase/sporadic/varieties/previous/period/page',
        method: 'get'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/purchase/sporadic/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/purchase/sporadic/edit',
        method: 'post',
        loading: true
    },
    // 根据项目id查询对应的零星采购申请列表信息
    getSporadicPurchaseList: {
        url: '/promaterial/purchase/sporadic/sporadic/list/by/projectid',
        method: 'post'
    },
    // 查询可以快速入库的零星采购数据
    sporadicPurchaseIncomeDetails: {
        url: '/promaterial/purchase/sporadic/single/fast/incoming/detail/list',
        method: 'get',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/purchase/sporadic/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/purchase/sporadic/details/delete',
        method: 'post'
    },
    // 查询零星需求模块可申请的需求计划
    getSporadic: {
        url: '/promaterial/demand/month/sporadic/purchase/plan',
        method: 'get'
    },
    // 获取历史需求计划明细
    getHistoryDemandPurchaseApply: {
        url: '/promaterial/demand/month/already/sporadic/purchase/plan',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/purchase/sporadic/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/purchase/sporadic/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/purchase/sporadic/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/purchase/sporadic/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/purchase/sporadic/detail/export',
        method: 'get',
        isExport: true
    }
};
