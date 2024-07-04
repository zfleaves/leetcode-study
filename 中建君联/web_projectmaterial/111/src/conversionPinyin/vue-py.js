import { pinyin } from './const.js';

export default {
    chineseToPinYin (l1) {
        const l2 = l1.length;
        let I1 = '';
        const reg = new RegExp('[a-zA-Z0-9]');
        for (let i = 0; i < l2; i++) {
            const val = l1.substr(i, 1);
            const name = this.arraySearch(val, pinyin);
            if (reg.test(val)) {
                I1 += val;
            } else if (name !== false) {
                I1 += name;
            }
        }
        I1 = I1.replace(/ /g, '-');
        while (I1.indexOf('--') > 0) {
            I1 = I1.replace('--', '-');
        }
        return I1;
    },
    arraySearch (l1) {
        for (const name in pinyin) {
            if (pinyin[name].indexOf(l1) !== -1) {
                return this.ucfirst(name);
            }
        }
        return false;
    },
    ucfirst (l1) {
        if (l1.length > 0) {
            const first = l1.substr(0, 1).toUpperCase();
            const spare = l1.substr(1, l1.length);
            return first + spare;
        }
    }
};
