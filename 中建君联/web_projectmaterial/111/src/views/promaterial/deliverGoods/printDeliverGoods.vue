
<template>
  <div class="budget">
    <div class="headerWrap">
      <div class="logo">
        <img src="static/images/logoHeader.png" alt="" />
      </div>
      <!-- <div class="home" style="float: right;padding-right: 20px;">

        <a href="https://www.junnysoft.cn" style="color: white;" target="_blank" class="midFont set">{{$t('login.header1')}}</a>
        <a href="https://weibo.com/junnysoft" target="_blank" @mouseover="changeMask" @mouseout="changeMask"
           style="color: white;font-size: 14px;" class="midFont set">{{$t('login.header2')}}</a>
        <span @mouseover="changeMask2" @mouseout="changeMask2" style="color: white;font-size: 14px;"
              class="midFont set">{{$t('login.header3')}}</span>
        <a href="https://www.junnysoft.cn/buy.html" style="color: white;" target="_blank" class="midFont set">{{$t('print.shopOnline')}}</a>
      </div>
      <div class="qrcodes" id="imgs">
        <img ref="qrImg1" v-show="qrImg1" class="qrImg2" :src="require('assets/images/PublicWeChat.jpg')"
             :alt="$t('login.header2')">
        <img ref="qrImg2" v-show="qrImg2" class="qrImg1" :src="require('assets/images/SinaBlog.jpg')"
             :alt="$t('login.header3')">
      </div> -->
    </div>
    <div class="deliverGoodsWrap">
      <div class="roleCons">
        <!-- 送货单打印 -->
        <g-edit-title
          paddingLeft="10px"
          style="padding: 10px 0; margin-bottom: 0"
          :title="`${$t('supplyOrder.deliveryNote')}${$t('button.print')}`"
        >
          <div>
            <!-- 打印标签 -->
            <!-- <el-button type="primary" class="other" icon="el-icon-printer" size="small"
                      @click="handleLabelPrint">
              {{$t('button.printLable')}}
            </el-button> -->
            <!-- 关闭页面 -->
            <el-button
              class="urgent"
              type="primary"
              icon="el-icon-circle-close"
              size="small"
              @click="handleClosePage"
              >{{ $t("button.closePage") }}</el-button
            >
            <!-- 打印 -->
            <el-button
              type="primary"
              class="other"
              icon="el-icon-printer"
              size="mini"
              @click="handlePrintPreview('PRINT')"
              >{{ $t("print.print") }}
            </el-button>
            <!-- 打印预览 -->
            <el-button
              type="primary"
              class="more"
              icon="el-icon-view"
              size="mini"
              @click="handlePrintPreview('PREVIEW')"
              >{{ $t("print.printView") }}
            </el-button>
          </div>
        </g-edit-title>
        <div class="content">
          <div class="cons">
            <div ref="col" class="contents cons-info">
              <div class="print-content" style="border: 0">
                <div class="print-cons" ref="cons" style="overflow: hidden">
                  <!-- 送货单 -->
                  <h4
                    style="
                      color: black;
                      text-align: center;
                      font-size: 18px;
                      margin-bottom: 20px;
                    "
                  >
                    {{ $t("supplyOrder.deliveryNote") }}
                  </h4>
                  <div
                    :style="tableConsStyle"
                    class="tableCons"
                    style="margin-top: 10px; margin-bottom: -1px"
                  >
                    <table
                      border="0"
                      cellSpacing="0"
                      cellPadding="0"
                      width="100%"
                      style="border-collapse: collapse"
                    >
                      <tr>
                        <!-- 订单编号 -->
                        <td :style="mainStyle">
                          {{ $t("supplyOrder.supplyOrderDocNo") }}
                        </td>
                        <td :style="tableTdStyle">
                          {{ mainObj.supplyOrderDocNo }}
                        </td>
                        <!-- 订单名称 -->
                        <td :style="mainStyle">
                          {{ $t("fConfig.orderName") }}
                        </td>
                        <td :style="tableTdStyle">{{ mainObj.orderName }}</td>
                        <!-- <td rowspan="6" style="padding: 10px;width: 160px;
                        border:1px solid #333333;">
                          <img :src="mainObj.qrCode" style="width: 150px;" alt="">
                        </td> -->
                      </tr>
                      <tr>
                        <!-- 发货单编号 -->
                        <td :style="mainStyle">
                          {{ $t("supplyOrder.deliverCode") }}
                        </td>
                        <td :style="tableTdStyle">{{ mainObj.deliverCode }}</td>
                        <!-- 发货日期 -->
                        <td :style="mainStyle">
                          {{ $t("supplyOrder.deliverTime") }}
                        </td>
                        <td :style="tableTdStyle">
                          {{ mainObj.deliverTime | setDate }}
                        </td>
                      </tr>
                      <tr>
                        <!-- 收货单位 -->
                        <td :style="mainStyle">
                          {{ $t("supplyOrder.receiver") }}
                        </td>
                        <td :style="tableTdStyle">{{ mainObj.receiver }}</td>
                        <!-- 发货单位 -->
                        <td :style="mainStyle">
                          {{ $t("supplyOrder.deliver") }}
                        </td>
                        <td :style="tableTdStyle">{{ mainObj.deliver }}</td>
                      </tr>
                      <tr>
                        <!-- 送货人 -->
                        <td :style="mainStyle">
                          {{ $t("supplyOrder.deliverName") }}
                        </td>
                        <td :style="tableTdStyle">{{ mainObj.deliverName }}</td>
                        <!-- 车牌号 -->
                        <td :style="mainStyle">
                          {{ $t("supplyOrder.carId") }}
                        </td>
                        <td :style="tableTdStyle">{{ mainObj.carId }}</td>
                      </tr>
                      <tr>
                        <!-- 联系方式 -->
                        <td :style="mainStyle">
                          {{ $t("supplyOrder.deliverMobile") }}
                        </td>
                        <td :style="tableTdStyle">
                          {{ mainObj.deliverMobile }}
                        </td>
                        <!-- 约定到货日期 -->
                        <td :style="mainStyle">
                          {{ $t("supplyOrder.arrivalDate") }}
                        </td>
                        <td :style="tableTdStyle">
                          {{ mainObj.arrivalDate | setDate }}
                        </td>
                      </tr>
                      <tr>
                        <!-- 收货地址 -->
                        <td :style="mainStyle">
                          {{ $t("supplyOrder.address") }}
                        </td>
                        <td :style="tableTdStyle" colspan="3">
                          {{ mainObj.address }}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div
                  :style="tableConsStyle"
                  class="tableCons"
                  style="margin-top: 10px"
                  ref="table"
                >
                  <table
                    border="0"
                    cellSpacing="0"
                    cellPadding="0"
                    width="100%"
                    style="border-collapse: collapse"
                  >
                    <thead>
                      <!-- 送货明细 -->
                      <tr>
                        <td
                          style="
                            padding: 5px 0;
                            text-indent: 10px;
                            border: 1px solid #333333;
                            font-size: 14px;
                            font-weight: bold;
                          "
                          colspan="12"
                        >
                          {{ $t("supplyOrder.deliveryDetails") }}
                        </td>
                      </tr>
                      <tr>
                        <!-- 序号 -->
                        <td
                          :style="tableTdStyle"
                          style="
                            width: 5%;
                            font-weight: bold;
                            border: 1px solid #333333;
                          "
                        >
                          {{ $t("fConfig.serialNumber") }}
                        </td>
                        <td
                          :style="{ width: item.width }"
                          style="
                            font-weight: bold;
                            padding: 10px 0;
                            text-align: center;
                            border: 1px solid #333333;
                          "
                          v-show="item.flag"
                          v-for="(item, index) in list"
                          :key="index"
                        >
                          {{ $t(item.columnName) }}
                        </td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in tableList" :key="index">
                        <td :style="tableTdStyle">{{ index + 1 }}</td>
                        <td
                          :style="tableTdStyle"
                          v-for="(child, key) in item"
                          :key="key"
                        >
                          <span>{{ child }}</span>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot
                      class="table-footer"
                      :style="tableConsStyle"
                      style="padding: 0 30px; border: 0 !important"
                    >
                      <tr>
                        <th :style="tableTdStyle1" :colspan="list.length + 1">
                          <h3
                            v-show="item.flag"
                            :style="h3Style3"
                            v-for="(item, index) in printBottomList"
                            :key="index"
                          >
                            {{ item.columnName }}：
                          </h3>
                        </th>
                      </tr>
                      <tr>
                        <th :style="tableTdStyle1" :colspan="list.length + 1">
                          <h3
                            v-show="item.flag"
                            :style="h3Style2"
                            v-for="(item, index) in printFooterList"
                            :key="index"
                          >
                            <span
                              v-if="item.columnCode === 'page'"
                              style="font-size: 14px; font-weight: normal"
                            >
                              <span tdata="pageNO">{{
                                $t("print.firstPage")
                              }}</span>
                              <span>/</span>
                              <span tdata="pageCount">{{
                                $t("print.totalPage")
                              }}</span>
                            </span>
                            <span
                              v-else
                              style="font-size: 14px; font-weight: normal"
                              >{{ item.columnName }}：{{ item.columnValue }}
                            </span>
                          </h3>
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 打印插件 -->
    <el-dialog
      :visible.sync="printFlag"
      v-if="printFlag"
      :title="$t('print.printPlugIn')"
      @close="handleClose"
      :close-on-click-modal="false"
      top="25vh"
      width="70%"
    >
      <div style="height: 300px; padding: 40px; box-sizing: border-box">
        <div style="padding: 40px; box-sizing: border-box">
          <p
            style="line-height: 40px"
            v-for="(item, index) in printStr"
            :key="index"
          >
            <span style="color: #ff00ff">{{ item.title }}</span>
            <el-button
              @click.stop="handleDownload(item)"
              type="text"
              size="small"
            >
              {{ item.tips }}
            </el-button>
          </p>
          <p style="line-height: 40px">
            {{ $t("print.restartBrowserAfterDownload") }}
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//   import {getDeliverGoodsList, getDeliverQrCode} from "../../api/warehouseManagement/warehousing";
import Auth from 'util/auth';
// import { getLodop } from 'util/LodopFuncs';

