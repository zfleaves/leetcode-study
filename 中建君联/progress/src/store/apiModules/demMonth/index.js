/*
 * @Author: your name
 * @Date: 2021-01-29 17:40:43
 * @LastEditTime: 2021-01-29 17:43:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demMonth\index.js
 */
import transfer from 'store/transfer';
// 公共qpi
import demMonthPlan from './demMonthPlan';
import demMonthPlanAdjust from './demMonthPlanAdjust';
import demMonthprogressReport from './demMonthprogressReport';

const serveAll = {
    demMonthPlan: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(demMonthPlan)
        }
    },
    demMonthPlanAdjust: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(demMonthPlanAdjust)
        }
    },
    demMonthprogressReport: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(demMonthprogressReport)
        }
    }
};

export default {
    ...serveAll
};
