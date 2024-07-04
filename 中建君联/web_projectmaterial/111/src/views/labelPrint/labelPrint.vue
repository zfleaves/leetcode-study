<template>
  <div class="budget">
    <div class="headerWrap">
      <!-- <div class="logo">
        <img :src="require('assets/images/logoHeader.png')" alt="">
      </div> -->
    <headNavigation>
    </headNavigation>
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
        <!-- 搜索 -->
        <div class="search_cons">
          <el-form :model="searchForm" ref="searchForm" label-width="120px" class="demo-ruleForm">
            <el-row :gutter="20">
              <el-col :span="6">
                  <!-- 打印设备名称 -->
                <el-form-item :label="$t('print.equipmentName')" prop="equipmentCode">
                  <el-select
                    size="small" v-model="searchForm.equipmentCode"
                    :placeholder="$t('print.equipmentNameTips')">
                    <el-option
                      v-for="(item,index) in equipmentList"
                      :label="item.equipmentName" :value="item.equipmentCode"
                      :key="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <!-- 打印设备编号 -->
                <el-form-item :label="$t('print.equipmentCode')" prop="equipmentCode">
                  <el-input
                    v-model="searchForm.equipmentCode"
                    size="small" clearable disabled>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                  <!-- 标签打印尺寸 -->
                <el-form-item :label="$t('print.printSize')" prop="sizeId">
                  <el-select
                    @change="handleSetSize"
                    size="small" v-model="searchForm.sizeId">
                    <el-option
                      v-for="(item) in sizeList"
                      :label="item.label" :value="item.id"
                      :key="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" class="search_cons_btn">
                <el-button
                  class="other"
                  icon="el-icon-printer"
                  type="primary" size="small" @click="updatePrinterList">
                  <!-- 发送打印任务 -->
                  {{$t('print.sendPrintTask')}}
                </el-button>
                <el-button
                  class="more"
                  icon="el-icon-arrow-left"
                  type="primary" size="small" @click="handleBack">
                  <!-- 关闭本页面 -->
                  {{$t('print.closePage')}}
                </el-button>
              </el-col>
            </el-row>

          </el-form>
        </div>
        <!-- 表头 -->
        <div class="content">
          <div class="choice">
              <!-- 选择 -->
            <span>{{$t('fConfig.choice')}}：</span>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll" @change="handleCheckAllChange">
              {{checkAll ? $t('print.counterElection') : $t('print.selectAll')}}
              <!-- 反选 全选 -->
            </el-checkbox>
            <!-- 已选择打印标签  条-->
            <span style="margin: 0 5px;">({{$t('print.printLabelSelected')}} <span class="midFont set">{{checkLabelNum}}</span>{{$t('print.strip')}})</span>
            <!-- 最多选择标签数量不能超过 -->
            <span style="margin: 0 5px;">({{$t('print.cannotExceed')}}<span
              class="midFont set">{{checkMaxLabelNum}}</span>{{$t('print.strip')}})</span>
          </div>
          <div
            :class="labelPrintFlag?'labelPrintFlag':''"
            class="cons">
            <div v-for="(item,index) in list" :key="index"
                 :class="item.flag?'active':''"
                 class="imageWrapper" :ref="item.flag?'imageWrapper':''">
              <div
                :class="item.flag?'active':''"
                @click="handleCheckLabel(item)"
                class="imageWrapperCons">
                <div class="check">
                  <i class="el-icon-check"></i>
                </div>
                <div class="title" v-if="false">
                   <!-- 物资标签卡 -->
                   {{$t('print.materialLabelCard')}}
                   <!-- 施工管理云 -->
                  <span>{{$t('print.CMCloud')}}</span>
                </div>
                <!-- 名称 -->
                <div class="materName">{{$t('print.columnName')}}：{{item.materialName}}</div>
                <div class="image-cons">
                  <div class="left">
                      <!-- 规格 -->
                    <p>{{$t('fConfig.standards')}}：{{item.standards}}</p>
                    <!-- 型号 -->
                    <p>{{$t('fConfig.models')}}：{{item.models}}</p>
                    <!-- 编号 -->
                    <p>{{$t('fConfig.code')}}：{{item.materialCode}}</p>
                    <!-- 单位 -->
                    <p>{{$t('fConfig.unit')}}：{{item.unit}}</p>
                  </div>
                  <div class="right">
                    <img :src="item.codes" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas';
  import Auth from 'util/auth';

  const maxLabelNum = 50; // 最多打印的标签数量


  export default {
    name: 'labelPrint',
    data() {
      return {
        checkMaxLabelNum: maxLabelNum,
        labelPrintFlag: false,
        list: [],
        checkAll: false,
        sizeList: [
            // 小标签  横向
            // 中标签  横向
            // 中标签  纵向
            // 大标签  纵向
          {label: `${this.$t('print.smallLabel')}(${this.$t('print.transverse')}40mm*28mm)`, width: 40, height: 28, id: 2, type: '40_28'},
          {label: `${this.$t('print.middleLabel')}(${this.$t('print.transverse')}60mm*30mm)`, width: 60, height: 30, id: 3, type: '60_30'},
          {label: `${this.$t('print.middleLabel')}(${this.$t('print.portrait')}40mm*80mm)`, width: 40, height: 80, id: 4, type: '40_80'},
          {label: `${this.$t('print.bigLabel')}(${this.$t('print.portrait')}35mm*95mm)`, width: 35, height: 95, id: 5, type: '35_95'}
        ],
        size: '',
        searchForm: {
          bindingStatus: '',
          equipmentName: '',
          equipmentCode: '',
          sizeId: ''
        },
        equipmentList: [],
        imgUrl: '',
        printName: '',
        printValue: '',
        laAPI: '',
        imgUrlList: [],
        qrImg1: false,
        qrImg2: false
      };
    },
    computed: {
      isIndeterminate() {
        if (this.list.length === 0) {
          return false;
        } else {
          const arr = this.list.filter(v => v.flag);
          return arr.length > 0 && arr.length < this.list.length;
        }
      },
      computedCheckAll() {
        if (this.list.length === 0) {
          return false;
        } else {
          const arr = this.list.filter(v => v.flag);
          return arr.length === this.list.length;
        }
      },
      checkLabelNum() {
        const arr = this.list.filter(v => v.flag);
        return arr.length;
      }
    },
    created() {
      this._getPrintRelationPagList();
      const index = this.sizeList.findIndex(v => v.id === this.searchForm.sizeId);
      this.size = this.sizeList[index];
      this._getLabelPrintList();
    },
    methods: {
      _getPrintRelationPagList() {
        this.$store.dispatch('warIncoming/getPrintRelationList').then(res => {
          if (res.status === 0) {
            for (const i in res.results) {
              const item = res.results[i];
              if (item.isDefault === '02') {
                this.searchForm.equipmentName = item.equipmentName;
                this.searchForm.equipmentCode = item.equipmentCode;
              }
            }
            this.equipmentList = res.results;
          } else {
            this.$message.error(res.errorMessage);
          }
        });
      },
      // 鼠标移入移出
      changeMask() {
        this.qrImg1 = !this.qrImg1;
      },
      changeMask2() {
        this.qrImg2 = !this.qrImg2;
      },
      // 获取打印数据
      _getLabelPrintList() {
        const labelPrint = Auth.hasLabelPrint();
        if (labelPrint === '') {
            // 请在上一个页面选择物资，再来进行打印
          this.$message.error(this.$t('print.previousPageSelection'));
          return;
        }
         this.$store.dispatch('warIncoming/getMaterialQrCodesList', labelPrint.materialIds).then(res => {
          if (res.status === 0) {
            this.checkAll = res.results.length <= maxLabelNum;
            for (let i = 0; i < res.results.length; i++) {
              const item = res.results[i];
              item.flag = i < maxLabelNum;
              item.codes = `data:image/jpg;base64,${item.codes}`;
              const index = Number(i);
              item.materialName = index >= 0 ? labelPrint.details[index].materialName : '';
              const standards = labelPrint.details[index].standards || labelPrint.details[index].standards || '';
              item.standards = index >= 0 ? standards : '';
              item.models = index >= 0 ? labelPrint.details[index].models : '';
              item.manufacturer = index >= 0 ? labelPrint.details[index].manufacturer : '';
              item.unit = index >= 0 ? labelPrint.details[index].unit : '';
            }
            this.list = res.results;
          } else {
            this.$message.error(res.errorMsg);
          }
        });
      },
      // 切换类型
      handleSetSize(val) {
        const index = this.sizeList.findIndex(v => v.id === val);
        this.size = this.sizeList[index];
      },
      // 获取和设置打印机参数
      updatePrinterList() {
        if (!this.searchForm.equipmentCode) {
            // 请选择打印设备
          this.$message.error(this.$t('print.equipmentNameTips'));
          return;
        }
        if (!this.searchForm.sizeId) {
            // 请选择标签打印尺寸
          this.$message.error(this.$t('print.printSizeTips'));
          return;
        }
        const index = this.sizeList.findIndex(v => v.id === this.searchForm.sizeId);
        this.size = this.sizeList[index];
        const printDataDtos = [];
        const arr = this.list.filter(v => v.flag);
        if (this.list.length === 0) {
            // 暂无可以打印的标签
          this.$message.error(this.$t('print.noLabelToPrint'));
          return;
        }
        if (arr.length === 0) {
            // 请选择你需要打印的标签
          this.$message.error(this.$t('print.selectLabel'));
          return;
        }
        if (arr.length > maxLabelNum) {
            // 选择打印的标签最多50条
          this.$message.error(this.$t('print.upTo'));
          return;
        }
        for (const i in arr) {
          const item = arr[i];
          printDataDtos.push({
            materialCode: item.materialCode || '',
            materialName: item.materialName || '',
            models: item.models || '',
            standards: item.standards || '',
            unit: item.unit || '',
            manufacturer: item.manufacturer || ''
          });
        }
        const data = {
          deviceId: this.searchForm.equipmentCode,
          printType: this.size.type,
          printDataDtos
        };
        // 发送打印任务中。。。
        const loading = this.getLoading(this.$t('print.sending'));
        this.$store.dispatch('warIncoming/printRelationData', data).then(res => {
          if (res.status === 0) {
            //   打印成功
            this.$message.success(this.$t('print.printingSuccessful'));
          } else {
            this.$message.error(res.errorMessage);
          }
          loading.close();
        }).catch(e => {
          loading.close();
        });
      },
      // 生成图片
      handleGetImage() {
        const index = this.sizeList.findIndex(v => v.id === this.searchForm.sizeId);
        this.size = this.sizeList[index];
        this.imgUrlList = [];
        const arr = this.list.filter(v => v.flag);
        if (this.list.length === 0) {
            // 暂无可以打印的标签
          this.$message.error(this.$t('print.noLabelToPrint'));
          return;
        }
        if (arr.length === 0) {
            // 请选择你需要打印的标签
          this.$message.error(this.$t('print.selectLabel'));
          return;
        }
        if (arr.length > maxLabelNum) {
            // 选择打印的标签最多50条
          this.$message.error(this.$t('print.upTo'));
          return;
        }
        this.labelPrintFlag = true;
        const timeout = setTimeout(() => {
          const imageWrapper = this.$refs.imageWrapper;
          for (let i = 0; i < imageWrapper.length; i++) {
            const item = imageWrapper[i];
            const itemClass = item.getAttribute('class');
            console.log(itemClass);
            item.style.transform = this.size.rotateZ;
            html2canvas(item, {
              backgroundColor: null
            }).then((canvas) => {
              const dataURL = canvas.toDataURL('image/png');
              this.imgUrl = dataURL;
              this.imgUrlList.push(dataURL);
              item.style.transform = 'rotateZ(0deg)';
              if (i === imageWrapper.length - 1) {
                console.log(this.imgUrlList);
                this.labelPrintFlag = false;
                // 直接打印图片
                this.handlePrintImage();
              }
            });
          }
          clearTimeout(timeout);
        }, 100);
      },
      // 全选
      handleCheckAllChange(val) {
        console.log(val);
        for (const i in this.list) {
          const item = this.list[i];
          item.flag = val;
        }
      },
      // 勾选
      handleCheckLabel(item) {
        const arr = this.list.filter(v => v.flag);
        if (item.flag) {
          item.flag = false;
        } else {
          if (arr.length >= maxLabelNum) {
            //   一次打印标签不能超过50个
            this.$message.error(this.$t('print.printingCannotExceed'));
          } else {
            item.flag = true;
          }
        }
        const checkLength = this.list.filter(v => v.flag).length;
        this.checkAll = checkLength === this.list.length;
      },
      // 关闭本页面
      handleBack() {
        this.$router.go(-1);
      }
    }
  };
