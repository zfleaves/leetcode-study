/*
 * @Author: your name
 * @Date: 2021-01-26 10:04:58
 * @LastEditTime: 2021-04-14 10:03:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\buildLog\buildLogUser.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/log/user/page',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/log/user/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/log/user/delete',
        method: 'get'
    },
    getProjectUserList: {
        url: '/proprogress/log/user/project/userids',
        method: 'get'
    }
};
