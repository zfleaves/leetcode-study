/*
 * @Author: your name
 * @Date: 2020-07-30 11:23:15
 * @LastEditTime: 2022-08-12 09:12:10
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\promaterial\supplyOrder.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/purchase/supplyorder/page',
      method: 'post'
    },
    // 分页查询品种往期填写暂估单价单据信息
    getPreviousPeriodPage: {
        url: '/promaterial/purchase/supplyorder/varieties/previous/period/page',
        method: 'get'
    },
    // 查询发货记录
    getDeliverList: {
        url: '/promaterial/purchase/supplyorder/deliver/customer/deliver/list',
        method: 'get'
    },
    // 查询发货单信息
    getDeliverInfo: {
        url: '/promaterial/purchase/supplyorder/deliver/deliver/info',
        method: 'get'
    },
    // 生成短信发送内容
    getRepublish: {
        url: '/promaterial/purchase/supplyorder/publish/republish',
        method: 'post'
    },
    // 根据长链接生成短链接
    generateShorturls: {
        url: '/promaterial/purchase/supplyorder/generate/shorturls',
        method: 'post'
    },
    // 发送短信
    getPublish: {
        url: '/promaterial/purchase/supplyorder/publish/publish',
        method: 'get'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/purchase/supplyorder/info',
        method: 'get'
    },
    // 查询该租户同一合同下供货订单总金额 contractId
    getContractInfo: {
        url: '/promaterial/purchase/supplyorder/totalamount/bycontract',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/purchase/supplyorder/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/purchase/supplyorder/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/purchase/supplyorder/details/delete',
        method: 'post'
    },
    // 分页查询定标报告信息(用于支出合同弹框选择)
    getInquiryReportContractPage: {
        url: '/inquire/inquiry/report/win/contract/page',
        method: 'post'
    },
    // 分页查询询价定标表列表(用于支出合同弹框选择)
    getInquiryCalibraContractPage: {
        url: '/inquire/inquire/calibra/win/contract/page',
        method: 'post'
    },
    // 查询供货订单模块可申请的需求计划
    getDemandSupplyOrder: {
        url: '/promaterial/demand/month/supply/order/plan',
        method: 'get'
    },
    // 查询材料采购合同的明细信息
    getContractSupplyOrder: {
        url: '/contract/expend/register/material/detail/list',
        method: 'get'
    },
    // 查询供货订单模块已经申请完且没有关闭的需求计划明细
    getHistoryDemandPurchaseApply: {
        url: '/promaterial/demand/month/already/supply/order/plan',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/purchase/supplyorder/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/purchase/supplyorder/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/purchase/supplyorder/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/purchase/supplyorder/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/purchase/supplyorder/detail/export',
        method: 'get',
        isExport: true
    },
    // 查询项目下有效的负责人列表信息
    getProjectLeaderValidInfo: {
        url: '/project/project/leader/valid/list',
        method: 'get'
    },
    // 导出送货通知单
    getExportExcel: {
        url: 'promaterial/purchase/supplyorder/merge/info/exportExcel',
        method: 'post',
        isExport: true
    }
};
