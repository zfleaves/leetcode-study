/*
 * @Author: your name
 * @Date: 2021-10-25 14:21:05
 * @LastEditTime: 2021-10-25 14:56:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\store\apiModules\basic\sporadicPurchaseGuration.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/promaterial/purchase/sporadic/config/page',
        method: 'get'
    },
    // 查询 paymentId
    getInfo: {
        url: '/promaterial/purchase/sporadic/config/info',
        method: 'get'
    },
    // 查询项目设置零星采购额度 paymentId
    getProjectQuotaInfo: {
        url: '/promaterial/purchase/sporadic/config/purchase/quota/byproject',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/purchase/sporadic/config/single/edit',
        method: 'post',
        loading: true
    },
    // 批量修改项目的零星采购的额度
    setBatchEdit: {
        url: '/promaterial/purchase/sporadic/config/batch/edit',
        method: 'post',
        loading: true
    },
    // 删除 paymentId
    setDelete: {
        url: '/promaterial/purchase/sporadic/config/delete',
        method: 'get'
    },
    // 项目启动
    getProjectStatusPage: {
        url: '/project/project/projectstatus/page',
        method: 'post'
    }
};
