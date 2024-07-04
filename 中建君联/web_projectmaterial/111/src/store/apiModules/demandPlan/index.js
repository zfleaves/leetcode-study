/*
 * @Author: your name
 * @Date: 2020-07-24 16:38:43
 * @LastEditTime: 2020-07-27 10:52:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\store\apiModules\demandPlan\index.js
 */
import transfer from 'store/transfer';
// 总预算
import masterPlan from './masterPlan';
// 变更
import masterPlanAdjust from './masterPlanAdjust';
// 年
import yearPlan from './yearPlan';
// 季
import quarterPlan from './quarterPlan';
// 月
import monthPlan from './monthPlan';
// 临时
import tempPlan from './tempPlan';
// 周
import weekPlan from './weekPlan';


const serveAll = {
    masterPlan: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(masterPlan)
        }
    },
    masterPlanAdjust: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(masterPlanAdjust)
        }
    },
    yearPlan: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(yearPlan)
        }
    },
    quarterPlan: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(quarterPlan)
        }
    },
    monthPlan: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(monthPlan)
        }
    },
    tempPlan: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(tempPlan)
        }
    },
    weekPlan: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(weekPlan)
        }
    }
};

export default {
    ...serveAll
};
