/*
 * @Author: your name
 * @Date: 2021-04-14 09:41:50
 * @LastEditTime: 2021-04-14 09:44:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\durationRisk\index.js
 */
import transfer from 'store/transfer';
// 工期风险项识别参考表
import durationRiskConfig from './durationRiskConfig';
// 项目工期风险项登记
import durationRiskRegister from './durationRiskRegister';
// 项目工期风险项记录汇总表
import durationRiskSummary from './durationRiskSummary';

const serveAll = {
    durationRiskConfig: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(durationRiskConfig)
        }
    },
    durationRiskRegister: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(durationRiskRegister)
        }
    },
    durationRiskSummary: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(durationRiskSummary)
        }
    }
};

export default {
    ...serveAll
};
