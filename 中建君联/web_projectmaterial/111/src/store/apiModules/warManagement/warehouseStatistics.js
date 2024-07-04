/*
 * @Author: your name
 * @Date: 2020-09-04 16:22:27
 * @LastEditTime: 2020-09-11 12:36:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\warManagement\warehouseStatistics.js
 */
export default {
    // 实时库存
    realTimeInventory: {
        url: '/promaterial/warehouse/stock/page',
        method: 'post'
    },
    realTimeInventoryExportData: {
      url: '/promaterial/warehouse/stock/exportExcel',
      method: 'post',
      isExport: true
    },
    // 出入库流水
    inAndOutFlow: {
      url: '/promaterial/warehouse/stock/flows/page',
      method: 'post'
    },
    inAndOutFlowExportData: {
      url: '/promaterial/warehouse/stock/flows/exportExcel',
      method: 'post',
      isExport: true
    },
    // 材料消耗
    materialConsumption: {
        url: '/promaterial/warehouse/outbound/pickingunit/page',
        method: 'post'
    },
    materialConsumptionExportData: {
      url: '/promaterial/warehouse/outbound/pickingunit/exportExcel',
      method: 'post',
      isExport: true
    }
};