export default {
  name: 'printDeliverGoods',
  data() {
    return {
      qrImg1: false,
      qrImg2: false,
      searchForm: {},
      DetailList: [],
      isDisable: false, // 表单重复提交
      list: [
        {
          id: 1,
          flag: true,
          defaultFlag: true,
          columnName: 'fConfig.varietiesName',
          columnCode: 'varietiesName',
          columnValue: '<材料名称>',
          status: 0,
          width: '10%'
        },
        {
          id: 2,
          defaultFlag: true,
          flag: true,
          columnName: 'fConfig.standards',
          columnCode: 'standards',
          columnValue: '<规格>',
          status: 0,
          width: '10%'
        },
        {
          id: 3,
          defaultFlag: true,
          flag: true,
          columnName: 'fConfig.unit',
          columnCode: 'unit',
          columnValue: '<单位>',
          status: 0,
          width: '5%'
        },
        {
          id: 4,
          defaultFlag: true,
          flag: true,
          columnName: 'fConfig.models',
          columnCode: 'models',
          columnValue: '<型号>',
          status: 0,
          width: '10%'
        },
        {
          id: 5,
          defaultFlag: true,
          flag: true,
          columnName: 'fConfig.brand',
          columnCode: 'brand',
          columnValue: '<品牌>',
          status: 0,
          width: '10%'
        },
        {
          id: 6,
          flag: true,
          defaultFlag: true,
          columnName: 'supplyOrder.orderQuantity',
          columnCode: 'orderQuantity',
          columnValue: '<订单数量>',
          status: 0,
          width: '10%'
        },
        {
          id: 9,
          flag: true,
          defaultFlag: true,
          columnName: 'supplyOrder.alreadyShipQuantity',
          columnCode: 'alreadyShipQuantity',
          columnValue: '<已发货数量>',
          status: 0,
          width: '10%'
        },
        {
          id: 7,
          flag: true,
          defaultFlag: true,
          columnName: 'supplyOrder.shippedQuantity',
          columnCode: 'shippedQuantity',
          columnValue: '<本次发货数量>',
          status: 0,
          width: '10%'
        },
        {
          id: 8,
          flag: true,
          defaultFlag: true,
          columnName: 'fConfig.price',
          columnCode: 'price',
          columnValue: '<单价>',
          status: 0,
          width: '5%',
          type: 'setMoney'
        },
        {
          id: 9,
          flag: true,
          defaultFlag: true,
          columnName: 'supplyOrder.requiredDate',
          columnCode: 'requiredDate',
          columnValue: '<需用日期>',
          status: 0,
          width: '10%',
          type: 'date'
        },
        {
          id: 11,
          flag: true,
          defaultFlag: true,
          columnName: 'fConfig.remarks',
          columnCode: 'remarks',
          columnValue: '<备注>',
          status: 0,
          width: '10%'
        }
      ],
      printBottomList: [
        {
          id: 1,
          defaultFlag: true,
          flag: true,
          columnName: this.$t('supplyOrder.deliverName'),
          columnCode: 'quality',
          columnValue: '<送货人>',
          status: 0,
          width: '10%'
        },
        {
          id: 2,
          defaultFlag: true,
          flag: true,
          columnName: this.$t('supplyOrder.consignee'),
          columnCode: 'quality',
          columnValue: '<收货人>',
          status: 0,
          width: '10%'
        },
        {
          id: 3,
          defaultFlag: true,
          flag: true,
          columnName: this.$t('supplyOrder.qualityInspector'),
          columnCode: 'quality',
          columnValue: '<质检员>',
          status: 0,
          width: '10%'
        },
        {
          id: 4,
          defaultFlag: true,
          flag: true,
          columnName: this.$t('supplyOrder.warehouseManagement'),
          columnCode: 'quality',
          columnValue: '<仓管>',
          status: 0,
          width: '10%'
        },
        {
          id: 5,
          defaultFlag: true,
          flag: true,
          columnName: this.$t('supplyOrder.seal'),
          columnCode: 'quality',
          columnValue: '<收货单位(盖章)>',
          status: 0,
          width: '10%'
        }
      ],
      // 打印
      h4Style: 'color: red;text-align: center;font-size: 18px;',
      h4StylePay: 'color: red;font-size: 18px;display: inline-block;font-weight: bold;',
      h4StylePayTitle: 'color: red;text-align: left;padding-left: 10px;font-size: 18px;font-weight: bold;border-right: 1px solid #000;',
      h3Style: 'width: 33%;text-align: left;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;position: relative;',
      h3Style1: 'margin-bottom: 5px;width: 31.5%;text-align: left;padding-left: 5px;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;position: relative;box-sizing: border-box;',
      h3Style3: 'width: 20%;text-align: left;padding-left: 5px;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;position: relative;    box-sizing: border-box;',
      h3Style2: 'width: 100%;text-align: center;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;position: relative;',
      pStyle: 'font-weight: bold;padding-left: 15px;text-align: left;font-size: 14px; color: #333333;box-sizing: border-box;',
      tableTdStyle: ' padding: 5px 0;text-align: center;border: 1px solid #333333;font-size: 14px;box-sizing: border-box;',
      tableTdStyle1: ' padding: 20px 0;text-align: center;font-size: 14px;box-sizing: border-box;',
      tableConsStyle: 'width: 100%;padding: 0 1%;margin: 0px 0 20px 0;font-size: 14px;color: #606266;box-sizing: border-box;',
      tableConsStyle1: 'width: 100%;padding: 0;margin: 0px 0 20px 0;font-size: 14px;color: #606266;',
      printContentStyle: 'width: 100%;padding: 0px 1%;margin: 10px 0;border: 1px solid #ebeef5;box-sizing: border-box;',
      tablePstyle: 'font-weight: bold;width: 100%;text-indent: 5px;border: 1px solid #333333;border-bottom: 0;',
      footStyle3: 'width: 33%;text-align: left;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;',
      footStyle2: 'width: 50%;text-align: left;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;',
      footStyle1: 'width: 100%;text-align: left;font-size: 14px;font-weight: bold;float: left;text-indent: 10px;',
      customTable1: 'width: 100%;display:block;float: left;border-top: 1px solid #333333;border-bottom: 1px solid #333333;margin-top: -1px;',
      customTable2: 'width: 50%;display:block;float: left;border-top: 1px solid #333333;border-bottom: 1px solid #333333;margin-top: -1px;',
      customTableList: 'width:50%;border-right:1px solid #333333;padding: 5px 0;font-size: 14px;word-wrap : break-word ;box-sizing: border-box;',
      customTableSupList: 'width:25%;border-right:1px solid #333333;padding: 5px 0;font-size: 14px;word-wrap : break-word ;box-sizing: border-box;',
      sortable: null,
      printShow: false,
      printForm: {
        columnName: '',
        columnValue: '',
        status: 1,
        flag: true,
        columnCode: '',
        isAdd: 0
      },
      printCloneForm: {},
      printFooterList: [
        {
          id: 1,
          defaultFlag: true,
          flag: true,
          columnName: this.$t('print.printer'), // 打印人
          columnValue: this.$utils.Auth.hasUserInfo().userName,
          columnCode: 'printName',
          status: 0
        },
        {
          id: 2,
          defaultFlag: true,
          // 页码 第x页/共x页
          flag: true,
          columnName: this.$t('print.pageNumber'),
          columnValue: this.$t('print.pageOf'),
          columnCode: 'page',
          status: 0
        },
        // 打印时间
        {
          id: 3,
          defaultFlag: true,
          flag: true,
          columnName: this.$t('print.printTime'),
          columnValue: '',
          columnCode: 'printTime',
          status: 0
        }
      ],
      showButtons: false,
      tableList: [],
      currentIndex: '',
      finishListData: false,
      sortListFlag: false,
      deliverId: '',
      companyId: '',
      mainObj: '',
      LODOP: '',
      printFlag: false,
      mainStyle: 'padding: 5px 0;text-align: center;border: 1px solid #333333;font-size: 14px;font-weight: bold;box-sizing: border-box;'
    };
  },
  created() {
    this.printCloneForm = JSON.parse(JSON.stringify(this.printForm));
    this.deliverId = this.$base64.decode(this.$route.params.id);
    //   this.companyId = query.c;
    this._getPrintMainInfo();
    this.setPrintTime();
  },
  methods: {
    // 鼠标移入移出
    changeMask() {
      this.qrImg1 = !this.qrImg1;
    },
    changeMask2() {
      this.qrImg2 = !this.qrImg2d;
    },
    _getPrintMainInfo() {
      this.$store.dispatch('supplyOrder/getDeliverInfo', { supplyOrderDeliverId: this.deliverId }).then(res => {
        if (res.status === 0) {
          const results = res.results;
          this.mainObj = results;
          // getDeliverQrCode(this.companyId, this.deliverId).then(res => {
          // if (!res.results) return;
          // this.$set(this.mainObj, 'qrCode', '');
          // this.$set(this.mainObj, 'qrCode', 'data:image/jpg;base64,' + res.results.codes);
          // })
          this.setPrintList(results.details);
        } else {
          this.$message.error(res.errorMsg);
        }
      });
    },
    handleClosePage() {
      this.$router.push('/supplyOrder');
      this.$store.commit('tagNav/removeTagNav', { name: 'deliverGoodsEdit' });
      this.$store.commit('tagNav/removeTagNav', { name: 'deliverGoods' });
    },
    // 处理明细数据
    setPrintList(arr) {
      const tableData = [];
      for (const j in arr) {
        const child = arr[j];
        const obj = {};
        for (const i in this.list) {
          const item = this.list[i];
          if (item.flag) {
            obj[item.columnCode] = child[item.columnCode] !== null ? child[item.columnCode] : '';
            if (item.type === 'date') {
              obj[item.columnCode] = child[item.columnCode] ? this.$utils.commonUtil.formatDate(child[item.columnCode]) : '';
            }
            if (item.type === 'setMoney') {
              obj[item.columnCode] = child[item.columnCode] ? this.$utils.commonUtil.toQfw(child[item.columnCode]) : '';
            }
          }
        }
        tableData.push(obj);
      }
      this.tableList = tableData;
    },
    // 设置打印时间
    setPrintTime() {
      const index = this.printFooterList.findIndex(v => v.columnCode === 'printTime');
      this.printFooterList[index].columnValue = this.$utils.commonUtil.formatTime(new Date().getTime());
    },
    //  打印相关
    handleLabelPrint() {
      const labelPrint = {
        companyId: this.companyId,
        // companyId: 342,
        materialCodes: [],
        details: this.tableList
      };
      labelPrint.materialCodes = this.tableList.map(v => v.materialCode);
      Auth.setLabelPrint(labelPrint);
      this.$router.push('/labelPrint');
    },
    // 点击按钮时判断是否能打印
    handlePrintPreview(type) {
      // if (!this.LODOP) {
      //   this.LODOP = getLodop();
      // }
      // if (this.LODOP === undefined) {
      //   const arr = [
      //     {
      //       // Web打印服务CLodop未安装启动，点击这里
      //       title: this.$t('print.clodopNotInstalled'),
      //       url: 'https://static.junnysoft.cn/CLodop_Setup_for_Win32NT_https_3.083Extend.zip',
      //       tips: this.$t('print.downloadForInstallation') // '下载执行安装'
      //     },
      //     {
      //       // Web打印服务CLodop需升级!点击这里
      //       title: `${this.$t('print.clodopNotInstalled')}!${this.$t('print.clickHere')}`,
      //       url: 'https://static.junnysoft.cn/CLodop_Setup_for_Win32NT_https_3.083Extend.zip',
      //       tips: this.$t('print.strCLodopInstall_2Tips_2') // '点这里直接再次启动'
      //     }
      //   ];
      //   this.printStr = arr.slice();
      //   this.printFlag = true;
      //   return;
      // }
      this.PrintSetting();
      this.LODOP[type]();
    },
    // 打印配置
    PrintSetting() {
      // eslint-disable-next-line no-undef
      const hiprintTemplate = new hiprint.PrintTemplate({
        // template: customPrintJson,
        settingContainer: '#app',
        paginationContainer: '.hiprint-printPagination'
      });
      const table = this.$refs.table;
      const cons = this.$refs.cons;
      const consHeight = cons.offsetHeight;
      const isPortrait = this.isPortrait;
      // 纵向
      const portraitConfig = {
        width: 210,
        height: 297,
        paperFooter: 750,
        paperHeader: 10,
        paperType: 'A4',
        topOffset: 20,
        // paperNumberDisabled: false,
        paperNumberLeft: 280, // 页码 放入中减
        paperNumberTop: 800 // 页码 放入中减
      };
      // 横向
      const transverseConfig = {
        width: 297,
        height: 210,
        paperFooter: 520,
        paperHeader: 10,
        paperType: 'A4',
        paperNumberDisabled: false,
        paperNumberTop: 550, // 页码 放入中减
        paperNumberLeft: 380,
        rotate: true,
        topOffset: 20
      };
      const config = isPortrait ? portraitConfig : transverseConfig; // 默认为纵向
      const consWidth = isPortrait ? 500 : 720;
      const left = isPortrait ? 46 : 50;
      const panel = hiprintTemplate.addPrintPanel(
        {
          ...config
        }
      );
      panel.addPrintHtml({
        options: {
          width: consWidth + 10,
          height: 35,
          top: 10,
          'left': left,
          content: cons.innerHTML
        }
      });
      panel.addPrintTable({
        options: {
          'left': left,
          'top': consHeight + 30,
          'height': 38,
          'width': consWidth + 10,
          'textAlign': 'center',
          'content': table.innerHTML
        }
      });
      hiprintTemplate.print();
      hiprintTemplate.clear();
    },
    handleClose() {
      this.printStr = [];
      this.printFlag = false;
    },
    handleDownload(item) {
      const url = item.url;
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      this.$message({
        message: this.$t('print.restartBrowserAfterDownload'),
        type: 'success'
      });
    }
  }
};
</script>

