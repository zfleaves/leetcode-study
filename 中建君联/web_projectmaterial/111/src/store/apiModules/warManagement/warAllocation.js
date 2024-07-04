/*
 * @Author: your name
 * @Date: 2020-08-05 10:17:16
 * @LastEditTime: 2020-08-11 09:24:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\warManagement\warAllocation.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/warehouse/allocation/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/warehouse/allocation/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/warehouse/allocation/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/warehouse/allocation/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/warehouse/allocation/details/delete',
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
        url: '/promaterial/warehouse/allocation/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/warehouse/allocation/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/warehouse/allocation/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/warehouse/allocation/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/warehouse/allocation/detail/export',
        method: 'get',
        isExport: true
    },
    // 查询供应中心仓库
    getSupplyWarehouseList: {
        url: '/supply/war/warehouse/list',
        method: 'get'
    }
};
