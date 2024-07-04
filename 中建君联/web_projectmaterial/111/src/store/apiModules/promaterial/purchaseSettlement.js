/*
 * @Author: your name
 * @Date: 2020-08-12 16:27:56
 * @LastEditTime: 2022-08-02 14:28:26
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\promaterial\purchaseSettlement.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/purchase/settlement/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/purchase/settlement/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/purchase/settlement/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/purchase/settlement/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/purchase/settlement/details/delete',
        method: 'post'
    },
    // 获取发票
    getInvoiceList: {
        url: '/contract/v1/expend/register/list/by/project',
        method: 'get'
    },
    // 查询可以结算的入库明细
    getIncomingList: {
        url: '/promaterial/warehouse/incoming/settlement/details',
        method: 'get'
    },
    // 查询可以结算的退货单明细数据
    getReturngoodsList: {
        url: '/promaterial/warehouse/returngoods/settlement/details',
        method: 'get'
    },
    // 更新结算单关联的发票信息
    updateRelationInvoices: {
        url: '/promaterial/purchase/settlement/update/relation/invoices',
        method: 'post'
    },
    // 下载模板
    getDownloadTemplate: {
        url: '/promaterial/purchase/settlement/download/detail/template',
        method: 'get',
        isExport: true
    },
    // 查询项目的总结算金额
    getSettlementTotalamount: {
        url: '/promaterial/v1/purchase/settlement/project/totalamount',
        method: 'get'
    },
    // 查询项目总的目标成本统计数据
    getProcostAccountInfo: {
        url: '/procost/cost/account/info',
        method: 'post'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/purchase/settlement/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/purchase/settlement/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/purchase/settlement/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/purchase/settlement/workflow/approve',
        method: 'post'
    },
   // 导出明细
    exportDetail: {
        url: '/promaterial/purchase/settlement/detail/export',
        method: 'get',
        isExport: true
    },
    // 累计已收票
    getInvoicePage: {
        url: '/contract/expend/invoice/page',
        method: 'post'
    }
};
