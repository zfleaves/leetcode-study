/*
 * @Author: your name
 * @Date: 2020-07-30 11:21:53
 * @LastEditTime: 2022-04-26 14:25:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\promaterial\checkArrival.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/purchase/checkarrival/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/purchase/checkarrival/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/purchase/checkarrival/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/purchase/checkarrival/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/purchase/checkarrival/details/delete',
        method: 'post'
    },
    // 查询可以申请到(未完成)货验收的供货订单信息列表
    getSupplyorderCheckarival: {
        url: '/promaterial/purchase/supplyorder/not/checkarival/list',
        method: 'get'
    },
    // 查询可以申请到货验收的供货订单信息列表
    getHistorySupplyorderCheckarival: {
        url: '/promaterial/purchase/supplyorder/already/checkarival/list',
        method: 'get'
    },
    // 查询供货订单可到货验收的数据 supplyOrderId varietiesName
    getSupplyorderCheckarivalDetailList: {
        url: '/promaterial/purchase/supplyorder/checkarival/detail/list',
        method: 'get'
    },
    // 查询已经确认发货过的的供货订单明细信息
    getSupplyorderDeliverDetailList: {
        url: '/promaterial/purchase/supplyorder/already/deliver/detail/list',
        method: 'post'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/purchase/checkarrival/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/purchase/checkarrival/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/purchase/checkarrival/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/purchase/checkarrival/workflow/approve',
        method: 'post'
    },
     // 导出明细
    exportDetail: {
        url: '/promaterial/purchase/checkarrival/detail/export',
        method: 'get',
        isExport: true
    },
    // GET 查询可以快速入库的到货验收明细数据
    checkarrivalIncomeDetails: {
        url: '/promaterial/purchase/checkarrival/single/fast/incoming/detail/list',
        method: 'get',
        loading: true
    }
};
