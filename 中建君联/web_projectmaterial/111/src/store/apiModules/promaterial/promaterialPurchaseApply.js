/*
 * @Author: your name
 * @Date: 2020-07-30 11:22:10
 * @LastEditTime: 2021-04-14 09:59:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\promaterial\promaterialPurchaseApply.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/purchase/apply/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/purchase/apply/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/purchase/apply/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/purchase/apply/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/purchase/apply/details/delete',
        method: 'post'
    },
    // 查询采购申请模块可申请的需求计划
    getDemandPurchaseApply: {
        url: '/promaterial/demand/month/purchase/apply/plan',
        method: 'get'
    },
    // 查询采购申请模块已经申请完且没有关闭的需求计划明细
    getHistoryDemandPurchaseApply: {
        url: '/promaterial/demand/month/already/purchase/apply/plan',
        method: 'get'
    },
    // 施工总预算
    getDemandVarieties: {
        url: '/promaterial/demand/master/project/purchase/detials',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/purchase/apply/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/purchase/apply/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/purchase/apply/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/purchase/apply/workflow/approve',
        method: 'post'
    },
   // 导出明细
    exportDetail: {
        url: '/promaterial/purchase/apply/detail/export',
        method: 'get',
        isExport: true
    },
    // 分页查询品种往期填写拟采购单价单据信息
    getPreviousPeriodPage: {
        url: '/promaterial/purchase/apply/varieties/previous/period/page',
        method: 'get'
    }
};
