/*
 * @Author: your name
 * @Date: 2020-08-05 10:18:13
 * @LastEditTime: 2020-08-10 13:39:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\warManagement\warReturn.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/warehouse/return/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/warehouse/return/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/warehouse/return/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/warehouse/return/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/warehouse/return/details/delete',
        method: 'post'
    },
    // 查询可以退回的出库单列表信息
    getWarehouseOutboundMaterialsList: {
        url: '/promaterial/warehouse/outbound/return/details/list',
        method: 'get'
    },
    // 查询仓库 projectId warehouseCode warehouseName
    getWarehouseList: {
        url: '/promaterial/warehouse/list',
        method: 'get'
    },
    // 获取领用单位
    getUnitList: {
        url: '/project/unit/page',
        method: 'post'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/warehouse/return/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/warehouse/return/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/warehouse/return/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/warehouse/return/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/warehouse/return/detail/export',
        method: 'get',
        isExport: true
    }
};
