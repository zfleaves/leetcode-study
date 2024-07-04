/*
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-10-20 16:13:49
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-10-20 16:14:22
 * @FilePath: \web_projectmaterial\src\store\apiModules\promaterial\materialPaymentSupplier.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/purchase/payment/approve/page',
      method: 'post'
    },
    // 查询 paymentId
    getInfo: {
        url: '/promaterial/purchase/payment/approve/info',
        method: 'get'
    },
    // 查询 paymentId
    getContractInfo: {
        url: 'contract/expend/register/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/purchase/payment/approve/edit',
        method: 'post',
        loading: true
    },
    // 删除 paymentId
    setDelete: {
        url: '/promaterial/purchase/payment/approve/delete',
        method: 'get'
    },
    // 查询项目的累计已经支付金额
    getPaymentTotalamount: {
        url: '/promaterial/v1/purchase/payment/approve/project/totalamount',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/purchase/payment/approve/steptask/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/purchase/payment/approve/steptask/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/purchase/payment/approve/steptask/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/purchase/payment/approve/steptask/approve',
        method: 'post'
    },
    // 清除流程相关信息
    clearSteptaskInfo: {
        url: '/prolabour/purchase/payment/approve/clear/steptask/info',
        method: 'get'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/purchase/payment/detail/export',
        method: 'get',
        isExport: true
    }
};
