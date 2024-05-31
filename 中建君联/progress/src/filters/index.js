/*
 * @Author: your name
 * @Date: 2020-06-28 09:08:48
 * @LastEditTime: 2020-10-22 14:17:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_basicconfiguration-施工云企业信息及配置\src\filters\index.js
 */
import Utils from 'util';
import store from 'store';

// 设置 完整时间
const setTime = (value) => {
    return value ? Utils.commonUtil.formatTime(value) : '';
};
// 设置 日期
const setDate = (value) => {
    return value ? Utils.commonUtil.formatDate(value) : '';
};
// 数据字典过滤
const setDataItem = (value, arr) => {
    return value ? Utils.commonUtil.getDataItemName(value, arr) : '';
};
// 字段定义
const setStatus = (value) => {
    return value === 0 ? '系统字段' : '自定义字段';
};
// 字段定义
const setMoney = (value) => {
    return Utils.commonUtil.toQfw(value);
};
// 设置文件名称
const fileNameFilter = (value) => {
    return value ? (value.substr(0, value.lastIndexOf('_')) ? value.substr(0, value.lastIndexOf('_')) : value) : '';
};
// 设置税率
const setTaxRate = value => {
    return value ? Number(value.taxRate.split('%')[0]) : '';
};

const setTaxRateInfo = value => {
    return value ? `${Number(value)}%` : '';
};

const setTaxWarRate = value => {
    return value ? `${Number(value) * 100}%` : '';
};
// 根据身份证号码判断男女
const sexIdcardFilter = value => {
    return value ? value.substr(16, 1) % 2 === 1 ? '男' : '女' : '';
};

// 身份证号脱敏('331082199708094687' 转换成 '33108219********87') 第8位开始替换8个
const IDcardHide = num => {
    return num.replace(/(\d{8})\d{8}(\d*)/, '$1********$2');
};
// 手机号脱敏('13912345678' 转换成 '139****5678') 第3位开始替换4个
const telHide = num => {
    return num.replace(/(\d{3})\d{4}(\d*)/, '$1****$2');
};

// 设置地址
const setAddress = val => {
    return val ? val.split('-')[1] : '';
};
// 根据日期判断是月的第几周
const getWeekInMonth = t => {
    if (t === undefined || t === '' || t == null) {
        t = new Date();
    } else {
        t = new Date(t);
        const _t = new Date();
        _t.setYear(t.getFullYear());
        _t.setMonth(t.getMonth());
        _t.setDate(t.getDate());
        const date = _t.getDate(); // 给定的日期是几号
        _t.setDate(1);
        const d = _t.getDay(); // 1. 得到当前的1号是星期几。
        let fisrtWeekend = d;
        if (d === 0) {
            fisrtWeekend = 1;
            // 1号就是星期天
        } else {
            fisrtWeekend = 7 - d + 1; // 第一周的周未是几号
        }
        if (date <= fisrtWeekend) {
            return 1;
        } else {
            return 1 + Math.ceil((date - fisrtWeekend) / 7);
        }
    }
};

const systemFilters = (value, row) => {
    if (value instanceof Array) {
        const values = [];
        value.forEach(item => {
            values.push(item[row.printValue]);
        });
        return values.join(',');
    }
    // 千分位 且
    if (row.filterName === 'setMoney') {
        return row.precision ? setMoney(Math.round(value * Math.pow(10, row.precision)) / Math.pow(10, row.precision)) : setMoney(value);
    }
    if (row.filterName === 'number') {
        return value ? row.precision ? Math.round(value * Math.pow(10, row.precision)) / Math.pow(10, row.precision) : Math.round(value * Math.pow(10, 4)) / Math.pow(10, 4) : value;
    }
    // 附件
    if (row.filterName === 'attachment') {
        if (!value) return;
        return `附件${value.split(',').length}个`;
    }
    // 日期
    if (row.filterName === 'date' || row.formType === 'date') {
        return setDate(value);
    }
    // 时间
    if (row.filterName === 'time' || row.formType === 'time') {
        return setTime(value);
    }
    // 格式化文件名
    if (row.filterName === 'file') {
        return fileNameFilter(value);
    }
    // 税率
    if (row.filterName === 'taxRate') {
        return setTaxWarRate(value);
    }
    // 周
    if (row.filterName === 'week') {
        const week = getWeekInMonth(value);
        return `${value.substring(0, 4)}年${value.substring(5, 7)}月第${week}周`;
    }
    return value;
};

export default {
    setTime,
    setDate,
    setDataItem,
    setTaxRateInfo,
    setTaxWarRate,
    setStatus,
    setMoney,
    fileNameFilter,
    setTaxRate,
    sexIdcardFilter,
    IDcardHide,
    telHide,
    setAddress,
    systemFilters
};
