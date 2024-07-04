/*
 * @Author: your name
 * @Date: 2021-04-19 11:16:48
 * @LastEditTime: 2021-04-19 18:17:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\subcontractorMaterial\materialParameter.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/subcontracts/enter/summary/page',
      method: 'post'
    },
    // 导出
    getExportExcel: {
        url: '/promaterial/subcontracts/enter/summary/exportExcel',
        method: 'post',
        isExport: true
    }
};
