/*
 * @Author: your name
 * @Date: 2020-07-27 10:51:55
 * @LastEditTime: 2020-08-07 14:44:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\demandPlan\adjustPlanAdjust.js
 */
export default {
    // 查询分页
    getPageList: {
      url: '/promaterial/demand/adjust/page',
      method: 'post'
    },
    // 查询 masterPlanAdjustId
    getInfo: {
        url: '/promaterial/demand/adjust/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/demand/adjust/edit',
        method: 'post',
        loading: true
    },
    // 删除 masterPlanAdjustId
    setDelete: {
        url: '/promaterial/demand/adjust/delete',
        method: 'get'
    },
    // 删除明细 masterPlanAdjustDetailIds
    setDeleteDetails: {
        url: '/promaterial/demand/adjust/details/delete',
        method: 'post'
    },
    // 校验项目是否已经做了总预算(true是(已经生成了总预算),false否(没有生成总预算) masterPlanAdjustId projectId
    checkProject: {
        url: '/promaterial/demand/adjust/check/adjust',
        method: 'get'
    },
    // 通过项目名称获取需求总计划数据
    getProjectMasterInfo: {
        url: '/promaterial/demand/master/project/detials',
        method: 'get',
        loading: true
    },
    // 分页查询物资品种信息列表(模糊匹配)
    getVarietiesVaguePage: {
        url: '/promaterial/basematerial/varieties/vague/page',
        method: 'post'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/demand/adjust/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/demand/adjust/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/demand/adjust/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/demand/adjust/workflow/approve',
        method: 'post'
    },
     // 导出明细
    exportDetail: {
        url: '/promaterial/demand/adjust/detail/export',
        method: 'get',
        isExport: true
    }
};
