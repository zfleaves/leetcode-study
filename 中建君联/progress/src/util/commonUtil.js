/*
 * @Author: Zengfa
 * @Email: 1051403128@qq.com
 * @Date: 2020-05-18 14:42:09
 * @LastEditTime: 2020-08-27 18:58:37
 */
/* eslint-disable */
import store from '../store';
import config from './config';
import {Message} from 'element-ui';

const add0 = (m) => {
    return m < 10 ? `0${m}` : m;
};
class CommonUtils {
    /**
     * @name: 时间补 0
     * @param {Number} key
     */
    // static add0(m) {
    //     return m < 10 ? '0' + m : m
    // }

    /**
     * @name: 时间戳转换未 时分秒格式
     * @param {Number} shijianchuo
     */
    formatTime (shijianchuo) {
        if (!shijianchuo) return '';
        const time = new Date(shijianchuo);
        const y = time.getFullYear();
        const m = time.getMonth() + 1;
        const d = time.getDate();
        const h = time.getHours();
        const mm = time.getMinutes();
        const s = time.getSeconds();
        return `${y}-${add0(m)}-${add0(d)} ${add0(h)}:${add0(mm)}:${add0(s)}`;
    }

    /**
     * @name: 时间戳转换未 日期个
     * @param {Number} shijianchuo
     */
    formatDate (shijianchuo) {
        if (!shijianchuo) return '';
        const time = new Date(shijianchuo);
        const y = time.getFullYear();
        const m = time.getMonth() + 1;
        const d = time.getDate();
        return `${y}-${add0(m)}-${add0(d)}`;
    }

    /**
     * @name: 时间戳转换未 月份
     * @param {Number} shijianchuo
     */
    formatMonth (shijianchuo) {
        const m = shijianchuo.getMonth() + 1;
        const d = shijianchuo.getDate();
        return `${add0(m)}-${add0(d)}`;
    }


    /**
     * @name: 金钱转千分位
     * @param {Number} n
     */
    toQfw (n) {
        if (n === 0) {
            return '0';
        }
        if (!n) {
            return n;
        }
        if (typeof (n) === 'string') {
            return n;
        }
        // n 50000
        const copyNum = n;
        n = Math.abs(n);
        // Math.abs(-8)
        n = n.toFixed(2); // 50000.13
        const strN = n.toString(); // '50000.13'
        let num, num1;
        if (strN.indexOf('.') >= 0) {
            num = strN.split('.')[0]; // 12345678
            num1 = strN.split('.')[1]; // '13'
        } else {
            num = strN;
            num1 = '00';
        }
        let result = '';
        while (num.length > 3) {
            result = `,${num.slice(-3)}${result}`; // ,345,678
            num = num.slice(0, num.length - 3); // 12
        }
        if (num) { // 12
            if (copyNum >= 0) {
                return `${num}${result}.${num1}`; // 12,345,678.13
            } else {
                return `-${num}${result}.${num1}`; // 12,345,678.13
            }
        }
        return 0;
    }

    /**
     * @name: 千分位转金钱
     * @param {String} str
     */
    reseveQfw (str) {
        if (!str) {
            return str;
        }
        if (typeof (str) === 'number') {
            return str;
        }
        str = str.split(',').join('');
        str = Number(str);
        return str;
    }

