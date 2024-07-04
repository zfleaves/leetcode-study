/*
 * @Author: your name
 * @Date: 2020-08-05 10:17:23
 * @LastEditTime: 2022-05-16 11:03:33
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\warManagement\warIncoming.js
 */
export default {
    // 查询入库单列表信息(冲回入库时弹框调用)
    getRushbackPageList: {
        url: '/promaterial/warehouse/incoming/rushback/page',
        method: 'post'
    },
    // 查询分页
    getPageList: {
      url: '/promaterial/warehouse/incoming/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/warehouse/incoming/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/warehouse/incoming/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/warehouse/incoming/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/warehouse/incoming/details/delete',
        method: 'post'
    },
    // 查询零星采购里面所有可以入库的明细数据 projectId
    getSporadicDetailList: {
        url: '/promaterial/purchase/sporadic/incoming/detail/list',
        method: 'get'
    },
    // 查询到货验收里面所有可以入库的明细数据 projectId
    getCheckarrivalDetailList: {
        url: '/promaterial/purchase/checkarrival/incoming/detail/list',
        method: 'get'
    },
    // 查询已经全部入库的零星采购明细数据
    getAlreadySporadicDetailList: {
        url: '/promaterial/purchase/sporadic/already/incoming/detail/list',
        method: 'get'
    },
    // 查询到货验收里面所有可以入库的明细数据 projectId
    getAlreadyCheckarrivalDetailList: {
        url: '/promaterial/purchase/checkarrival/already/incoming/detail/list',
        method: 'get'
    },
    // 查询仓库 projectId warehouseCode warehouseName
    getWarehouseList: {
        url: '/promaterial/warehouse/list',
        method: 'get'
    },
    // 查询多个物资的二维码
    getMaterialQrCodesList: {
        url: '/promaterial/warehouse/incoming/material/qrCodes',
        method: 'post'
    },
    // 打印数据
    printRelationData: {
        url: '/basic/print/relation/send/print/data',
        method: 'post'
    },
    // 获取企业绑定成功的打印机列表
    getPrintRelationList: {
        url: '/basic/print/relation/list',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/warehouse/incoming/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/warehouse/incoming/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/warehouse/incoming/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/warehouse/incoming/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/warehouse/incoming/detail/export',
        method: 'get',
        isExport: true
    },
    // POST 查询可以做退货的入库数据
    getIncomingRetrungoodsDetails: {
        url: '/promaterial/warehouse/incoming/retrungoods/details',
        method: 'post'
    }
};
