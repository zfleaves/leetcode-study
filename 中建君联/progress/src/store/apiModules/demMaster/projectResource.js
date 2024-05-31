/*
 * @Author: your name
 * @Date: 2021-04-14 09:33:26
 * @LastEditTime: 2021-04-14 16:19:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demMaster\projectResource.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/plan/monthprogress/report/resource/details/page',
        method: 'post'
    },
    // 导出
    exporttPage: {
        url: '/proprogress/plan/monthprogress/report/resource/details/exportExcel',
        method: 'post',
        loading: true,
        isExport: true
    }
};
