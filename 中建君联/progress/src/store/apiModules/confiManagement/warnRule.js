/*
 * @Author: your name
 * @Date: 2021-01-26 17:42:46
 * @LastEditTime: 2021-01-29 16:27:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\confiManagement\warnRule.js
 */
export default {
    // 分页查询有权限且项目状态为已启动且未竣工的项目
    getProjectPermissonPage: {
        url: '/project/project/permission/page',
        method: 'post'
    },
    // 配置管理-预警规则-偏差允许值设置
    getDeviationList: {
        url: '/proprogress/baseconfig/warnrule/deviation/list',
        method: 'get'
    },
    // 保存
    saveDeviation: {
        url: '/proprogress/baseconfig/warnrule/deviation/edit',
        method: 'post',
        loading: true
    },
    // 配置管理- 预警规则 - 预警对象设置
    getUserList: {
        url: '/proprogress/baseconfig/warnrule/user/page',
        method: 'get'
    },
    // 查询该项目下的所有预警对象人员
    getProjectUserList: {
        url: '/proprogress/baseconfig/warnrule/user/project/userids',
        method: 'get'
    },
    // 删除
    deleteUser: {
        url: '/proprogress/baseconfig/warnrule/user/delete',
        method: 'get'
    },
    // 保存
    saveUser: {
        url: '/proprogress/baseconfig/warnrule/user/edit',
        method: 'post',
        loading: true
    },
    // 配置管理-预警规则-预警方式设置
    getMethodList: {
        url: '/proprogress/baseconfig/warnrule/method/list',
        method: 'get'
    },
    // 保存
    saveMethod: {
        url: '/proprogress/baseconfig/warnrule/method/edit',
        method: 'post',
        loading: true
    },
    // 配置管理-预警规则-预警方式设置
    getTimeList: {
        url: '/proprogress/baseconfig/warnrule/time/list',
        method: 'get'
    },
    // 保存
    saveTime: {
        url: '/proprogress/baseconfig/warnrule/time/edit',
        method: 'post',
        loading: true
    }
};
