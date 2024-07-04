<!--
 * @Author: your name
 * @Date: 2020-07-30 10:33:54
 * @LastEditTime: 2022-09-01 15:03:37
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\supplyOrder\supplyOrder.vue
-->
<template>
  <div>
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      @searchData="getSearchData" @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
          <template slot="table-ifNoticeSupplier" slot-scope="{row}">
            <span > {{row.ifNoticeSupplier === 1 ? $t('supplyOrder.yes') : $t('supplyOrder.no')}} </span>
          </template>
        </g-query-table>
      </template>
    </query-page>
    <!-- 通知供应商 -->
    <el-dialog :title="$t('supplyOrder.informSupplier')" center width="600PX" top="5%" :visible.sync="partybShow">
      <div class="search_cons">
        <div>
          <p>
            {{partybNotice.content}}
          </p>
          <p style="color:rgb(255, 132, 0)">
            {{$t('supplyOrder.contentTips')}}
          </p>
          <!-- 短信通知 -->
          <div class="title">{{$t('supplyOrder.SMSNotification')}}：</div>
          <div>
            <el-input v-model="partybNotice.contactsName" size="small"
              :placeholder="`${$t('tips.pleaseEnter')}${$t('supplyOrder.contactName')}`" clearable>
            </el-input>
          </div>
          <div style="margin:20px 0;height: 50px;">
            <el-input v-model="partybNotice.telephone" size="small"
              :placeholder="`${$t('tips.pleaseEnter')}${$t('supplyOrder.contactMobile')}`" @blur="contactNumberBlur"
              clearable>
            </el-input>
            <div v-if="partybError" style="color: red">{{partybError}}</div>
          </div>
          <!-- 邮件通知 -->
          <div class="title">{{$t('supplyOrder.mailNotification')}}：</div>
          <div>
            <el-input v-model="partybNotice.emailContactsName" size="small"
              :placeholder="`${$t('tips.pleaseEnter')}${$t('supplyOrder.emailContactsName')}`" clearable>
            </el-input>
          </div>
          <div style="margin:20px 0;height: 50px;">
            <el-input v-model="partybNotice.email" size="small"
              :placeholder="`${$t('tips.pleaseEnter')}${$t('supplyOrder.email')}`" @blur="contactNumberBlur"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="footer">
          <!-- 非本人数据，不可操作。复制  -->
          <el-tooltip v-if="isDisPartyb" class="item" effect="dark"
            :content="`${$t('tips.notCreatedByMyself')}${$t('supplyOrder.copy')}`" placement="bottom">
            <el-button class="gray" type="primary" icon="el-icon-document-copy" size="small">{{$t('supplyOrder.copy')}}
            </el-button>
          </el-tooltip>
          <el-button v-else class="other" type="primary" icon="el-icon-document-copy" size="small" @click="handleCopy">
            <!-- 复制短信内容 -->
            {{$t('supplyOrder.copy')}}
          </el-button>
          <!-- 非本人数据，不可操作。发送短信 -->
          <el-tooltip v-if="isDisPartyb" class="item" effect="dark"
            :content="`${$t('tips.notCreatedByMyself')}${$t('supplyOrder.sendSMS')}`" placement="bottom">
            <el-button class="gray" type="primary" size="small" icon="el-icon-bell">{{$t('supplyOrder.sendSMS')}}</el-button>
          </el-tooltip>
          <el-button v-else class="search" size="small" icon="el-icon-bell" type="primary" @click="handleSendOut">
            <!-- 确定通知(含短信) -->
            {{$t('supplyOrder.sendSMS')}}
          </el-button>
          <!-- 非本人数据，不可操作。发送短信 -->
          <el-tooltip v-if="isDisPartyb" class="item" effect="dark"
            :content="`${$t('tips.notCreatedByMyself')}${$t('supplyOrder.noSendSMS')}`" placement="bottom">
            <el-button class="gray" type="primary" size="small" icon="el-icon-close-notification">{{$t('supplyOrder.noSendSMS')}}</el-button>
          </el-tooltip>
          <el-button v-else size="small" icon="el-icon-close-notification" type="primary" @click="handleNoSendOut">
            <!-- 确定通知(不含短信) -->
            {{$t('supplyOrder.noSendSMS')}}
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';
import Auth from 'util/auth';

