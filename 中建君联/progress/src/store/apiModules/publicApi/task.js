/*
 * @Author: your name
 * @Date: 2020-07-24 18:20:00
 * @LastEditTime: 2020-07-24 18:20:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_contract-合同管理\src\store\apiModules\publicApi\task.js
 */
export default {
    // 我的申请
    getTaskApply: {
        url: '/basic/workflow/task/query/user/apply',
        method: 'post'
    },
    // 我的已办
    getTaskDone: {
        url: '/basic/workflow/task/query/user/done',
        method: 'post'
    },
    // 我的已阅
    getTaskRead: {
        url: '/basic/workflow/task/query/user/read',
        method: 'post'
    },
    // 我的待阅
    getTaskUnRead: {
        url: '/basic/workflow/task/query/user/unRead',
        method: 'post'
    },
    // 我的待办
    getTaskUndo: {
        url: '/basic/workflow/task/query/user/undo',
        method: 'post'
    }
};

