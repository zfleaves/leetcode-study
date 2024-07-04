/*
 * @Author: your name
 * @Date: 2021-04-19 11:16:38
 * @LastEditTime: 2021-04-19 14:54:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\subcontractorMaterial\materialApproach.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/subcontracts/enter/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/subcontracts/enter/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/subcontracts/enter/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/subcontracts/enter/delete',
        method: 'get'
    },
    // 删除明细
    setDeleteDetails: {
        url: '/promaterial/subcontracts/enter/details/delete',
        method: 'post'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/subcontracts/enter/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/subcontracts/enter/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/subcontracts/enter/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/subcontracts/enter/workflow/approve',
        method: 'post'
    },
    // 模板下载
    getDownloadTemplate: {
        url: '/promaterial/subcontracts/enter/download/template',
        method: 'get',
        isExport: true
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/subcontracts/enter/detail/export',
        method: 'get',
        isExport: true
    }
};
