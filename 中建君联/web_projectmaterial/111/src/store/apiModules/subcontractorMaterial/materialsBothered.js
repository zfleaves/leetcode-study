/*
 * @Author: your name
 * @Date: 2021-04-19 11:16:57
 * @LastEditTime: 2021-04-19 16:52:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\subcontractorMaterial\materialsBothered.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/subcontracts/exit/page',
      method: 'post'
    },
    // 查询 paymentId
    getInfo: {
        url: '/promaterial/subcontracts/exit/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/subcontracts/exit/edit',
        method: 'post',
        loading: true
    },
    // 删除
    setDelete: {
        url: '/promaterial/subcontracts/exit/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/subcontracts/exit/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/subcontracts/exit/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/subcontracts/exit/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/subcontracts/exit/workflow/approve',
        method: 'post'
    },
    // /subcontracts/enter/list/info根据项目id查询材料进场列表
    getVarietiesName: {
        url: '/promaterial/subcontracts/enter/list/info',
        method: 'get'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/subcontracts/exit/detail/export',
        method: 'get',
        isExport: true
    }
};
