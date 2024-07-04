/*
 * @Author: your name
 * @Date: 2020-08-11 17:12:33
 * @LastEditTime: 2020-08-12 13:41:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\equip\equipInstall.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/equipment/install/page',
      method: 'post'
    },
    // 查询
    getInfo: {
        url: '/promaterial/equipment/install/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/equipment/install/edit',
        method: 'post',
        loading: true
    },
    // 删除
    setDelete: {
        url: '/promaterial/equipment/install/delete',
        method: 'get'
    },
    // 查询物资明细信息列表(弹框使用)
    getBasematerialDetail: {
        url: '/promaterial/basematerial/detail/win/page',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/equipment/install/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/equipment/install/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/equipment/install/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/equipment/install/workflow/approve',
        method: 'post'
    },
    // 导出明细
    exportDetail: {
        url: '/promaterial/equipment/install/detail/export',
        method: 'get',
        isExport: true
    }
};
