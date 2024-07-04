<!--
 * @Author: your name
 * @Date: 2021-01-22 11:41:35
 * @LastEditTime: 2022-07-13 15:54:19
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\deliverGoods\deliverGoodsEdit.vue
-->

<template>
    <div>
        <edit-page @editEvent="editEvent" :isSave="false" v-loading="loading">
            <div slot="editPage">
                <g-edit-form
                    ref="editForm"
                    v-if="pageConfigLoading"
                    :type="type"
                    :tableConfig="pageConfig.mainFormConfig"
                    :projectForm="pageConfig.projectForm"
                    @editFormEvent="editFormEvent">
                </g-edit-form>
                <!-- 明细清单 -->
                <div v-if="pageConfigLoading">
                    <div v-for="subTable in pageConfig.subTableConfig" :key="subTable.subTableName">
                        <g-edit-title :title="$t('fConfig.detailedList')">
                            <g-button :operationButtons="subTable.subTableButton" @editTableBut="mainOperateBtnSubTable">
                            </g-button>
                        </g-edit-title>
                        <g-edit-table
                            :ref="subTable.subTableName"
                            :type="type"
                            :isSelection="subTable.isSelection"
                            :tableConfig="subTable.tableList"
                            :subTable='subTable'
                            :delete.sync="deleteList[subTable.subTableName]"
                            @editTableEvent='editTableEvent'>
                        </g-edit-table>
                    </div>
                </div>
            </div>
        </edit-page>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'deliverGoodsEdit',
    mixins: [editPage],
    data () {
        return {
            page: new Page(),
            projectForm: {
                address: '',
                arrivalDate: '',
                attachment: '',
                carId: '',
                consignor: '',
                deliver: '',
                deliverCode: '',
                deliverMobile: '',
                deliverName: '',
                deliverTime: '',
                gps: '',
                orderName: '',
                receiver: '',
                remarks: '',
                supplyOrderDocNo: '',
                supplyOrderId: '',
                tenantId: '',
                createTime: ''
            }
        };
    },
    beforeRouteEnter (to, from, next) {
        to.params.translateName = 'deliverGoods';
        next();
  },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        setPageDisabed() {
            this.pageDisabled = false;
        },
        // 获取info数据
        _getInfoData(id = 0) {
            this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                const results = this.$clone(this.pageConfig.projectForm);
                const continent = results.continent && results.continent.split('-')[0];
                const country = results.country && results.country.split('-')[0];
                const province = results.province && results.province.split('-')[0];
                const city = results.city && results.city.split('-')[0];
                const area = results.area && results.area.split('-')[0];
                results.areas = `${continent}${country}${province}${city}${area}`;
                this.$set(this.pageConfig.projectForm, 'areas', results.areas);
            });
        },
        // 获取数据
        handleGetInfoData(id = 0, infoUrl, callback) {
            if (Number(id) === 0) {
                this.pageConfig.projectForm = this.projectForm; // 挂载form 对象
                this.pageConfigLoading = true;
                return;
            }
            this.id = id;
            this.loading = true;
            this.$store.dispatch(infoUrl.url, {[infoUrl.params]: this.id}).then(res => {
                const results = this.$clone(res.results);
                if (!results) {
                    this.pageConfig = this.page.PageConfig;
                    this.pageConfig.projectForm = this.projectForm; // 挂载form 对象
                    this.pageConfigLoading = true;
                    this.loading = false;
                    return;
                }
                this.pageConfig = this.page.PageConfig;
                this.$set(this.pageConfig, 'projectForm', results);
                this.oldProjectForm = this.$clone(results);
                if (this.pageConfig.subTableMatch) {
                    for (const item of this.pageConfig.subTableMatch) {
                    const slaveColumns = this.pageConfig.subTableConfig[item.assignment].tableList.slaveColumns;
                    const tableList = slaveColumns.filter(v => {
                        const index = this.$utils.config.currencyList.findIndex(r => r === v.prop);
                        if (index >= 0) {
                        return false;
                        } else {
                        return true;
                        }
                    });
                    this.$set(this.pageConfig.subTableConfig[item.assignment].tableList, 'slaveColumns', tableList);
                    this.$set(this.pageConfig.subTableConfig[item.assignment], 'tableData', results[item.value]);
                    if (this.pageConfig.subTableConfig[item.assignment].isSetTableStatus) {
                        // this.setSysHandleExportDetailStatus(item.assignment);
                    }
                    }
                }
                callback && callback();
                this.pageConfigLoading = true;
                this.loading = false;
            });
        },
        // 关闭当前页面
        setRoute() {
            const translateType = 'info';
            const type = this.$base64.encode('info');
            const id = this.$base64.encode(this.pageConfig.projectForm.supplyOrderId);
            const routeName = 'deliverGoods';
            const RouteTitleObj = {name: routeName, loadRouteName: routeName, translateType};
            localStorage.setItem('sRouteTitle', JSON.stringify(RouteTitleObj));
            this.$router.push(`/${routeName}/${id}/${type}/supplyOrder`);
            this.$store.commit('tagNav/removeTagNav', {name: 'deliverGoodsEdit'});
        }
    }
};
</script>
<style scoped lang="scss">
.dialog-deliver{
    div {
        line-height: 40px;
    }
}
</style>
