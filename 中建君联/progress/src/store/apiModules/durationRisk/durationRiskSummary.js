/*
 * @Author: your name
 * @Date: 2021-04-14 09:42:10
 * @LastEditTime: 2021-04-14 10:06:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\durationRisk\durationRiskSummary.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/durationrisk/register/detail/account/page',
        method: 'post'
    },
    // 导出
    exporttPage: {
        url: '/proprogress/durationrisk/register/detail/account/exportExcel',
        method: 'post',
        loading: true,
        isExport: true
    }
};
