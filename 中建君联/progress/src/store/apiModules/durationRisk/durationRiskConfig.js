/*
 * @Author: your name
 * @Date: 2021-04-14 09:42:19
 * @LastEditTime: 2021-04-25 15:18:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\durationRisk\durationRiskConfig.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/durationrisk/config/page',
        method: 'post'
    },
    // 查询不分页
    getList: {
        url: '/proprogress/durationrisk/config/list',
        method: 'get'
    },
    // 查询 riskConfigId
    getInfo: {
        url: '/proprogress/durationrisk/config/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/durationrisk/config/edit',
        method: 'post',
        loading: true
    },
    // 删除 riskConfigId
    setDelete: {
        url: '/proprogress/durationrisk/config/delete',
        method: 'get'
    },
    // 修改状态
    setStatus: {
        url: '/proprogress/durationrisk/config/update/status',
        method: 'get'
    },
    // 校验排序
    checkSorts: {
        url: '/proprogress/durationrisk/config/check/sorts/repeat',
        method: 'get'
    },
    // 获取排序最大值
    getSortsMax: {
        url: '/proprogress/durationrisk/config/max/sorts',
        method: 'get'
    }
};

