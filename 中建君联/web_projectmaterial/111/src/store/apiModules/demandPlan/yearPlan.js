/*
 * @Author: your name
 * @Date: 2020-07-24 16:37:54
 * @LastEditTime: 2021-11-23 09:50:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\demandPlan\yearPlan.js
 */
export default {
    // 查询可以做年度预算的总预算数据接口
    getDemandYearList: {
        url: '/promaterial/demand/master/year/list',
        method: 'post'
    },
    // 查询分页
    getPageList: {
      url: '/promaterial/demand/year/page',
      method: 'post'
    },
    // 查询 yearPlanId
    getInfo: {
        url: '/promaterial/demand/year/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/demand/year/edit',
        method: 'post',
        loading: true
    },
    // 删除 yearPlanId
    setDelete: {
        url: '/promaterial/demand/year/delete',
        method: 'get'
    },
    // 删除明细 yearPlanDetailIds
    setDeleteDetails: {
        url: '/promaterial/demand/year/details/delete',
        method: 'post'
    },
    // 查询项目的总预算主表数据 projectId
    getProjectInfo: {
        url: '/promaterial/demand/master/project/info',
        method: 'get'
    },
    // 分页查询物资品种信息列表(模糊匹配) projectId varietiesName
    getVarietiesVaguePage: {
        url: '/promaterial/demand/master/project/yearquarter/detials',
        method: 'get'
    },
    // 校验项目是否做年计划(有返回true,没有返回false)
    checkYearplan: {
        url: '/promaterial/demand/year/check/yearplan',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/demand/year/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/demand/year/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/demand/year/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/demand/year/workflow/approve',
        method: 'post'
    },
     // 导出明细
    exportDetail: {
        url: '/promaterial/demand/year/detail/export',
        method: 'get',
        isExport: true
    }
};
