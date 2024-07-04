/*
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-07-18 15:18:56
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-07-18 16:43:58
 * @FilePath: \web_projectmaterial\src\store\apiModules\processExecutionTracking\sporadicPurchaseWarTracking.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
    // 查询分页
    getPageList: {
        url: '/promaterial/purchase/sporadic/page',
        method: 'post'
    },
    // 更新状态
    updateOrderStatus: {
        url: '/promaterial/purchase/sporadic/update/incoming/status',
        method: 'get'
    },
    // 导出
    getExportData: {
        url: '/promaterial/purchase/sporadic/incoming/exportExcel',
        method: 'post',
        isExport: true
    }
};
