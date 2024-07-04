/*
 * @Author: your name
 * @Date: 2020-08-05 10:18:22
 * @LastEditTime: 2020-08-10 20:18:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\warManagement\warReturngoods.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/warehouse/returngoods/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/warehouse/returngoods/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/warehouse/returngoods/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/warehouse/returngoods/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/warehouse/returngoods/details/delete',
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
        url: '/promaterial/warehouse/returngoods/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/warehouse/returngoods/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/warehouse/returngoods/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/warehouse/returngoods/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/warehouse/returngoods/detail/export',
        method: 'get',
        isExport: true
    }
};
