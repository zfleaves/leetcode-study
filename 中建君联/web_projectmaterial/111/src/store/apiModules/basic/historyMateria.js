/*
 * @Author: your name
 * @Date: 2021-11-11 17:38:40
 * @LastEditTime: 2021-11-12 10:10:36
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_projectmaterial-项目材料管理\src\store\apiModules\basic\historyMateria.js
 */

export default {
    // 查询物资分类
    getVarietiesPage: {
        url: '/promaterial/basematerial/history/detail/page',
        method: 'post'
    },
    // 查询物资分类详细信息 materialHistoryId
    getVarietiesInfo: {
        url: '/promaterial/basematerial/history/detail/info',
        method: 'get'
    },
    // 编辑物资分类
    setVarietiesEdit: {
        url: '/promaterial/basematerial/history/detail/edit',
        method: 'post',
        loading: true
    },
    // 批量删除
    deletaBatchVarieties: {
        url: '/promaterial/basematerial/history/detail/batch/delete',
        method: 'post',
        loading: true
    },
    // 删除物资分类 materialHistoryId
    setVarietiesDelete: {
        url: '/promaterial/basematerial/history/detail/delete',
        method: 'get'
    },
    // 导出
    getExportData: {
        url: '/promaterial/basematerial/history/detail/exportExcel',
        method: 'post',
        isExport: true
    },
    // 材料品种库模板下载
    varietiesDownloadTemplate: {
        url: '/promaterial/basematerial/history/detail/download/template',
        method: 'get',
        isExport: true
    },
    // 材料品种库导入
    varietiesImportExcel: {
        url: '/promaterial/basematerial/history/detail/detail/importExcel',
        method: 'post'
    }
};
