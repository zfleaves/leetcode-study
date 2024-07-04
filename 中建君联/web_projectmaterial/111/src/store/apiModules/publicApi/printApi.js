/*
 * @Author: your name
 * @Date: 2020-08-24 09:49:18
 * @LastEditTime: 2021-02-20 10:03:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\publicApi\printApi.js
 */
export default {
    // 打印模板配置
    createPrint: {
        url: '/basic/print/tenant/model/create',
        method: 'post'
    },
    // 获取企业配置的打印显示字段
    getPrintDetail: {
        url: '/basic/print/tenant/model/detail',
        method: 'get'
    },
    // 获取企业打印模版列表
    getPrintList: {
        url: '/basic/print/tenant/model/page',
        method: 'post'
    },
    // 恢复初始设置
    resetPrint: {
        url: '/basic/print/tenant/model/reset',
        method: 'get'
    },
    // 获取打印模版字段的排序
    getPrintSort: {
        url: '/basic/print/tenant/model/sort',
        method: 'get'
    },
    // 获取打印模版的foot字段（全部节点）
    getPrintFoot: {
        url: '/basic/print/tenant/model/foots',
        method: 'get'
    },
    // 打印时获取打印模版的foot字段(已审批节点)
    getPrintTaskFoot: {
        url: '/basic/print/tenant/model/task/foots',
        method: 'get'
    },
    // 获取签名数据
    getPrintFootAssignees: {
        url: '/basic/print/tenant/model/foot/assignees',
        method: 'post'
    }
};


