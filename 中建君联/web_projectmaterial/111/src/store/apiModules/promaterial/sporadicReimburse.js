/*
 * @Author: your name
 * @Date: 2020-07-30 11:22:26
 * @LastEditTime: 2021-11-25 16:30:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\promaterial\sporadicReimburse.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/purchase/reimburse/page',
      method: 'post'
    },
    // 查询 sporadicPurchaseId
    getInfo: {
        url: '/promaterial/purchase/reimburse/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/purchase/reimburse/edit',
        method: 'post',
        loading: true
    },
    // 更新发票附件字段
    updateAttachment: {
        url: '/promaterial/purchase/reimburse/update/attachment',
        method: 'get'
    },
    // 删除 sporadicPurchaseId
    setDelete: {
        url: '/promaterial/purchase/reimburse/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/purchase/reimburse/details/delete',
        method: 'post'
    },
    // 根据项目id查询对应的零星采购申请列表信息
    getSporadicPurchaseList: {
        url: '/promaterial/purchase/sporadic/sporadic/list/by/projectid',
        method: 'post'
    },
    // 获取零星采购明细
    getPurchaseDetail: {
        url: '/promaterial/purchase/sporadic/can/reimburse/detail/list',
        method: 'post'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/purchase/reimburse/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/purchase/reimburse/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/purchase/reimburse/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/purchase/reimburse/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/purchase/reimburse/detail/export',
        method: 'get',
        isExport: true
    },
    // 查询对应员工帐户号
    getPersonnelAccount: {
        url: '/bff/baseconfig/personnel/account/list',
        method: 'get'
    }
};
