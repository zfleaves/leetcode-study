<!--
 * @Author: your name
 * @Date: 2020-08-24 10:13:09
 * @LastEditTime: 2020-08-24 19:39:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\printTemplate\printDesign.vue
-->
<template>
  <printConfig
    :form-code="formCode"
    :task-id="taskId"
    :is-print="isPrint" :id="id"
    :printModelId="printModelId"
    :flowStatus='flowStatus'>
  </printConfig>
</template>

<script>
  export default {
    name: 'printDesign',
    components: {
      printConfig(resolve) {
        require(['./pintConfig/printConfig.vue'], resolve);
      }
    },
    data() {
      return {
        formCode: '',
        isPrint: false,
        taskId: '',
        printModelId: '',
        flowStatus: '',
        id: '',
        // 32位安装提示
        strHtmInstall: `<br><font color='#FF00FF'>${this.$t('print.print')}${this.$t('print.notInstalled')}!${this.$t('print.clickHere')}
        <a href='../../../../../../${this.$t('print.print')}/Lodop6.226_Clodop3.080/install_lodop32.exe' target='_self'>
        ${this.$t('print.implement')}</a>,${this.$t('print.afterInstallation')}。</font>`,
        // 32位升级提示
        strHtmUpdate: `<br><font color='#FF00FF'>${this.$t('print.print')}${this.$t('print.controlUpgrade')}!${this.$t('print.clickHere')}
        <a href='../../../../../../${this.$t('print.print')}/Lodop6.226_Clodop3.080/install_lodop32.exe' target='_self'>
        ${this.$t('print.performUpgradeUpdate')}</a>,${this.$t('print.reenter')}。</font>`,
        // 64位安装提示
        strHtm64_Install: `<br><font color='#FF00FF'>${this.$t('print.print')}${this.$t('print.notInstalled')}!${this.$t('print.clickHere')}
        <a href='../../../../../../${this.$t('print.print')}/Lodop6.226_Clodop3.080/install_lodop64.exe' target='_self'>
        ${this.$t('print.implement')}</a>,${this.$t('print.afterInstallation')}。</font>`,
        //  64位升级提示
        strHtm64_Update: `<br><font color='#FF00FF'>${this.$t('print.print')}${this.$t('print.controlUpgrade')}!${this.$t('print.clickHere')}
        <a href='../../../../../../${this.$t('print.print')}/Lodop6.226_Clodop3.080/install_lodop64.exe' target='_self'>
        ${this.$t('print.performUpgradeUpdate')}</a>,${this.$t('print.reenter')}。</font>`,
        // （注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）
        strHtmFireFox: `<br><br><font color='#FF00FF'>${this.$t('print.beCareful')}</font>`,
        // (如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）
        strHtmChrome: `<br><br><font color='#FF00FF'>${this.$t('print.reInstall')}</font>`,
        // Web打印服务CLodop未安装启动
        strCLodopInstall_1: `<br><font color='#FF00FF'>${this.$t('print.bootNotInstalled')}，${this.$t('print.clickHere')}
        <a href='https://static.junnysoft.cn/CLodop_Setup_for_Win32NT_https_3.083Extend.zip' target='_self'>${this.$t('print.downloadForInstallation')}</a>`,
        // （若此前已安装过，可  点这里直接再次启动
        strCLodopInstall_2: `<br>（${this.$t('print.strCLodopInstall_2Tips_1')}
        <a href='https://static.junnysoft.cn/CLodop_Setup_for_Win32NT_https_3.083Extend.zip' target='_self'>${this.$t('print.strCLodopInstall_2Tips_2')}</a>）`,
        // Web打印服务CLodop需升级
        strCLodopUpdate: `<br><font color='#FF00FF'>${this.$t('print.strCLodopUpdate')}!${this.$t('print.clickHere')}
        <a href='https://static.junnysoft.cn/CLodop_Setup_for_Win32NT_https_3.083Extend.zip' target='_self'>
        ${this.$t('print.performUpgradeUpdate')}</a>,${this.$t('print.reenter')}。</font>`,
        LODOP: '',
        printFlag: false
      };
    },
    created() {
      const params = this.$route.params;
      const query = this.$route.query;
      this.printModelId = query.printModelId ? Number(this.$base64.decode(query.printModelId)) : 0;
      this.flowStatus = query.flowStatus ? this.$base64.decode(query.flowStatus) : null;
      this.formCode = this.$base64.decode(params.formCode);
      this.taskId = this.$base64.decode(params.taskId);
      this.id = this.$base64.decode(params.id);
      // 所属云产品  subSystemCode
      this.isPrint = this.taskId !== 'template';
    },
    mounted () {
      if (this.printStr) {
        this.printFlag = true;
      }
    },
    computed: {
      printStr() {
        return this.$store.state.user.printStr;
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
