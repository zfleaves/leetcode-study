/* eslint-disable */
import store from "store";
import {Message} from 'element-ui'

var CreatedOKLodop7766 = null, CLodopIsLocal;
//====判断是否需要 Web打印服务CLodop:===
//===(不支持插件的浏览器版本需要用它)===
function needCLodop() {
  try {
    return true;
  } catch (err) {
    return true;
  }
}

// ====页面引用CLodop云打印必须的JS文件,用双端口(8000和18000）避免其中某个被占用：====
if (needCLodop()) {
  var src1 = "https://localhost:8443/CLodopfuncs.js?priority=1";
  var src2 = "https://localhost:8443/CLodopfuncs.js?priority=1";

  // var src1 = "http://localhost:8000/CLodopfuncs.js?priority=1";
  // var src2 = "http://localhost:18000/CLodopfuncs.js?priority=0";
  // var src1 = '';
  // var src2 = '';

  var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
  var oscript = document.createElement("script");
  oscript.src = src1;
  head.insertBefore(oscript, head.firstChild);
  oscript = document.createElement("script");
  oscript.src = src2;
  head.insertBefore(oscript, head.firstChild);
  CLodopIsLocal = !!((src1 + src2).match(/\/\/localho|\/\/127.0.0./i));
}

//====获取LODOP对象的主过程：====
export function getLodop(oOBJECT, oEMBED) {
  let LODOP;
  try {
    let ua = navigator.userAgent;
    let isIE = !!(ua.match(/MSIE/i)) || !!(ua.match(/Trident/i));
    if (needCLodop()) {
      try {
        LODOP = getCLodop();
      } catch (err) {
      }
      if (!LODOP && document.readyState !== "complete") {
        this.$message({
          // 网页还没下载完毕，请稍等一下再操作
          message: this.$t('print.downloadIncomplete'),
          type: 'info'
        })
        return;
      }
      if (!LODOP) {
        return;
      } else {
        if (CLODOP.CVERSION < "3.0.8.0") {
          let arr = [];
          let obj1 = {
            // Web打印服务CLodop未安装启动，点击这里
            title: this.$t('print.downloadIncomplete'),
            url: "https://static.junnysoft.cn/CLodop_Setup_for_Win32NT_https_3.083Extend.zip",
            // 执行升级,升级后请刷新页面
            tips: this.$t('print.refreshPage'),
          };
          arr.push(obj1);
          store.commit("diaLog/SET_PRINT_STR", arr);
        }
        if (oEMBED && oEMBED.parentNode)
          oEMBED.parentNode.removeChild(oEMBED);
        if (oOBJECT && oOBJECT.parentNode)
          oOBJECT.parentNode.removeChild(oOBJECT);
      }
    } else {
      let is64IE = isIE && !!(ua.match(/x64/i));
      //=====如果页面有Lodop就直接使用，没有则新建:==========
      if (oOBJECT || oEMBED) {
        if (isIE)
          LODOP = oOBJECT;
        else
          LODOP = oEMBED;
      } else if (!CreatedOKLodop7766) {
        LODOP = document.createElement("object");
        LODOP.setAttribute("width", 0);
        LODOP.setAttribute("height", 0);
        LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
        if (isIE)
          LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
        else
          LODOP.setAttribute("type", "application/x-print-lodop");
        document.documentElement.appendChild(LODOP);
        CreatedOKLodop7766 = LODOP;
      } else
        LODOP = CreatedOKLodop7766;
      //=====Lodop插件未安装时提示下载地址:==========
      if ((!LODOP) || (!LODOP.VERSION)) {
        if (ua.indexOf('Chrome') >= 0) {

        }
        // document.body.innerHTML = strHtmChrome + document.body.innerHTML;
        if (ua.indexOf('Firefox') >= 0) {

        }
        // document.body.innerHTML = strHtmFireFox + document.body.innerHTML;
        // document.body.innerHTML = (is64IE ? strHtm64_Install : strHtmInstall) + document.body.innerHTML;
        let arr = [];
        let obj1 = {
          title: this.$t('print.downloadIncomplete'),
          url: "https://static.junnysoft.cn/CLodop_Setup_for_Win32NT_https_3.083Extend.zip",
          tips: this.$t('print.refreshPage'),
        };
        arr.push(obj1);
        return LODOP;
      }
    }
    if (LODOP.VERSION < "6.2.2.6") {
      // if (!needCLodop())
      // document.body.innerHTML = (is64IE ? strHtm64_Update : strHtmUpdate) + document.body.innerHTML;
    }
    //===如下空白位置适合调用统一功能(如注册语句、语言选择等):==

    //=======================================================
    return LODOP;
  } catch (err) {
    // 链接不到打印机,链接后再试
    this.$message({
      message: this.$t('print.linkNotToPrint'),
      type:"error"
    })
  }
}


