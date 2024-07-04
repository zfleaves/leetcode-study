/*
 * @Author: your name
 * @Date: 2021-12-28 15:51:40
 * @LastEditTime: 2022-05-24 10:28:03
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_projectmaterial\src\store\apiModules\processExecutionTracking\receiptTracking.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/promaterial/warehouse/incoming/execute/situation/page',
        method: 'post'
    },
    // 导出
    getExportData: {
        url: '/promaterial/warehouse/incoming/execute/situation/exportExcel',
        method: 'post',
        isExport: true
    },
    // 批量查询入库单明细数据列表
    getIncomingDetailsList: {
        url: '/promaterial/warehouse/incoming/details/list',
        method: 'post'
    }
};
