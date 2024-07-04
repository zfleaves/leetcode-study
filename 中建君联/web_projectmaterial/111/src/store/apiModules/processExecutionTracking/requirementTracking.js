/*
 * @Author: your name
 * @Date: 2021-04-07 11:23:07
 * @LastEditTime: 2021-04-09 11:57:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\store\apiModules\processExecutionTracking\requirementTracking.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/promaterial/demand/month/manager/status/plan/page',
        method: 'post'
    },
    // 更新需求计划状态
    updateOrderStatus: {
        url: '/promaterial/demand/month/update/plan/status',
        method: 'get'
    },
    // 强制更新需求计划状态
    forceUpdateOrderStatus: {
        url: '/promaterial/demand/month/force/update/plan/status',
        method: 'get'
    },
    // 导出
    getExportData: {
        url: '/promaterial/demand/month/manager/status/plan/exportExcel',
        method: 'post',
        isExport: true
    }
};
