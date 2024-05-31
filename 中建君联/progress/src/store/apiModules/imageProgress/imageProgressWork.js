/*
 * @Author: your name
 * @Date: 2021-01-26 10:16:41
 * @LastEditTime: 2021-01-26 10:18:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\imageProgress\imageProgressWork.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/imageprogress/work/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/imageprogress/work/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/imageprogress/work/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/imageprogress/work/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/imageprogress/work/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/imageprogress/work/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/imageprogress/work/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/imageprogress/work/workflow/approve',
        method: 'post'
    }
};
