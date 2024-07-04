/*
 * @Author: your name
 * @Date: 2020-08-05 10:18:46
 * @LastEditTime: 2020-08-07 15:29:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\warManagement\warWarehouseShelves.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/warehouse/shelves/page',
      method: 'post'
    },
    // 查询
    getInfo: {
        url: '/promaterial/warehouse/shelves/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/warehouse/shelves/edit',
        method: 'post',
        loading: true
    },
    // 删除
    setDelete: {
        url: '/promaterial/warehouse/shelves/delete',
        method: 'get'
    },
    chackWarehouseShelvesCode: {
        url: '/promaterial/warehouse/shelves/check/warehouse/shelvescode',
        method: 'get'
    },
    chackWarehouseShelvesName: {
        url: '/promaterial/warehouse/shelves/check/warehouse/shelvesname',
        method: 'get'
    }
};
