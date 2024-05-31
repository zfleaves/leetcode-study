/*
 * @Author: your name
 * @Date: 2021-01-25 16:05:22
 * @LastEditTime: 2021-01-25 16:05:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\confiManagement\index.js
 */
import transfer from 'store/transfer';
// 公共qpi
import projectCalendar from './projectCalendar';
import warnRule from './warnRule';

const serveAll = {
    projectCalendar: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(projectCalendar)
        }
    },
    warnRule: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(warnRule)
        }
    }
};

export default {
    ...serveAll
};
