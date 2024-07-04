/*
 * @Author: your name
 * @Date: 2020-07-30 11:22:02
 * @LastEditTime: 2022-08-02 14:59:31
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\promaterial\paymentApply.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/purchase/payment/page',
      method: 'post'
    },
    // 查询 paymentId
    getInfo: {
        url: '/promaterial/purchase/payment/info',
        method: 'get'
    },
    // 查询 paymentId
    getContractInfo: {
        url: 'contract/expend/register/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/purchase/payment/edit',
        method: 'post',
        loading: true
    },
    // 删除 paymentId
    setDelete: {
        url: '/promaterial/purchase/payment/delete',
        method: 'get'
    },
    // 查询项目的累计已经支付金额
    getPaymentTotalamount: {
        url: '/promaterial/v1/purchase/payment/project/totalamount',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/purchase/payment/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/purchase/payment/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/purchase/payment/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/purchase/payment/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/purchase/payment/detail/export',
        method: 'get',
        isExport: true
    }
};
