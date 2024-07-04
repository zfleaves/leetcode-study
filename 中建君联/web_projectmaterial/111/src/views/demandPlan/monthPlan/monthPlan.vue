<!--
 * @Author: your name
 * @Date: 2020-07-24 15:21:13
 * @LastEditTime: 2020-08-21 09:34:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\demandPlan\monthPlan\monthPlan.vue
-->
<template>
  <div>
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @searchEvent="searchEvent">
        <template slot="mainTable" slot-scope="config">
          <g-query-table
            :config="config.scope"
            :tableList.sync="tableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
            <span slot="table-applyMonth" slot-scope="{row, item}">
              {{row[item.prop].substring(0, 4)}}{{$t('time.year')}}{{row[item.prop].substring(5, 7)}}{{$t('time.month')}}
            </span>
            <span slot="table-detailItem" slot-scope="{row, item}">
              {{row[item.prop]}}{{$t('monthPlan.term')}}
            </span>
            <template slot="table-ifFastSporadicPurchase" slot-scope="{row}">
              <span > {{row.ifFastSporadicPurchase === 1 || row.ifFastSupplyOrder === 1 ? $t('tips.yes') : $t('tips.no')}} </span>
            </template>
            <template slot="table-buts-suffix" slot-scope="{scope}">
              <el-button  :disabled="setQuickOrderStatus(scope.row)"
                v-if="authButtonList.indexOf('quickOrder') >= 0 ? true :false"
                 @click.stop.prevent="handleQuickOrder(scope.row)"
                type="text" size="mini" v-fast-click>
                {{$t('monthPlan.quickOrder')}}
              </el-button>
            </template>
          </g-query-table>
        </template>
    </query-page>
    <!--快速下单 -->
    <g-dialog v-if="dialogVisible" :dialogConfig="dialogVisibleConfig" :isVisible.sync="dialogVisible">
      <div class="content" slot="body">
        <div class="title">
          <!-- 下单方式 -->
          <span class="title-tips">{{$t('monthPlan.orderingMethod')}}：</span>
          <span>
              <!--下送货通知单、下零星采购单。  -->
              <el-radio v-model="fastSupplyOrder" label="supplyOrder">{{$t('monthPlan.delivery')}}</el-radio>
              <el-radio v-model="fastSupplyOrder" label="sporadicPurchase">{{$t('monthPlan.sporadicPurchase')}}</el-radio>
          </span>
        </div>
        <!-- 注：下送货通知单时必须关联一个合同进行下单。 -->
        <div class="tipsText">
          <span style="color: red;">{{$t('monthPlan.explainTips')}}</span>
        </div>
      </div>
      <div slot="footer" class="footer">
        <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small" @click="dialogVisible = false">
          {{$t('button.close')}}
        </el-button>
        <el-button size="small" type="primary" icon="el-icon-circle-check" @click="drawerItemSave" v-fast-click>
          {{$t('button.determine')}}
        </el-button>
      </div>
    </g-dialog>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'monthPlan',
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
        dialogVisibleConfig: {
          title: this.$t('monthPlan.quickOrder'),
          appendBody: false,
          center: true,
          top: '200px',
          width: '25%',
          span: '0.25'
        },
        fastSupplyOrder: '',
        orderList: {},
        // 搜索数据
        searchData: {
          applyMonth: '',
          createByName: '',
          createTimeFrom: '',
          createTimeTo: '',
          docNo: '',
          flowStatus: '',
          projectName: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('monthPlan/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'monthPlanId',
          keyName: 'projectName',
          row,
          api: 'monthPlan/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      },
      setQuickOrderStatus(row) {
          return Number(row.ifFastSporadicPurchase) === 1 || Number(row.ifFastSupplyOrder) === 1 || row.flowStatus !== '02';
      },
      // 快速下单
      handleQuickOrder(row) {
        this.dialogVisible = true;
        this.orderList = row;
      },
      // 下单
      drawerItemSave() {
        const routeName = this.fastSupplyOrder === 'supplyOrder' ? 'supplyOrder' : 'sporadicPurchase';
        if (!this.fastSupplyOrder) {
          return this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('monthPlan.orderingMethod')}`);
        }
        // 您没有_送货通知单_的菜单权限，不能下单，请联系管理员后再来操作。
        const menu = this.$utils.menu.getCurrentMenu(routeName);
        if (JSON.stringify(menu) === '{}') {
          return this.$message.error(this.$t('monthPlan.menuTips').replace('{keyValue}', this.$t(`${'menu.'}${routeName}`)));
        }
        // console.log(menu, 'menu');
        this.handleQuickOrderRouter(this.orderList, routeName);
        this.dialogVisible = false;
      },
      handleQuickOrderRouter(row, name, type = 'order') {
        this.fastSupplyOrder = '';
        const translateType = type;
        type = this.$base64.encode(type);
        const orderSourceId = this.$base64.encode(row.id || 0);
        const id = this.$base64.encode(0);
        const routeName = name;
        const orderSource = this.$base64.encode('monthPlan');
        const RouteTitleObj = { name: `${routeName}Edit`, loadRouteName: routeName, translateType };
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        this.$router.push(`/${routeName}Edit/${type}/${id}/${routeName}/${orderSourceId}/${orderSource}`);
      }
    }
  };
</script>

<style scoped lang="scss">
.content{
  padding: 10px;
  margin-bottom: 40px;
  .title {
    height: 70px;
    line-height: 70px;
    .title-tips {
      margin-right: 20px;
    }
  }
}
</style>