    /**
     * @name: 节流函数
     * @param {Function} func  回调函数
     * @param {Number} delay   延迟时间
     */
    debounce (func, delay) {
        let timer;

        return function (...args) {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    /**
     * @name: 还原数据仓库数据
     */
    resetVuex () {
        // store.commit('auth/resetAuthData');
        // store.commit('dialog/resetDialogData');
        // store.commit('tagNav/resetTagNavData');
        // store.commit('user/resetUserData');
        // store.commit('tagNav1/resetTagNav1Data');
        store.commit('user/resetUser');
        store.commit('tagNav/resetTagNav');
        store.commit('diaLog/resetDiaLog');
    }

    /**
     * @name: 获取数据字典名称
     * @param {String} val 数据字典编号
     * @param {Array} arr 数据字典列表
     */
    getDataItemName (val, arr) {
        const index = arr.findIndex(v => v.dataValue === val);
        return index >= 0 ? arr[index].dataName : '';
    }

    //
    getCurrentDate() {
        let myDate = new Date();
        let year = myDate.getFullYear(); //年
        let month = myDate.getMonth() + 1; //月
        let day = myDate.getDate(); //日
        let days = myDate.getDay();
        switch(days) {
              case 1:
                    days = '星期一';
                    break;
              case 2:
                    days = '星期二';
                    break;
              case 3:
                    days = '星期三';
                    break;
              case 4:
                    days = '星期四';
                    break;
              case 5:
                    days = '星期五';
                    break;
              case 6:
                    days = '星期六';
                    break;
              case 0:
                    days = '星期日';
                    break;
        }
        let obj = {
            date: year + "年" + month + "月" + day + "日",
            days
        }
        return obj;
    }
    /** 
     * @name: 页面初始化 获取常用下拉框的值
     * @param {Array} arr
    */
    async getSelectList(arr, _this) {
        for (const i in arr) {
            const item = arr[i];
            await this.getSelectDataList(item, _this);
        }
    }
    getSelectDataList(item, _this) {
        store.dispatch(item.fun).then(res => {
            if (res.status === 0) {
                this.setFormSearchData(item.code, res.results, _this);
                _this.PageConfig[`${item.code}List`] = res.results;
            } else {
                Message.error(`${res.errorMessage}`);
            }
        });
    }
    setFormSearchData(code, arr, _this) {
        // 编辑页面
        if (_this.PageConfig.mainFormConfig) {
            _this.PageConfig.mainFormConfig.formList.forEach(item => {
                if (item.prop === code) {
                    item.selectList = arr;
                }
            });
        }
        // 搜索页面
        if (_this.PageConfig.searchControls) {
            _this.PageConfig.searchControls.formList.forEach(item => {
                if (item.prop === code) {
                item.selectList = arr;
                }
            });
        }
    }
    /** 
     * @name: 页面初始化 获取数据字典
     * @param {Array} arr
    */
    async getDicAllDataList (arr, _this) {
        for (const i in arr) {
          const item = arr[i];
          await this.getDataList(item, _this);
        }
      }
      getDataList (item, _this) {
        const index = config.dataList.findIndex(v => v.code === item.dicCode);
        if (index < 0) return;
        const id = config.dataList[index].id;
        this._getDicItemValues(id, item.dicCode, item.propCode, _this);
      }
      _getDicItemValues (id, dicCode, propCode, _this) {
        store.dispatch('publicApi/getDicItemValues', {dicId: id}).then(res => {
          if (dicCode === 'taxRate' || dicCode === 'qualityDepositScale') {
            for (const i in res.results) {
              const item = res.results[i];
              item.value = item.dataName.indexOf('%') >= 0 ? Number(item.dataName.split('%')[0]) / 100 : '';
              item.percentValue = item.dataName.indexOf('%') >= 0 ? Number(item.dataName.split('%')[0]) : '';
              item.dataCode = item.value;
            }
          }
          _this.PageConfig[`${propCode}List`] = res.results;
          this.setDicConfig(propCode, res.results, _this);
        });
      }
      setDicConfig(propCode, res, _this) {
        //   编辑页面主表赋值
        if (_this.PageConfig.mainFormConfig) {
            const index = _this.PageConfig.mainFormConfig.formList.findIndex(v => v.prop === propCode);
            if (index >= 0) {
                _this.PageConfig.mainFormConfig.formList[index].selectList = res;
            }
        }
        // 编辑页面子表赋值
        if (_this.PageConfig.subTableConfig) {
            const subTableConfig = _this.PageConfig.subTableConfig;
            for (const i in subTableConfig) {
                const item = subTableConfig[i];
                const index = item.tableList.slaveColumns.findIndex(v => v.prop === propCode);
                if (index >= 0) {
                    item.tableList.slaveColumns[index].selectList = res;
                }
            }
        }
        // 查询页面 搜索赋值
        if (_this.PageConfig.searchControls) {
            const key = _this.PageConfig.searchControls.formList.findIndex(v => v.prop === propCode);
            if (key >= 0) {
                _this.PageConfig.searchControls.formList[key].selectList = res;
            }
        }
        // 查询页面 表格赋值
        if (_this.PageConfig.mainTable) {
            const indexTable = _this.PageConfig.mainTable.tableList.findIndex(v => v.prop === propCode);
            if (indexTable >= 0) {
                _this.PageConfig.mainTable.tableList[indexTable].selectList = res;
            }
        }
      }
}

export default CommonUtils;
