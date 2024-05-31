<!--
 * @Author: your name
 * @Date: 2021-01-26 09:58:04
 * @LastEditTime: 2021-02-04 11:11:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\buildLog\buildLogOther\buildLogApplyEdit.vue
-->
<template>
    <div>
        <edit-page @editEvent="editEvent" v-loading="loading">
            <div slot="editPage">
                <g-edit-form
                    ref="editForm"
                    v-if="pageConfigLoading"
                    :type="type"
                    :tableConfig="pageConfig.mainFormConfig"
                    :projectForm="pageConfig.projectForm"
                    @editFormEvent="editFormEvent">
                    <template slot="form-logTypeCode" slot-scope="{item, scope}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"  :title="$t(item.label)">
                            <el-select
                                v-model.trim="scope[item.prop]" :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                                :size="item.size || 'small'"
                                :disabled="item.inputStatus === 'disable'"
                                :filterable="item.filterable || true"
                                :multiple='item.multiple || false'
                                :collapse-tags='item.collapseTags || false'
                                :clearable="item.clearable === undefined ? true : item.clearable"
                                style="width:100%"
                                @change="handleChangeLogTypeCode(item, $event)">
                                <el-option
                                    v-for="(child,i) in item.selectList.filter(v=> v.logTypeCode !== '01')" :key="i"
                                    :label="child.logTypeName"
                                    :value="child.logTypeCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <template slot="form-morningTemperature" slot-scope="{item, scope}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"  :title="$t(item.label)">
                            <div class="temperature">
                                <el-number
                                    v-model.trim="scope.morningTemperaturesForm"
                                    :size="item.size || 'small'"
                                    :clearable="item.clearable === undefined ? true : item.clearable" :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)"
                                    :precision="Number(2)"
                                    :max="scope.morningTemperaturesTo || 100" show-word-limit>
                                </el-number>
                                <span class="sp">~</span>
                                <el-number
                                    v-model.trim="scope.morningTemperaturesTo" :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                                    :size="item.size || 'small'"
                                    :clearable="item.clearable === undefined ? true : item.clearable" :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)"
                                    :precision="Number(2)"
                                    :max="100" show-word-limit
                                    :min="scope.morningTemperaturesForm ? Number(scope.morningTemperaturesForm) : -100">
                                </el-number>
                            </div>
                        </el-form-item>
                    </template>
                    <template slot="form-afternoonTemperature" slot-scope="{item, scope}">
                        <el-form-item :label="$t(item.label)" :prop="item.prop"  :title="$t(item.label)">
                            <div class="temperature">
                                <el-number
                                    v-model.trim="scope.afternoonTemperaturesForm" :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                                    :size="item.size || 'small'"
                                    :clearable="item.clearable === undefined ? true : item.clearable" :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)"
                                    :precision="Number(2)"
                                    :max="scope.afternoonTemperaturesTo || 100" show-word-limit>
                                </el-number>
                                <span class="sp">~</span>
                                <el-number
                                    v-model.trim="scope.afternoonTemperaturesTo" :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                                    :size="item.size || 'small'"
                                    :clearable="item.clearable === undefined ? true : item.clearable" :disabled="item.inputStatus === 'disable'"
                                    :maxlength="Number(item.maxlength)"
                                    :precision="Number(2)"
                                    :max="100" show-word-limit
                                    :min="scope.afternoonTemperaturesForm ? Number(scope.afternoonTemperaturesForm) : -100">
                                </el-number>
                            </div>
                        </el-form-item>
                    </template>
                </g-edit-form>
            </div>
        </edit-page>
    </div>
</template>
<script>
import Page from './configEdit.js';
import {editPage} from 'mixins/editMixins';

export default {
    name: 'buildLogOtherEdit',
    mixins: [editPage],
    data () {
        return {
            page: new Page(),
            projectForm: {
                afternoonTemperature: '',
                afternoonTemperaturesForm: '',
                afternoonTemperaturesTo: '',
                afternoonWeather: '',
                afternoonWindDirection: '',
                afternoonWindPower: '',
                applyDate: '',
                attachment: '',
                docNo: '',
                finishedSituation: '',
                logTypeId: '',
                morningTemperature: '',
                morningTemperaturesForm: '',
                morningTemperaturesTo: '',
                morningWeather: '',
                morningWindDirection: '',
                morningWindPower: '',
                projectId: '',
                projectName: '',
                remarks: '',
                tomorrowPlanSituation: '',
                logTypeName: '',
                logTypeCode: '',
                orgId: this.$utils.Auth.hasUserInfo().orgId,
                parentSubOrgId: this.$utils.Auth.hasUserInfo().parentSubOrgId,
                createTime: this.$utils.commonUtil.formatTime(new Date()),
                createByName: this.$utils.Auth.hasUserInfo().userName
            }
        };
    },
    props: {
        processParmas: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        // 获取info数据
        async _getInfoData(id = 0) {
            await this.handleGetInfoData(id, this.page.PageConfig.processParmas.infoUrl, () => {
                // 上午温度
                if (this.pageConfig.projectForm.morningTemperature.indexOf(',') >= 0) {
                    const list = this.pageConfig.projectForm.morningTemperature.split(',');
                    console.log(list, 'list');
                    this.$set(this.pageConfig.projectForm, 'morningTemperaturesForm', Number(list[0]));
                    this.$set(this.pageConfig.projectForm, 'morningTemperaturesTo', Number(list[1]));
                    // this.pageConfig.projectForm.morningTemperaturesForm = Number(list[0]);
                    // this.pageConfig.projectForm.morningTemperaturesTo = Number(list[1]);
                }
                // 下午温度
                if (this.pageConfig.projectForm.afternoonTemperature.indexOf(',') >= 0) {
                    const list = this.pageConfig.projectForm.afternoonTemperature.split(',');
                    this.$set(this.pageConfig.projectForm, 'afternoonTemperaturesForm', Number(list[0]));
                    this.$set(this.pageConfig.projectForm, 'afternoonTemperaturesTo', Number(list[1]));
                    // this.pageConfig.projectForm.afternoonTemperaturesForm = Number(list[0]);
                    // this.pageConfig.projectForm.afternoonTemperaturesTo = Number(list[1]);
                }
                console.log(this.pageConfig.projectForm);
            });
        },
        handleChangeLogTypeCode(item, value) {
            const {selectList} = item;
            console.log(selectList, 'selectList');
            const index = selectList.findIndex(v => v.logTypeCode === value);
            this.$set(this.pageConfig.projectForm, 'logTypeName', index >= 0 ? selectList[index].logTypeName : '');
        },
        // 保存
        handleSave (isProcess = false) {
            this.$refs.editForm.getValidateForm(() => {
                const data = this.$clone(this.pageConfig.projectForm);
                data.morningTemperature = `${data.morningTemperaturesForm},${data.morningTemperaturesTo}`;
                data.afternoonTemperature = `${data.afternoonTemperaturesForm},${data.afternoonTemperaturesTo}`;
                this.handleSaveData(data, isProcess);
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.temperature {
    width: 100%;
    display: flex;
    .sp {
        display: inline-block;
        margin: 0 8px;
    }
    /deep/ .el-number {
        flex:1
    }
}
</style>
