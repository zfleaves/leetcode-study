/*
 * @Author: Zengfa
 * @Email: 1051403128@qq.com
 * @Date: 2020-05-18 14:07:09
 * @LastEditTime: 2021-01-26 09:44:44
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
    serve,
    getDiffDate
};

function getDiffDate(start, end) {
    const startTime = getDate(start);
    const endTime = getDate(end);
    const dateArr = [];
    while ((endTime.getTime() - startTime.getTime()) > 0) {
        const year = startTime.getFullYear();
        const month = startTime.getMonth().toString().length === 1 ? `0${parseInt(startTime.getMonth().toString(), 10) + 1}` : (startTime.getMonth() + 1);
        const day = startTime.getDate().toString().length === 1 ? `0${startTime.getDate()}` : startTime.getDate();
        dateArr.push(`${year}-${month}-${day}`);
        startTime.setDate(startTime.getDate() + 1);
    }
    if (end.indexOf(' ')) {
        end = end.split(' ')[0];
        dateArr.push(end);
    }
    return dateArr;
}

function getDate(datestr) {
    if (datestr.indexOf(' ')) {
        datestr = datestr.split(' ')[0];
    }
    const temp = datestr.split('-');
    if (temp[1] === '01') {
        temp[0] = parseInt(temp[0], 10) - 1;
        temp[1] = '12';
    } else {
        temp[1] = parseInt(temp[1], 10) - 1;
    }
    // new Date()的月份入参实际都是当前值-1
    const date = new Date(temp[0], temp[1], temp[2]);
    return date;
    // getDiffDate('2018-05-27', '2018-06-31')
}
