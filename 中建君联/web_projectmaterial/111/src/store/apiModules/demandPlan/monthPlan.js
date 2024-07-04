/*
 * @Author: your name
 * @Date: 2020-07-24 16:38:18
 * @LastEditTime: 2021-11-23 10:50:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\demandPlan\monthPlan.js
 */
export default {
    // 查询各项目品种预算内月、周和临时剩余总预算数据
    getDemandInnerList: {
        url: '/promaterial/demand/master/project/inner/surplus/list',
        method: 'post'
    },
    // 查询分页
    getPageList: {
      url: '/promaterial/demand/month/page',
      method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/promaterial/demand/month/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/demand/month/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/promaterial/demand/month/delete',
        method: 'get'
    },
    // 删除明细 monthPlanDetailIds
    setDeleteDetails: {
        url: '/promaterial/demand/month/details/delete',
        method: 'post'
    },
    // 查询项目的总预算主表数据 projectId
    getProjectInfo: {
        url: '/promaterial/demand/master/project/info',
        method: 'get'
    },
    // 校验项目是否做月计划(有返回true,没有返回false)
    checkMonthplan: {
        url: '/promaterial/demand/month/check/monthplan',
        method: 'get'
    },
    // 预算内
    getInnerDetials: {
        url: '/promaterial/demand/master/project/inner/detials',
        method: 'get'
    },
    // 预算外
    getOuterDetials: {
        url: '/promaterial/demand/master/project/outer/detials',
        method: 'post'
    },
    // 预算外(未归类)
    getOuterClassifyDetials: {
        url: '/promaterial/demand/master/project/classify/varieties/detials',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/demand/month/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/demand/month/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/demand/month/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/demand/month/workflow/approve',
        method: 'post'
    },
     // 导出明细
    exportDetail: {
        url: '/promaterial/demand/month/detail/export',
        method: 'get',
        isExport: true
    },
    // GET 月度需求计划明细导入模板下载
    getDownloadTemplate: {
        url: '/promaterial/demand/month/download/details/template',
        method: 'get',
        isExport: true
    }
};