</script>

<style scoped lang="scss">
  .budget {
    height: 100%;
    width: 100%;
    /deep/ .header .logo{
      height: 70px;
      line-height: 70px;
      overflow: hidden;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    }
    a{
        text-decoration:none;
    }
    .headerWrap {
      width: 100%;
      // line-height: 50px;
      // height: 50px;
      z-index: 999;
      position: relative;
      // background: linear-gradient(90deg,#2b74ec,#2b74ec);
      // border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      /*img{*/
      /*height: 70px;*/
      /*}*/
      .logo {
        float: left;
        margin-right: 10px;
        height: 50px;
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
          font-size: 14px;
        }
        span {
          margin: 0 16px;
        }
      }
    }
    .deliverGoodsWrap {
      height: calc(100% - 80px);
      padding: 10px;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      // background: #f5f5f5;
      /*padding: 20px;*/
      /*background: white;*/
    }
    .roleCons {
      flex: auto;
      display: flex;
      flex-direction: column;
      /*padding-bottom: 10px;*/
      .search_cons {
        background: white;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        padding: 20px;
        box-sizing: border-box;
      }
      .title {
        padding: 10px 0;
        text-align: right;
        border-right: 1px solid #ccc;
        border-left: 1px solid #ccc;
        padding-right: 20px;
        box-sizing: border-box;
      }
      .content {
        border: 1px solid #ccc;
        flex: auto;
        height: 100%;
        padding: 0px 10px 10px 10px;
        background: white;
        /*min-height: 500px !important;*/
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        /*max-height: 500px !important;*/
        position: relative;
        margin-top: 5px;
        box-sizing: border-box;
        .choice {
          margin: 10px 0;
        }
        /*background: pink;*/
        .cons {
          position: absolute;
          //width: 100%;
          //padding: 10px 0;
          left: 10px;
          right: 10px;
          //padding: 10px;
          top: 40px;
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
            /*transform-origin: top right;*/
            /*transform: rotateZ(90deg);*/
            /*&:nth-child(3n) {*/
            /*margin-right: 0;*/
            /*}*/
            .imageWrapperCons {
              cursor: pointer;
              overflow: hidden;
              width: 100%;
              position: relative;
              padding: 5px 0px;
              /*height: 100%;*/
              border: 1px solid rgb(44, 44, 44);
              border-radius: 5px;
              box-sizing: border-box;
              &.active {
                border: 1px solid #0180d0;
                .check {
                  display: block;
                }
                /*.title{*/
                /*border-bottom: 1px solid #0180d0;*/
                /*}*/
                /*.materName{*/
                /*border-bottom: 1px solid #0180d0;*/
                /*}*/
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
                  /*margin-left: 20px;*/
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
                box-sizing: border-box;
              }
              .image-cons {
                width: 100%;
                height: auto;
                padding: 0 12px;
                box-sizing: border-box;
                .left {
                  width: 205px;
                  float: left;
                  margin-right: 5px;
                  padding: 0px 10px;
                  background: white;
                  box-sizing: border-box;
                  p {
                    line-height: 28px;
                    /*margin-bottom: 5px;*/
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
                  /*border: 1px solid black;*/
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