<style scoped lang="scss">
.budget {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f2f4f7;
  .headerWrap {
    width: 100%;
    padding: 0 10px;
    line-height: 50px;
    height: 50px;
    z-index: 999;
    position: relative;
    background: rgb(0, 141, 255);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    .logo {
      float: left;
      margin-right: 10px;
      img {
        height: 35px;
        margin-top: 9px;
      }
    }
    span {
      font-size: 42px;
      color: white;
      /*font-family: "新宋体";*/
    }
    .home {
      a {
        margin: 0 16px;
        font-size: 16px;
      }
      span {
        margin: 0 16px;
      }
    }
  }
  .deliverGoodsWrap {
    height: calc(100% - 70px);
    width: 80% !important;
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: white;
  }
  .roleCons {
    flex: auto;
    display: flex;
    flex-direction: column;
    .search_cons {
      background: white;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    .title {
      padding: 10px 0;
      text-align: right;
      padding-right: 20px;
    }
    .content {
      flex: auto;
      height: 100%;
      padding: 0px 10px 10px 10px;
      background: white;
      position: relative;
      .cons {
        position: absolute;
        left: 0;
        right: 0;
        top: 10px;
        bottom: 10px;
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
        .imageWrapper {
          float: left;
          position: relative;
          margin-bottom: 10px;
          margin-right: 10px;
          width: 348px;
          overflow: hidden;
          background: white;
          .imageWrapperCons {
            cursor: pointer;
            overflow: hidden;
            width: 100%;
            position: relative;
            padding: 5px 0px;
            /*height: 100%;*/
            border: 1px solid rgb(44, 44, 44);
            border-radius: 5px;
            &.active {
              border: 1px solid #0180d0;
              .check {
                display: block;
              }
            }
            .title {
              height: 40px;
              text-align: center;
              line-height: 40px;
              color: black;
              font-size: 20px;
              font-weight: 700;
              padding: 0 12px;
              border-bottom: 1px solid rgb(44, 44, 44);
              border-radius: 0px;
              img {
                height: 36px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 30px;
                position: relative;
                top: -3px;
              }
              span {
                float: right;
                font-size: 14px;
                font-weight: 400;
                position: relative;
                top: 8px;
              }
            }
            .materName {
              height: 32px;
              line-height: 32px;
              background: white;
              width: 100%;
              font-weight: 500;
              border-radius: 0px;
              text-indent: 8px;
              color: black;
              margin-bottom: 5px;
              border-bottom: 1px solid rgb(44, 44, 44);
              padding: 0 12px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
            .image-cons {
              width: 100%;
              height: auto;
              padding: 0 12px;
              .left {
                width: 205px;
                float: left;
                margin-right: 5px;
                padding: 0px 10px;
                background: white;
                p {
                  line-height: 28px;
                  height: 28px;
                  font-size: 12px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                  &:last-child {
                    margin-bottom: 0;
                  }
                }
              }
              .right {
                width: 112px;
                height: 112px;
                text-align: center;
                overflow: hidden;
                background: white;
                align-items: center;
                img {
                  width: 94%;
                  position: relative;
                  top: 1px;
                }
              }
            }
            .check {
              position: absolute;
              top: -1px;
              right: 0px;
              display: none;
              height: 20px;
              border-left: 1px solid #0180d0;
              border-bottom: 1px solid #0180d0;
              opacity: 1;
              i {
                color: #0180d0;
                font-size: 24px;
                position: relative;
                top: -2px;
              }
            }
          }
        }
        &.labelPrintFlag {
          .imageWrapperCons {
            border: 1px solid rgb(44, 44, 44) !important;
            .check {
              display: none !important;
            }
          }
        }
      }
    }
  }
  .qrcodes {
    position: absolute;
    top: 66px;
    right: 50px;
    height: 120px;
    img {
      width: 120px;
      display: block;
      position: relative;
      float: right;
      &.qrImg1 {
        right: 50px;
      }
      &.qrImg2 {
        right: 162px;
      }
    }
  }
}
</style>
