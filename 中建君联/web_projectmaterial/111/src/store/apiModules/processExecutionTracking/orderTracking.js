/*
 * @Author: your name
 * @Date: 2021-04-07 11:23:13
 * @LastEditTime: 2021-04-09 11:56:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\store\apiModules\processExecutionTracking\orderTracking.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/promaterial/purchase/supplyorder/status/manager/page',
        method: 'post'
    },
    // 更新对应供货订单的状态
    updateOrderStatus: {
        url: '/promaterial/purchase/supplyorder/update/supply/status',
        method: 'get'
    },
    // 强制更新对应供货订单的状态
    forceUpdateOrderStatus: {
        url: '/promaterial/purchase/supplyorder/force/update/supply/status',
        method: 'get'
    },
    // 导出
    getExportData: {
        url: '/promaterial/purchase/supplyorder/status/manager/exportExcel',
        method: 'post',
        isExport: true
    }
};

