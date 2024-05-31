/*
 * @Author: your name
 * @Date: 2021-01-26 10:16:32
 * @LastEditTime: 2021-01-26 10:18:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\imageProgress\imageProgressOther.js
 */
export default {
    // 查询分页
    getPageList: {
        url: '/proprogress/imageprogress/other/page',
        method: 'post'
    },
    // 查询 monthPlanId
    getInfo: {
        url: '/proprogress/imageprogress/other/info',
        method: 'get'
    },
    // 编辑
    setEdit: {
        url: '/proprogress/imageprogress/other/edit',
        method: 'post',
        loading: true
    },
    // 删除 monthPlanId
    setDelete: {
        url: '/proprogress/imageprogress/other/delete',
        method: 'get'
    },
    // 获取开始流程节点
    getStartNode: {
        url: '/proprogress/imageprogress/other/workflow/start/node/assignee/users',
        method: 'get'
    },
    // 流程启动
    startSubmit: {
        url: '/proprogress/imageprogress/other/workflow/start',
        method: 'post',
        loading: true
    },
    // 获取下一个节点的处理人信息
    getWorkflowNextNode: {
        url: '/proprogress/imageprogress/other/workflow/next/node/assignee/users',
        method: 'get'
    },
    // 流程审批
    setWorkflowApprove: {
        url: '/proprogress/imageprogress/other/workflow/approve',
        method: 'post'
    }
};
