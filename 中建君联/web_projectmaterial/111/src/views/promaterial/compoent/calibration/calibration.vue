<!--
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-07-14 09:35:44
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-12-09 15:22:00
 * @FilePath: \web_contract\src\views\contractExpend\components\calibration\calibration.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="calibration">
        <!-- 已选价格依据编号 -->
        <div class="title"><span class="midFont set">{{$t('supplyOrder.selectBiddingCode')}}：</span>{{selectInfoData.inquiryDocNo}}</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 01在线询价,02线下询价 -->
            <el-tab-pane :label="$t('supplyOrder.onlineInquiry')" name="01">
                <onlineInquiry v-if="activeName === '01'" :dialogHeight="dialogHeight" :projectId="projectId" :selectInfo="selectInfoData" @getSelect="getSelect"
                    @getData="getData"  :close.sync="isDialogShow"></onlineInquiry>
            </el-tab-pane>
            <el-tab-pane :label="$t('supplyOrder.offlineInquiry')" name="02">
                <offlineInquiry v-if="activeName === '02'" :dialogHeight="dialogHeight" :projectId="projectId" :selectInfo="selectInfoData" @getSelect="getSelect"
                    @getData="getData"  :close.sync="isDialogShow"></offlineInquiry>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    name: 'calibration',
    data() {
        return {
            activeName: '01',
            selectInfoData: {},
            isDialogShow: true
        };
    },
    components: {
      onlineInquiry (resolve) {
        require(['./onlineInquiry/onlineInquiry.vue'], resolve);
      },
      offlineInquiry (resolve) {
        require(['./offlineInquiry/offlineInquiry.vue'], resolve);
      }
    },
    props: {
        dialogHeight: {
            type: Number,
            default: 300
        },
        projectId: {
            default: ''
        },
        selectInfo: {
            type: Object,
            default: () => {}
        }
    },
    watch: {
        isDialogShow: {
            handler() {
                this.$emit('update:close', this.isDialogShow);
            }
        },
        deep: true
    },
    created() {
        this.selectInfoData = this.$clone(this.selectInfo);
    },
    methods: {
        handleClick() {},
        getSelect(row) {
            this.selectInfoData = row;
        },
        getData() {
            this.$emit('getData', this.selectInfoData.inquiryDocNo ? [this.selectInfoData] : []);
        }
    }
};
</script>
<style lang='scss' scoped>
.calibration{
    height: 100%;
    .title{
        line-height: 40px;
    }
    /deep/ .el-tabs{
        height: calc(100% - 40px);
        .el-tabs__content{
            height: calc(100% - 50px);
            .el-tab-pane{
                height: 100%;
            }
        }
    }
}
</style>
