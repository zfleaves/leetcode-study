/*
 * @Author: your name
 * @Date: 2020-08-05 10:18:03
 * @LastEditTime: 2020-08-10 19:00:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\warManagement\warReportloss.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/warehouse/reportloss/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/warehouse/reportloss/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/warehouse/reportloss/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/warehouse/reportloss/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/warehouse/reportloss/details/delete',
        method: 'post'
    },
    // 实时查询库存信息
    getWarehouseStockMaterialsList: {
        url: '/promaterial/warehouse/stock/materials/list',
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
        url: '/promaterial/warehouse/reportloss/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/warehouse/reportloss/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/warehouse/reportloss/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/warehouse/reportloss/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/warehouse/reportloss/detail/export',
        method: 'get',
        isExport: true
    }
};
