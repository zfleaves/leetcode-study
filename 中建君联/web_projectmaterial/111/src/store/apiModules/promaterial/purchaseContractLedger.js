/*
 * @Author: your name
 * @Date: 2020-08-13 11:15:36
 * @LastEditTime: 2020-08-14 11:51:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\promaterial\purchaseContractLedger.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/purchase/payment/expendcontract/page/classify',
      method: 'post'
    },
    // 查询 paymentId
    getInfo: {
        url: '/contract/v1/expend/register/info',
        method: 'get'
    },
    getExportData: {
      url: '/promaterial/purchase/payment/exportExcel',
      method: 'post',
      isExport: true
    }
};
