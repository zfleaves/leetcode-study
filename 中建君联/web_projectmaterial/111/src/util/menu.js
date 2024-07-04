/*
 * @Author: zengfa
 * @Email: 1051403128@qq.com
 * @Date: 2020-05-18 14:07:09
 * @LastEditTime: 2020-07-16 16:09:27
 */

/*
* 获取菜单以及按钮
*
 */
/* eslint-disable */
import Utils from './index';


class MenuUtils {
    /**
     * 获取登陆菜单
     */
    getMenuList () {
        const result = [];
        const menu = Utils.Auth.hasMenuRouter() || [];
        for (const i in menu) {
            if (menu[i].children && menu[i].children.length) {
                result.push(...menu[i].children);
            }
        }
        return result;
    }

    /**
     * 获取当前路由
     * @param  name 路由对应的name
     */
    getCurrentMenu (name) {
        console.loga(name);
        console.loga(this.getMenuList());

        const index = this.getMenuList().findIndex(v => v.name === name);
        return index >= 0 ? this.getMenuList()[index] : {};
    }

    /**
     * 获取当前菜单按钮组
     * @param  name 路由对应的name
     */
    getCurrentButton (name) {
        const currentMenu = this.getCurrentMenu(name);
        return currentMenu.children && currentMenu.children.length ? currentMenu.children : [];
    }
}

export default MenuUtils;
