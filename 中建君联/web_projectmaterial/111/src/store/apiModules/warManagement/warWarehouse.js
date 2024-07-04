/*
 * @Author: your name
 * @Date: 2020-08-05 10:18:34
 * @LastEditTime: 2020-08-11 09:40:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\warManagement\warWarehouse.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/warehouse/page',
      method: 'post'
    },
    // 查询
    getInfo: {
        url: '/promaterial/warehouse/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/warehouse/edit',
        method: 'post',
        loading: true
    },
    // 删除
    setDelete: {
        url: '/promaterial/warehouse/delete',
        method: 'get'
    },
    // 改变仓库状态
    setStatus: {
        url: '/promaterial/warehouse/change/status',
        method: 'get'
    },
    chackWarehouseCode: {
        url: '/promaterial/warehouse/check/warehousecode',
        method: 'get'
    },
    chackWarehouseName: {
        url: '/promaterial/warehouse/check/warehousename',
        method: 'get'
    },
    // 实时计算物资不含税金额、含税金额、不含税单价、税额
    getCalculationAmount: {
        url: '/promaterial/warehouse/calculation/amount',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/warehouse/calculation/detail/export',
        method: 'get',
        isExport: true
    }
};
