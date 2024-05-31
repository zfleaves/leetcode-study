/*
 * @Author: your name
 * @Date: 2021-01-26 10:05:10
 * @LastEditTime: 2021-01-26 10:11:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\buildLog\buildLogType.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/log/type/page',
        method: 'post'
    },
    // 查询不分页
    getList: {
        url: '/proprogress/log/type/list',
        method: 'get'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/log/type/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/log/type/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/log/type/delete',
        method: 'get'
    },
    // 修改日志类型状态
    setStatus: {
        url: '/proprogress/log/type/update/logtype/status',
        method: 'get'
    },
    // 校验品种编号是否重复
    checkCode: {
        url: '/proprogress/log/type/check/logtypecode/exist',
        method: 'get'
    },
    // 校验品种编号是否重复
    checkName: {
        url: '/proprogress/log/type/check/logtypename/exist',
        method: 'get'
    }
};
