/*
 * @Author: your name
 * @Date: 2021-01-26 10:03:45
 * @LastEditTime: 2021-02-01 09:22:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\buildLog\index.js
 */
import transfer from 'store/transfer';
// 公共qpi
import buildLogType from './buildLogType';
import buildLogUser from './buildLogUser';
import buildLogApply from './buildLogApply';
import buildLogOther from './buildLogOther';
import buildLogAcount from './buildLogAcount';

const serveAll = {
    buildLogType: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(buildLogType)
        }
    },
    buildLogUser: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(buildLogUser)
        }
    },
    buildLogApply: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(buildLogApply)
        }
    },
    buildLogOther: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(buildLogOther)
        }
    },
    buildLogAcount: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(buildLogAcount)
        }
    }
};

export default {
    ...serveAll
};
