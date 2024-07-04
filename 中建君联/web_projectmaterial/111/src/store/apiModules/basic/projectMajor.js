/*
 * @Author: your name
 * @Date: 2021-11-22 09:49:17
 * @LastEditTime: 2021-11-22 15:22:47
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_projectmaterial\src\store\apiModules\basic\projectMajor.js
 */

export default {
    // 分页条件查询专业列表信息
    getProjectMajorPage: {
        url: '/project/project/major/page',
        method: 'get'
    },
    // 删除专业信息
    deleteProjectMajor: {
        url: '/project/project/major/delete',
        method: 'get'
    },
    // 查询专业详细信息
    getProjectMajorInfo: {
        url: '/project/project/major/info',
        method: 'get'
    },
    // 新增及修改专业信息
    saveProjectMajor: {
        url: '/project/project/major/edit',
        method: 'post',
        loading: true
    },
    // 修改状态
    setStatus: {
        url: '/project/project/major/update/status',
        method: 'get'
    },
    // 获取专业
    getProjectMajorlist: {
        url: '/project/project/major/list',
        method: 'get'
    }
};
