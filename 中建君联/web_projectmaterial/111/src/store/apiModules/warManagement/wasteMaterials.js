/*
 * @Author: your name
 * @Date: 2022-03-16 11:19:42
 * @LastEditTime: 2022-03-23 10:12:20
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \web_projectmaterial\src\store\apiModules\warManagement\wasteMaterials.js
 */

export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/warehouse/wastematerials/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/warehouse/wastematerials/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/warehouse/wastematerials/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/warehouse/wastematerials/delete',
        method: 'get'
    },
    // 导出
    getExportExcel: {
        url: '/promaterial/warehouse/wastematerials/detail/export',
        method: 'get',
        isExport: true
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/warehouse/wastematerials/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/warehouse/wastematerials/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/warehouse/wastematerials/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/warehouse/wastematerials/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/warehouse/wastematerials/detail/export',
        method: 'get',
        isExport: true
    }
};
