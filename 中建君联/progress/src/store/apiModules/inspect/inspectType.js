/*
 * @Author: your name
 * @Date: 2021-01-26 10:17:32
 * @LastEditTime: 2021-01-26 10:20:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\inspect\inspectType.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/inspect/type/page',
        method: 'post'
    },
    // 查询不分页
    getList: {
        url: '/proprogress/inspect/type/list',
        method: 'get'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/inspect/type/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/inspect/type/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/inspect/type/delete',
        method: 'get'
    },
    // 修改日志类型状态
    setStatus: {
        url: '/proprogress/inspect/type/update/inspecttype/status',
        method: 'get'
    },
    // 校验品种编号是否重复
    checkCode: {
        url: '/proprogress/inspect/type/check/inspectcode/exist',
        method: 'get'
    },
    // 校验品种编号是否重复
    checkName: {
        url: '/proprogress/inspect/type/check/inspectname/exist',
        method: 'get'
    }
};

