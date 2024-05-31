/*
 * @Author: your name
 * @Date: 2021-01-28 09:13:20
 * @LastEditTime: 2021-04-14 09:36:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\demMaster\index.js
 */
import transfer from 'store/transfer';
// 公共qpi
import demMasterPlan from './demMasterPlan';
import demMasterPlanAdjust from './demMasterPlanAdjust';
// 项目资源消耗
import projectResource from './projectResource';

const serveAll = {
    demMasterPlan: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(demMasterPlan)
        }
    },
    demMasterPlanAdjust: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(demMasterPlanAdjust)
        }
    },
    projectResource: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(projectResource)
        }
    }
};

export default {
    ...serveAll
};
