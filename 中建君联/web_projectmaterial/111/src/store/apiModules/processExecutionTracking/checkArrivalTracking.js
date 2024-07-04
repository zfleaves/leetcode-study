/*
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-05-24 14:09:35
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-05-24 14:10:19
 * @FilePath: \web_projectmaterial\src\store\apiModules\processExecutionTracking\checkArrivalTracking.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
    // 查询分页
    getPageList: {
        url: '/promaterial/purchase/checkarrival/page',
        method: 'post'
    },
    // 导出
    getExportData: {
        url: '/promaterial/purchase/checkarrival/exportExcel',
        method: 'post',
        isExport: true
    }
};
