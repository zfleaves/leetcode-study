/*
 * @Author: Zengfa
 * @Email: 1051403128@qq.com
 * @Date: 2020-05-18 14:07:09
 * @LastEditTime: 2020-07-16 16:03:04
 */

import Storage from './storage';
import MenuUtils from './menu';
import CommonUtil from './commonUtil';
import Auth from './auth';
import config from './config';
import serve from './serve';

export default {
    storage: new Storage(),
    menu: new MenuUtils(),
    commonUtil: new CommonUtil(),
    Auth,
    config,
    serve
};
