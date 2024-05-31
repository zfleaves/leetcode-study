/*
 * @Author: your name
 * @Date: 2021-01-25 16:05:31
 * @LastEditTime: 2022-02-21 15:29:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\confiManagement\projectCalendar.js
 */
export default {
    // 分页查询有权限且项目状态为已启动且未竣工的项目
    getProjectPermissonPage: {
        url: '/project/project/permission/page',
        method: 'post'
    },
    // 查询日历基本工作日设置信息
    getWorkList: {
        url: '/proprogress/baseconfig/calendar/list',
        method: 'get'
    },
    // 保存
    saveWork: {
        url: '/proprogress/baseconfig/calendar/edit',
        method: 'post',
        loading: true
    },
    // 查询日历基本工作日设置信息
    getExcludecalendarList: {
        url: '/proprogress/baseconfig/excludecalendar/list',
        method: 'get'
    },
    // 保存
    saveExcludecalendar: {
        url: '/proprogress/baseconfig/excludecalendar/edit',
        method: 'post',
        loading: true
    },
    // 查询日历基本工作日设置信息
    getWorktimeInfo: {
        url: '/proprogress/baseconfig/worktime/info',
        method: 'get'
    },
    // 保存
    saveWorktime: {
        url: '/proprogress/baseconfig/worktime/edit',
        method: 'post',
        loading: true
    }
};
