/*
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2021-04-14 10:30:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\store\apiModules\aggregate.js
 */

import transfer from 'store/transfer';

// 公共的接口 语言 数据字典
import publicApiAll from './publicApi';
// 登录
import login from './login/login';
// 首页
import home from './home/home';
// 配置管理
import confiManagement from './confiManagement/index';
// 巡检管理
import demMaster from './demMaster/index';
// 月度计划
import demMonth from './demMonth/index';
// 周计划
import demWeek from './demWeek/index';
// 施工日志
import buildLog from './buildLog/index';
// 形象进度
import imageProgress from './imageProgress/index';
// 巡检管理
import inspect from './inspect/index';
// 工期
import durationRisk from './durationRisk/index';


const serveAll = {
  ...buildLog,
  ...inspect,
  ...durationRisk,
  ...confiManagement,
  ...demMaster,
  ...demMonth,
  ...demWeek,
  ...imageProgress,
  ...publicApiAll,
  login: {
    namespaced: true,
    actions: {
      ...transfer.transToActions(login)
    }
  },
  home: {
    namespaced: true,
    actions: {
      ...transfer.transToActions(home)
    }
  }
};

export default {
  ...serveAll
};
