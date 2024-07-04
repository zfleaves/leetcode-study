/*
 * @Author: your name
 * @Date: 2020-07-23 10:24:47
 * @LastEditTime: 2022-03-16 14:16:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\basic\materialVarieties.js
 */
export default {
    // 查询物资分类
    getVarietiesPage: {
      url: '/promaterial/basematerial/varieties/page',
      method: 'post'
    },
    // 更新状态
    updateVarietitesStatus: {
      url: '/promaterial/basematerial/varieties/update/varietites/status',
      method: 'get'
    },
    // 判重
    checkVarietitesRepeat: {
        url: '/promaterial/basematerial/varieties/check/single/varietitesname/repeat',
        method: 'get'
    },
    // 批量删除
    deletaBatchVarieties: {
        url: '/promaterial/basematerial/varieties/batch/delete',
        method: 'post',
        loading: true
    },
    // 查询物资分类详细信息 classifyId
    getVarietiesInfo: {
        url: '/promaterial/basematerial/varieties/info',
        method: 'get'
    },
    // 编辑物资分类
    setVarietiesEdit: {
        url: '/promaterial/basematerial/varieties/edit',
        method: 'post',
        loading: true
    },
    // 绑定分类
    setBindClassify: {
        url: '/promaterial/basematerial/varieties/bind/classify',
        method: 'post'
    },
    // 删除物资分类 classifyId
    setVarietiesDelete: {
        url: '/promaterial/basematerial/varieties/delete',
        method: 'get'
    },
    // 导出
    getExportData: {
        url: '/promaterial/basematerial/varieties/exportExcel',
        method: 'post',
        isExport: true
    },
    // 材料品种库模板下载
    varietiesDownloadTemplate: {
        url: '/promaterial/basematerial/varieties/download/template',
        method: 'get',
        isExport: true
    },
    // 材料品种库导入
    varietiesImportExcel: {
        url: '/promaterial/basematerial/varieties/importExcel',
        method: 'post'
    },
    // 校验是否能一键删除
    checkDeleteAllVarieties: {
        url: '/promaterial/basematerial/varieties/check/all/varietites',
        method: 'get'
    },
    // 一键清除
    deleteAllVarieties: {
        url: '/promaterial/basematerial/varieties/delete/all',
        method: 'get'
    },
    // 校验单一品种是否能删除
    checkDeleteVarieties: {
        url: '/promaterial/basematerial/varieties/check/single/varietites',
        method: 'get'
    },
    // 校验品种编号是否重复
    checkVarietitescode: {
        url: '/promaterial/basematerial/varieties/check/single/varietitescode/repeat',
        method: 'get'
    },
    // 根据id查询品种集合数据
    getReferencePrice: {
        url: '/promaterial/basematerial/varieties/ids/list',
        method: 'post'
    }
};
