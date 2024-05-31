/*
 * @Author: your name
 * @Date: 2021-01-26 10:17:08
 * @LastEditTime: 2021-04-14 09:39:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\inspect\index.js
 */
import transfer from 'store/transfer';
// 公共qpi
import inspectRegister from './inspectRegister';
import inspectType from './inspectType';
// 工程进度巡查报告
import inspectReport from './inspectReport';

const serveAll = {
    inspectRegister: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(inspectRegister)
        }
    },
    inspectType: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(inspectType)
        }
    },
    inspectReport: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(inspectReport)
        }
    }
};

export default {
    ...serveAll
};
