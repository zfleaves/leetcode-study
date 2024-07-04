export default {
  // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/purchase/supplyorder/partya/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/purchase/supplyorder/partya/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/purchase/supplyorder/partya/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/purchase/supplyorder/partya/workflow/approve',
        method: 'post'
    }
};
