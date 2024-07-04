/*
 * @Author: zengfa
 * @Email: 1051403128@qq.com
 * @Date: 2020-05-18 14:07:09
 * @LastEditTime: 2020-07-10 15:59:39
 */
/* eslint-disable */
class StorageUtils {
    /**
     * @name: 缓存
     * @param {String} key
     * @param {String} value
     */
    set (key, value) {
        if (!key) return console.warn('save storage key can`t null!');
        if (value) {
            localStorage ? localStorage.setItem(key, value) : this.setCookie(key, value, 0);
        } else {
            localStorage ? localStorage.removeItem(key) : this.removeCookie(key);
        }
    }
    /**
     * @name: 缓存对象
     * @param {type} key 键
     * @param {type} object 对象
     */
    setObject (key, object) {
        try {
            object = typeof object === 'object' ? JSON.stringify(object) : object;
        } catch (e) {
            console.error(`storage saveObject of '${key}' error. \nerror :`, e, '\nvalue : ', object);
        }
        this.set(key, object);
    }


    /**
     * @name: 取值
     * @param {String} key 键
     * @return: 值
     */
    get (key) {
        if (!key) return console.warn('get item key can not null!');
        let value;
        if (localStorage) {
            value = localStorage.getItem(key);
        } else {
            value = this.getCookie(key);
        }
        return value;
    }

    /**
     * @name: 获取缓存数据
     * @param {String} key 缓存键
     * @return: 数据对象
     */
    getObject (key) {
        let value = this.get(key);
        try {
            value = typeof value === 'string' ? JSON.parse(value) : value;
        } catch (e) {
            console.error(`storage getObjcet of '${key}' error \n`, e);
        }
        return value;
    }

    /**
     * @name: 删除缓存
     * @param {type} key 缓存key
     */
    remove (key) {
        if (!key) return console.warn('storage remove key can`t null!');
        localStorage ? localStorage.removeItem(key) : this.removeCookie(key);
    }

    /**
     * @name: 获取cookie值
     * @param {String} key cookie key值
     * @return: 相应值，null表示未获取到
     */
    static getCookie (key) {
        const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
        const arr = document.cookie.match(reg);
        if (arr) {
            return unescape(arr[2]);
        }
        return null;
    }

    /**
     * @name: 保存 cookie
     * @param {String} key key值
     * @param {String} value key值
     */
    setCookie = function (key, value, day) {
        if (day !== 0) { // 当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
            const expires = day * 24 * 60 * 60 * 1000;
            const date = new Date(+new Date() + expires);
            document.cookie = `${key}=${escape(value)};expires=${date.toUTCString()}`;
        } else {
            document.cookie = `${key}=${escape(value)}`;
        }
    }

    removeCookie (key) {
        this.setCookie(key, '', -1);
    }

    /**
     * @name: 删除所有Storage
     */
    clearStorage () {
        localStorage.clear();
    }
}

export default StorageUtils;
