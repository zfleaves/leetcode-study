/*
 * @Author: your name
 * @Date: 2020-07-24 16:37:43
 * @LastEditTime: 2021-11-22 17:49:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\demandPlan\masterPlan.js
 */
export default {
    // 分页查询目标成本明细列表数据(总预算明细选择时使用)
    getProcostMasterDetail: {
        url: '/procost/cost/master/detail/page',
        method: 'post'
    },
    // 分页查询签证明细列表数据(总预算明细选择时使用)
    getProcostSignMasterDetail: {
        url: '/procost/cost/construct/sign/master/detail/page',
        method: 'post'
    },
    // 查询明细关联的品种信息
    getRelationVarietiesList: {
        url: '/promaterial/demand/master/check/relation/varieties/list',
        method: 'post'
    },
    // 查询分页
    getPageList: {
      url: '/promaterial/demand/master/page',
      method: 'post'
    },
    // 查询 masterPlanId
    getInfo: {
        url: '/promaterial/demand/master/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/promaterial/demand/master/edit',
        method: 'post',
        loading: true
    },
    // 删除 masterPlanId
    setDelete: {
        url: '/promaterial/demand/master/delete',
        method: 'get'
    },
    // 删除明细 masterDetailIds
    setDeleteDetails: {
        url: '/promaterial/demand/master/details/delete',
        method: 'post'
    },
    // 校验项目是否已经做了总预算(true是(已经生成了总预算),false否(没有生成总预算) masterPlanId projectId
    checkProject: {
        url: '/promaterial/demand/master/check/project',
        method: 'get'
    },
    // 分页查询物资品种信息列表(模糊匹配)
    getVarietiesVaguePage: {
        url: '/promaterial/basematerial/varieties/vague/page',
        method: 'post',
        loading: true
    },
    // 下载模板
    getDownloadTemplate: {
        url: '/promaterial/demand/master/download/template',
        method: 'get',
        isExport: true
    },
    // 导出
    getExportExcel: {
        url: '/promaterial/demand/master/exportExcel',
        method: 'post',
        isExport: true
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/promaterial/demand/master/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/promaterial/demand/master/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/promaterial/demand/master/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/promaterial/demand/master/workflow/approve',
        method: 'post'
    },
    // 更新修改总预算信息
    demandUpdateSave: {
        url: '/promaterial/demand/master/update',
        method: 'post',
        loading: true
    },
    // 检验明细中成本编号对应的名称是否存在
    demandCheckCostdetailcodes: {
        url: '/promaterial/demand/master/check/costdetailcodes/list',
        method: 'post'
    }
};
