/*
 * @Author: your name
 * @Date: 2021-01-26 10:16:15
 * @LastEditTime: 2021-01-26 10:16:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\store\apiModules\imageProgress\index.js
 */
import transfer from 'store/transfer';
// 公共qpi
import imageProgressOther from './imageProgressOther';
import imageProgressWork from './imageProgressWork';

const serveAll = {
    imageProgressOther: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(imageProgressOther)
        }
    },
    imageProgressWork: {
        namespaced: true,
        actions: {
            ...transfer.transToActions(imageProgressWork)
        }
    }
};

export default {
    ...serveAll
};
