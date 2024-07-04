/*
 * @Author: your name
 * @Date: 2021-12-28 15:50:02
 * @LastEditTime: 2021-12-29 13:38:08
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_projectmaterial\src\store\apiModules\processExecutionTracking\sporadicPurchaseTracking.js
 */


export default {
    // 查询分页
    getPageList: {
        url: '/promaterial/purchase/sporadic/execute/main/situation/page',
        method: 'post'
    },
    // 更新状态
    updateOrderStatus: {
        url: '/promaterial/purchase/sporadic/update/sporadic/purchase/status',
        method: 'get'
    },
    // 导出
    getExportData: {
        url: '/promaterial/purchase/sporadic/execute/main/situation/exportExcel',
        method: 'post',
        isExport: true
    }
};
