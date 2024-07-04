/*
 * @Author: your name
 * @Date: 2020-07-23 10:24:31
 * @LastEditTime: 2021-08-17 11:11:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\basic\classifyWarehouse.js
 */
export default {
    // 查询物资分类
    getClassifyTree: {
      url: '/promaterial/basematerial/classify/tree',
      method: 'post'
    },
    // 物资一览查询物资分类
    getClassifyAccountTree: {
        url: '/promaterial/basematerial/classify/account/tree',
        method: 'post'
      },
    // 分类编号判重
    checkClassifycode: {
        url: '/promaterial/basematerial/classify/check/classifycode/exist',
      method: 'get'
    },
    // 查询物资分类详细信息 classifyId
    getClassifyInfo: {
        url: '/promaterial/basematerial/classify/info',
        method: 'get'
    },
    // 编辑物资分类
    setClassifyEdit: {
        url: '/promaterial/basematerial/classify/edit',
        method: 'post',
        loading: true
    },
    // 删除物资分类 classifyId
    setClassifyDelete: {
        url: '/promaterial/basematerial/classify/delete',
        method: 'get'
    },
    // 导出
    getExportData: {
        url: '/promaterial/basematerial/classify/exportExcel',
        method: 'post',
        isExport: true
    },
    // 导入分类
    setImportExcelData: {
        url: '/promaterial/basematerial/classify/importExcel',
        method: 'post'
    },
    // 校验物资分类及导入(导入返回true,反之返回false)
    checkClassifyMaterial: {
        url: '/promaterial/basematerial/classify/check/sync/classify',
        method: 'get'
    },
    // 是否能一键删除
    checkDeleteClassifyMaterial: {
        url: '/promaterial/basematerial/classify/check/delete/classify',
        method: 'get'
    },
    // 一键同步
    syncClassifyMaterial: {
        url: '/promaterial/basematerial/classify/sync/material/all',
        method: 'get',
        loading: true
    },
    // 一键删除
    deleteClassifyMaterial: {
        url: '/promaterial/basematerial/classify/delete/all',
        method: 'get',
        loading: true
    },
    // 下载模板
    classifyDownloadTemplate: {
        url: '/promaterial/basematerial/classify/download/template',
        method: 'get',
        isExport: true
    }
};
