<!--
 * @Author: your name
 * @Date: 2021-04-14 14:44:36
 * @LastEditTime: 2021-04-15 11:58:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\supplyOrder\index.vue
-->
<template>
    <div style="height: 100%;">
        <el-tabs v-model="activeName" style="height: 90%;">
            <div class="orderName"><span class="midFont set">{{$t('dialog.selectedOrder')}}：</span>{{tableSelectData.length ? tableSelectData[0].orderName : ''}}</div>
            <el-tab-pane :label="$t('fConfig.supplyOrder')" name="second" style="height: 85%;">
                <supplyOrder v-if="activeName === 'second'" :dialogHeight="dialogHeight" :selectId="selectOrderId" :projectId="projectId"
                @close="handleClose"
                @getSelectData="getSelectData"
                @getData="getData"></supplyOrder>
            </el-tab-pane>
            <el-tab-pane :label="$t('fConfig.historicalSupplyorder')" name="first" style="height: 85%;">
                <historySupplyOrder v-if="activeName === 'first'" :dialogHeight="dialogHeight" :selectId="selectOrderId" :projectId="projectId"
                @close="handleClose"
                @getSelectData="getSelectData"
                @getData="getData"></historySupplyOrder>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activeName: 'second',
            selectOrderId: '',
            tableSelectData: []
        };
    },
    props: {
        // 选中的订单
        selectId: {
            default: []
        },
        projectId: {
            default: 0
        },
        dialogHeight: {
            default: 300
        }
    },
    created() {
        this.selectOrderId = this.$clone(this.selectId);
        this.selectOrderId && this.getOrderInfo();
    },
    components: {
        supplyOrder (resolve) {
            require(['./supplyOrder.vue'], resolve);
        },
        historySupplyOrder (resolve) {
            require(['./historySupplyOrder.vue'], resolve);
        }
    },
    methods: {
        handleClose() {
            this.$emit('update:close', false);
        },
        getData(arr) {
            this.$emit('getData', this.tableSelectData);
        },
        // 获取选中的值
        getSelectData(arr) {
            this.selectOrderId = arr.length ? arr[0].id : '';
            this.tableSelectData = arr;
        },
        // 查询供货订单详细信息
        getOrderInfo() {
            this.$store.dispatch('supplyOrder/getInfo', {supplyOrderId: this.selectId}).then(res => {
                if (res.results) {
                    this.tableSelectData = [res.results];
                }
            });
        }
    }
};
</script>
<style scoped lang="scss">
/deep/ .el-tabs__content{
    height: 100%;
}
.orderName{
    margin: 0 0 5px 10px;
}
</style>