export default {
  name: 'supplyOrder',
  mixins: [search],
  data () {
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      partyATypeTitle: '',
      dialogVisible: false,
      // 搜索数据
      searchData: {
        docNo: '',
        flowStatus: '',
        projectName: '',
        orderName: '',
        releaseDateFrom: '',
        releaseDateTo: '',
        supplierName: '',
        modelType: '01'
      },
      partybNotice: {},
      partybShow: false,
      partybError: '',
      isDisPartyb: false
    };
  },
  async created () {
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.handleGetTableDataList('supplyOrder/getPageList', true, () => {
        const tableData = this.pageConfig.mainTable.tableData;
        tableData.forEach((item) => {
          item.deliverCountTips = `${item.deliverCount}${this.$t('supplyOrder.see')}`;
        });
      });
    },
    // 删除
    handleDelete (row) {
      const statusConfig = {
        keyId: 'supplyOrderId',
        keyName: 'projectName',
        row,
        api: 'supplyOrder/setDelete'
      };
      this.setDataDelete(statusConfig, row);
    },
    // 通知供应商
    handlePartyb () {
      if (this.tableSeleList.length === 0) {
        this.$message({
          message: this.$t('tips.pleaseSelectData'),
          type: 'info'
        });
        return;
      }
      if (!this.judgeSamePerson(this.tableSeleList[0])) {
        this.editError(this.$t('supplyOrder.informSupplier'));
        return;
      }
      if (this.tableSeleList[0].flowStatus !== '02') {
        // 供货订单流程在未审批或正在审批中
        this.$message({
          message: this.$t('supplyOrder.underApproval'),
          type: 'info'
        });
        return;
      }
      if (this.tableSeleList[0].createBy === this.$utils.Auth.hasUserInfo().userId) {
        this.isDisPartyb = false;
      } else {
        this.isDisPartyb = true;
      }
      const arr = this.tableSeleList;
      // 生成短链接
      const longUrls = `https://s.junnysoft.com/m/#/orderLogin?id=${arr[0].id}`;
      this.$store.dispatch('supplyOrder/generateShorturls', [longUrls]).then(res => {
        if (res.status === 0 && res.results.length) {
          this.partybError = '';
          this.$store.dispatch('supplyOrder/getRepublish', { supplyOrderId: arr[0].id, jumpUrl: res.results[0].shortUrl }).then(res => {
            this.partybNotice = res.results;
            this.$set(this.partybNotice, 'emailContactsName', res.results.contactsName || '');
            this.$set(this.partybNotice, 'email', res.results.email || '');
            if (this.partybNotice.isSend === 1) {
              // 已经成功发送短信短信，无特殊情况，不需要反复发送。
              this.partybError = this.$t('supplyOrder.shortMessage');
            } else {
              this.partybError = '';
            }
            this.partybShow = true;
          });
        } else {
          // 链接出错
          this.$message({
            message: this.$t('supplyOrder.generateShorturlsError'),
            type: 'error'
          });
        }
      });
    },
    // 验证手机号
    contactNumberBlur () {
      // if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.partybNotice.telephone)) {
      //   // 请输入合法的手机号码
      //   this.partybError = `${this.$t('tips.pleaseEnter')}${this.$t('login.supplierRegMobile')}`;
      // } else {
        if (this.partybNotice.isSend === 1) {
          // 已经成功发送短信短信，无特殊情况，不需要反复发送。
          this.partybError = this.$t('supplyOrder.shortMessage');
        } else {
          this.partybError = '';
        }
      // }
    },
    // 发送短信
    handleSendOut () {
      // if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.partybNotice.telephone)) {
      //   this.partybError = `${this.$t('tips.pleaseEnter')}${this.$t('login.supplierRegMobile')}`;
      //   return;
      // }
      this.partybError = '';
      const data = {
        supplyOrderPublishId: this.partybNotice.id,
        mobile: this.partybNotice.telephone,
        contactsName: this.partybNotice.contactsName,
        emailContactsName: this.partybNotice.emailContactsName,
        email: this.partybNotice.email
      };
      this.$store.dispatch('supplyOrder/getPublish', data).then(res => {
        // 短信发送成功
        this.$message({
          message: `${this.$t('button.sendSMS')}${this.$t('tips.success')}`,
          type: 'success'
        });
        this.partybShow = false;
      });
    },
    handleNoSendOut() {
      this.partybShow = false;
    },
    // 复制
    handleCopy () {
      const oInput = document.createElement('input');
      oInput.value = this.partybNotice.content;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand('Copy'); // 执行浏览器复制命令
      // 复制成功，请不要修改链接和校验码。
      this.$message({
        message: this.$t('supplyOrder.dontModify'),
        type: 'success'
      });
      oInput.remove();
    },
    // 电子发货单
    handleDeliverCountInfo (row) {
      if (!row.deliverCount) {
        this.$message.info(this.$t('supplyOrder.deliverCountTips'));
        return;
      }
      const translateType = 'info';
      const type = this.$base64.encode('info');
      const id = this.$base64.encode(row.id);
      const routeName = 'deliverGoods';
      const RouteTitleObj = { name: routeName, loadRouteName: routeName, translateType };
      localStorage.setItem('sRouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${routeName}/${id}/${type}/supplyOrder`);
    },
    // 增、改、查 路由跳转设置
    handleSetRouter(type, row = {}) {
      if (row.id) {
        if (!this.judgeSamePerson(row) && type === 'edit') {
          this.editError(this.$t('button.edit'));
          return;
        }
      }
      const translateType = type;
      type = this.$base64.encode(type);
      const id = this.$base64.encode(row.id || 0);
      const orderSource = this.$base64.encode('supplyOrder');
      const orderSourceId = this.$base64.encode(0);
      const RouteTitleObj = { name: `${this.$route.name}Edit`, loadRouteName: this.$route.name, translateType };
      localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
      this.$router.push(`/${this.$route.name}Edit/${type}/${id}/${this.$route.name}/${orderSourceId}/${orderSource}`);
    },
    // 导出
    sysHandleExport() {
      if (this.tableSeleList.length === 0) {
        // 请选择数据
        this.$message.warning(this.$t('tips.pleaseSelectData'));
        return;
      }
      const data = {
        supplyOrderId: this.tableSeleList[0].id,
        supplyOrderName: this.$t('supplyOrder.orderExcelName')
      };
      const exportUrl = this.pageConfig.processParmas.exportUrl.url;
      if (!exportUrl) return this.$message.error(this.$t('tips.exportUrlError'));
      this.$store.dispatch(exportUrl, data).then(data => {
        if (!data) return;
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', `${this.$t('supplyOrder.orderExcelName')}.xls`);
        document.body.appendChild(link);
        link.click();
      });
    }
  }
};
</script>

<style scoped lang="scss">
.search_cons {
  padding: 20px;
  box-sizing: border-box;
  p {
    margin-bottom: 20px;
  }
}
.title{
  margin-bottom: 10px;
}
</style>
