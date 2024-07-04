/*
 * @Author: your name
 * @Date: 2020-07-15 15:40:30
 * @LastEditTime: 2020-08-24 09:55:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_unit\src\store\apiModules\publicApi\index.js
 */
import transfer from 'store/transfer';
// 公共qpi
import publicApi from './publicApi';
// 流程相关
import processApi from './processApi';
// 打印
import printApi from './printApi';

import task from './task';

const serveAll = {
    publicApi: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(publicApi)
        }
    },
    processApi: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(processApi)
        }
    },
    task: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(task)
        }
    },
    printApi: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(printApi)
        }
    }
};

export default {
    ...serveAll
};
