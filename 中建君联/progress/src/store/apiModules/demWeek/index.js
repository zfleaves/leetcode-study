/*
 * @Author: your name
 * @Date: 2021-02-01 17:26:29
 * @LastEditTime: 2021-02-01 17:26:29
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demWeek\index.js
 */
import transfer from 'store/transfer';
// 公共qpi
import demWeekPlan from './demWeekPlan';
import demWeekprogressReport from './demWeekprogressReport';

const serveAll = {
    demWeekPlan: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(demWeekPlan)
        }
    },
    demWeekprogressReport: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(demWeekprogressReport)
        }
    }
};

export default {
    ...serveAll
};
