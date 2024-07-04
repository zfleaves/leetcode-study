/*
 * @Author: your name
 * @Date: 2020-07-24 16:38:29
 * @LastEditTime: 2020-08-03 17:56:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\demandPlan\tempPlan.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/demand/temp/page',
      method: 'post'
    },
    // 查询 tempPlanId
    getInfo: {
        url: '/promaterial/demand/temp/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/demand/temp/edit',
        method: 'post',
        loading: true
    },
    // 删除 tempPlanId
    setDelete: {
        url: '/promaterial/demand/temp/delete',
        method: 'get'
    },
    // 删除明细 tempPlanDetailIds
    setDeleteDetails: {
        url: '/promaterial/demand/temp/details/delete',
        method: 'post'
    },
    // 查询项目的总预算主表数据 projectId
    getProjectInfo: {
        url: '/promaterial/demand/master/project/info',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/demand/temp/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/demand/temp/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/demand/temp/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/demand/temp/workflow/approve',
        method: 'post'
    },
     // 导出明细
    exportDetail: {
        url: '/promaterial/demand/temp/detail/export',
        method: 'get',
        isExport: true
    }
};
