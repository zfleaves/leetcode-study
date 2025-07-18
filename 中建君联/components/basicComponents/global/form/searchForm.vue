<template>
  <div class="operationFormWrap">
    <el-form ref="searchFormValue" label-position="left" :model="searchFormValue" label-width="150px"
      @submit.native.prevent class="demo-ruleForm">
      <div class="form-group">
        <div class="row-form">
          <el-row :gutter="24">
            <template v-for="(item,index) in formList">
              <el-col v-if="item.inputStatus !=='hide'" :key="index" :span="item.span">
                <!-- 时间区间 -->
                <el-form-item v-if="item.formType==='daterange-split'" :label="item.label"
                  :class="item.label.length > 7 && 'maxLabel'">
                  <el-tooltip slot="label" v-if="item.label.length > 7 && 'maxLabel'" class="item" effect="dark"
                    :content="$t(item.label)" placement="top-start">
                    <span>{{$t(item.label)}}</span>
                  </el-tooltip>
                  <span v-else slot="label">{{$t(item.label)}}</span>
                  <div style="display: flex;align-items: center;">
                    <el-date-picker v-model="searchFormValue[item.propStart]" :placeholder="item.placeholderStart"
                      :size="item.size || 'small'" :clearable='item.clearable === false ? item.clearable : true'
                      :disabled="item.inputStatus === 'disabled'" :type="item.type === 'time' ? 'datetime' : 'date'"
                      @change="sysHandleSearch" default-time="00:00:00" value-format="yyyy-MM-dd HH:mm:ss"
                      style="width: 100%;">
                      <i slot="prefix-icon" class="icon"></i></el-date-picker>
                    <span style="margin: 0 10px;">-</span>
                    <el-date-picker v-model="searchFormValue[item.propEnd]" :placeholder="item.placeholderEnd"
                      :size="item.size || 'small'" :clearable='item.clearable === false ? item.clearable : true'
                      :disabled="item.inputStatus === 'disabled'" :type="item.type === 'time' ? 'datetime' : 'date'"
                      @change="sysHandleSearch" default-time="23:59:59" value-format="yyyy-MM-dd HH:mm:ss"
                      style="width: 100%;"
                      :picker-options="{
                        disabledDate(time) {
                          return time.getTime() <= new Date(searchFormValue[item.propStart]);
                        }
                      }">
                      <i slot="prefix-icon" class="icon"></i></el-date-picker>
                  </div>
                </el-form-item>
                <!-- 其他 -->
                <el-form-item v-else :label="item.label" :prop="item.prop" :class="item.label.length > 7 && 'maxLabel'">
                  <el-tooltip slot="label" v-if="item.label.length > 7 && 'maxLabel'" class="item" effect="dark"
                    :content="$t(item.label)" placement="top-start">
                    <span>{{$t(item.label)}}</span>
                  </el-tooltip>
                  <span v-else slot="label">{{$t(item.label)}}</span>
                  <!-- 插槽 -->
                  <template v-if="item.formType==='slot'">
                    <slot :name="'form-' + item.prop" :searchFormValue="searchFormValue" :item="item"></slot>
                  </template>
                  <!--// 文本输入框-->
                  <el-input v-if="item.formType==='input'" @blur="handleBlur(item, $event)"
                    :placeholder="$t(item.placeholder) || ''" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" @keyup.enter.native="sysHandleSearch"
                    :clearable="item.inputStatus !== 'disable'" :disabled="item.inputStatus === 'disable'"
                    :maxlength="Number(item.maxlength)" show-word-limit>
                  </el-input>
                  <!-- 审批状态选择框 -->
                  <el-select v-if="item.formType==='flowStatus'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" multiple collapse-tags :clearable="item.clearable"
                    :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true"
                    :placeholder="$t(item.placeholder) || ''" style="width:100%" @change="sysHandleSearch">
                    <el-option v-for="(child,i) in flowStatusList" :key="i" :label="$t(child.dataName)"
                      :value="child.dataCode"></el-option>
                  </el-select>
                  <!-- 项目多选下拉选择框 -->
                  <el-select v-if="item.formType==='multipleProject'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" :multiple='item.multiple || true'
                    :collapse-tags='item.collapseTags || true' :clearable="item.clearable || true"
                    :disabled="item.inputStatus === 'disable'"
                    :filterable="item.filterable || true"
                    :placeholder="$t(item.placeholder) || ''" style="width:100%" @change="sysHandleSearch">
                    <el-option v-for="(child,i) in projectList" :key="i"
                      :label="item.nameCode ? child[item.nameCode] : child.projectName"
                      :value="item.valueCode ? child[item.valueCode] : child.id"></el-option>
                  </el-select>
                  <!-- 项目下拉选择框 -->
                  <el-select v-if="item.formType==='project'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" :multiple='item.multiple || false'
                    :collapse-tags='item.collapseTags || false' :clearable="item.clearable || true"
                    :disabled="item.inputStatus === 'disable'"
                    :filterable="item.filterable || true"
                    :placeholder="$t(item.placeholder) || ''" style="width:100%" @change="sysHandleSearch">
                    <el-option v-for="(child,i) in projectList" :key="i"
                      :label="item.nameCode ? child[item.nameCode] : child.projectName"
                      :value="item.valueCode ? child[item.valueCode] : child.projectName"></el-option>
                  </el-select>
                  <!--// 下拉选择框-->
                  <el-select v-if="item.formType==='select'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" :clearable="item.clearable" :multiple='item.multiple || false'
                    :collapse-tags='item.collapseTags || false'
                    :disabled="item.inputStatus === 'disable'"
                    :filterable="item.filterable || true" :placeholder="$t(item.placeholder) || ''" style="width:100%"
                    @change="sysHandleSearch"
                    >
                    <el-option v-for="(child,i) in item.selectList" :key="i" :label="child[item.nameCode]"
                      :value="child[item.valueCode]"></el-option>
                  </el-select>
                  <!-- 数据字典下拉选择框 -->
                  <el-select v-if="item.formType==='dicSelect'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" :multiple='item.multiple || false'
                    :collapse-tags='item.collapseTags || true' :filterable="item.filterable || true"
                    :clearable="item.clearable || true"
                    :placeholder="$t(item.placeholder) || ''" style="width:100%" @change="sysHandleSearch"
                    :disabled="item.inputStatus === 'disable'">
                    <el-option v-for="(child,i) in item.selectList" :key="i"
                      :label="item.isTranslate ? $t(child.dataName) : child.dataName"
                      :value="item.isNumber ? Number(child.dataCode) : child.dataCode">
                    </el-option>
                  </el-select>
                  <!--// Cascader 级联选择器-->
                  <el-cascader v-if="item.formType==='city'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" clearable :disabled="item.inputStatus === 'disable'"
                    style="width: 100%" @change="sysHandleSearch" :options="options"
                    :props="{ checkStrictly: true }"></el-cascader>
                  <!--//数字输入框-->
                  <el-number v-if="item.formType==='number'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" clearable :disabled="item.inputStatus === 'disable'"
                    :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                    @keyup.enter.native="sysHandleSearch" :min="item.min" :max="item.max"
                    :placeholder="$t(item.placeholder) || ''" show-word-limit></el-number>
                  <!--// 日期  禁止选择部分日期待定-->
                  <el-date-picker v-if="item.formType==='date' || item.formType==='time'"
                    v-model="searchFormValue[item.prop]" :size="item.size || 'small'" clearable
                    :disabled="item.inputStatus === 'disable'" :picker-options="item.pickerOptions && pickerOptions"
                    type="date" @change="sysHandleSearch" :placeholder="$t(item.placeholder) || ''"
                    :value-format="item.formType==='date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                    style="width: 100%;"></el-date-picker>
                  <!--// 日期  禁止选择部分日期待定-->
                  <el-date-picker v-if="item.formType==='date'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" clearable :disabled="item.inputStatus === 'disable'"
                    :picker-options="item.pickerOptions && pickerOptions" type="date" @change="sysHandleSearch"
                    :placeholder="$t(item.placeholder) || ''"
                    :value-format="item.formType==='date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                    style="width: 100%;"></el-date-picker>
                  <!-- 日期区间 -->
                  <el-date-picker v-if="item.formType==='daterange'" v-model="searchFormValue[item.prop]"
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    :disabled="item.inputStatus === 'disable'" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%;" :range-separator="$t('fConfig.to')"
                    :start-placeholder="$t('fConfig.startDate')" :end-placeholder="$t('fConfig.endDate')"
                    @change="sysHandleSearch">
                  </el-date-picker>
                  <!--年份-->
                  <el-date-picker v-if="item.formType==='year'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" :clearable="item.clearable" :disabled="item.inputStatus === 'disable'"
                    :picker-options="item.pickerOptions && pickerOptions" type="year" @change="sysHandleSearch"
                    :placeholder="$t(item.placeholder) || ''" value-format="yyyy" style="width: 100%;"></el-date-picker>
                  <!--年份-->
                  <el-date-picker v-if="item.formType==='yearTitle'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" clearable :disabled="item.inputStatus === 'disable'"
                    :picker-options="item.pickerOptions && pickerOptions" type="year" @change="sysHandleSearch"
                    :placeholder="$t(item.placeholder) || ''" :format="'yyyy' + $t('time.year')"
                    :value-format="'yyyy' + $t('time.year')" style="width: 100%;"></el-date-picker>
                  <!--月份-->
                  <el-date-picker v-if="item.formType==='month'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" :clearable="item.clearable" :disabled="item.inputStatus === 'disable'"
                    :picker-options="item.pickerOptions && pickerOptions" type="month" @change="sysHandleSearch"
                    :placeholder="$t(item.placeholder) || ''" value-format="yyyy-MM"
                    style="width: 100%;"></el-date-picker>
                  <!--周-->
                  <el-date-picker v-if="item.formType==='week'" v-model="searchFormValue[item.prop]"
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'" clearable
                    :format="'yyyy' + $t('time.year') + 'MM' + $t('tips.theFirst') + week + $t('time.week')"
                    @change="weekChange(item, $event)" value-format="yyyy-MM-dd" class="inp" type="week"
                    :picker-options="{'firstDayOfWeek': 1}">
                  </el-date-picker>
                  <!-- 月份联动 -->
                  <div v-if="item.formType==='daterange-split-month'"
                    style="display: flex;width: 100%;align-items: center;">
                    <el-date-picker v-model="searchFormValue[item.propStart]" :placeholder="$t(item.placeholderStart)"
                      :size="item.size || 'small'" clearable :picker-options="{
                        disabledDate (time) {
                          return searchFormValue[item.propEnd] ? new Date(searchFormValue[item.propEnd]).getMonth() < time.getMonth() : false;
                        }
                      }" :disabled="item.inputStatus === 'disable'" type="month"
                      @change="sysHandleSearch(item, $event)" value-format="yyyy-MM" style="width: 100%;">
                      <i slot="prefix-icon" class="icon"></i></el-date-picker>
                    <span style="margin: 0 10px;">-</span>
                    <el-date-picker v-model="searchFormValue[item.propEnd]" :placeholder="$t(item.placeholderEnd)"
                      :size="item.size || 'small'" clearable :picker-options="{
                        disabledDate (time) {
                          return searchFormValue[item.propStart] ? new Date(searchFormValue[item.propStart]).getMonth() > time.getMonth() : false;
                        }
                      }" :disabled="item.inputStatus === 'disable'" type="month"
                      @change="sysHandleSearch(item, $event)" value-format="yyyy-MM" style="width: 100%;">
                      <i slot="prefix-icon" class="icon"></i></el-date-picker>
                  </div>
                  <!--// radio 单选-->
                  <el-radio-group v-if="item.formType==='radio'" v-model="searchFormValue[item.prop]"
                    @change="sysHandleSearch" :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'">
                    <el-radio v-for="(child,i) in item.selectList" :key="i"
                      :label="child[item.value]">{{child[item.label]}}</el-radio>
                  </el-radio-group>
                  <!--switch滑块-->
                  <el-switch v-if="item.formType==='switch'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'"
                    @change="sysHandleSearch"></el-switch>
                  <!--基础checkbox单选-->
                  <el-checkbox v-if="item.formType==='checkbox'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'"
                    @change="sysHandleSearch"></el-checkbox>
                  <!--// 基础checkbox多选-->
                  <el-checkbox-group v-if="item.formType==='checkboxGroup'" v-model="searchFormValue[item.prop]"
                    :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'" @change="sysHandleSearch">
                    <el-checkbox v-for="(child,i) in item.selectList" :key="i"
                      :label="child[item.value]">{{child[item.label]}}</el-checkbox>
                  </el-checkbox-group>
                  <!--textarea-->
                  <el-input v-if="item.formType==='textarea'" type="textarea" v-model="searchFormValue[item.prop]"
                    :placeholder="'请输入' + item.label" :size="item.size || 'small'" @keyup.enter.native="sysHandleSearch"
                    clearable :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                    show-word-limit :autosize="{ minRows: item.minRows, maxRows: item.maxRows}"></el-input>
                  <!-- 所属公司实现多选 -->
                  <div class="slot-input" v-if="item.formType==='multipleOrgName'">
                    <div class="assginer-items" v-if="searchFormValue.orgList">
                      <template v-for="(tag, i) in searchFormValue.orgList.slice(0,1)">
                        <template>
                          <el-tag :key="i" @close="handleCloseMultipleOrgName(item, tag)" size="mini" closable
                            type="info">
                            <span v-if="tag.orgName.length>15"
                              :title="tag.orgName">{{tag.orgName.slice(0,15)}}...</span>
                            <span v-else>{{tag.orgName}}</span>
                          </el-tag>
                        </template>
                      </template>
                      <el-tag type="info" size="mini" v-if="searchFormValue.orgList.length > 1"
                        style="margin-left:6px;">
                        +{{searchFormValue.orgList.length - 1}}</el-tag>
                    </div>
                    <div class="set" v-if="item.inputStatus !== 'disable'">
                      <i v-if="searchFormValue.orgList.length" class="slot-close el-icon-circle-close"
                        @click="handleClearOrg(item)" />
                      <i class="multiple-choice-icon iconfont icon-liebiao"
                        @click="handleSelectMultipleOrgName(item)"></i>
                    </div>
                  </div>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </div>
        <div :class="configForm.isResetStyle ? 'is-botton-style' : 'row-button'">
          <el-button v-if="isSearch" size="small" type="primary" icon="el-icon-search" class="search"
            @click="sysHandleSearch('search')">{{$t('button.search')}}</el-button>
          <el-button v-if="configForm.isReset" size="small" type="primary" plain icon="el-icon-magic-stick" class="more"
            @click="sysHandleResetForm">{{$t('button.reset')}}</el-button>
        </div>
        <div class="is-botton-style" v-if="false">
          <el-button v-if="isSearch" size="small" icon="el-icon-search" class="search"
            @click="sysHandleSearch('search')">
          </el-button>
          <el-button v-if="configForm.isReset" size="small" type="text" plain
            @click="sysHandleResetForm">{{$t('button.reset')}}</el-button>
          <el-button v-if="formList.length > 3 && isSeniorStatus" size="small" type="text" plain
            @click="sysHandleSeniorForm">
            高级
            <i v-if="!seniorStatus" class="el-icon-arrow-down"></i>
            <i v-if="seniorStatus" class="el-icon-arrow-up"></i>
          </el-button>
        </div>
      </div>
    </el-form>

    <!-- 选择所属公司 -->
    <el-dialog v-dialogDrag :title="orgDialogConfig.title" :visible.sync="orgFlag" :top="orgDialogConfig.top" center
      :width="orgDialogConfig.width">
      <selectOrg v-if="orgFlag" :close.sync="orgFlag" :isRadio='currentConfig.isRadio || false' @getData='getOrg'
        :isCheckBox='currentConfig.isCheckBox || true' :selectOrgList='selectOrgList'
        :selectOrgId="searchFormValue[currentConfig.key] || ''"
        :isShowDepartName='currentConfig.isShowDepartName || false'
        :isOnlyCheckDepartName='currentConfig.isOnlyCheckDepartName || false'
        :isAuthority='currentConfig.isAuthority || false'>
      </selectOrg>
    </el-dialog>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data';

export default {
  name: 'searchFrom',
  data () {
    return {
      options: regionData,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      // searchFormValue: {},
      clonesearchFormValue: {},
      flowStatusList: [], // 审批状态
      week: 1,
      formList: [],
      projectList: [],
      // 所属公司
      orgDialogConfig: {
        title: this.$t('dialog.orgName'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '40%'
      },
      orgFlag: false,
      currentConfig: {},
      selectOrgList: [],
      seniorStatus: true
    };
  },
  components: {
    selectOrg (resolve) {
      require(['components/basicComponents/userDialog/selectOrg'], resolve);
    }
  },
  props: {
    configForm: {
      type: Object,
      default: () => {
        const parmas = {
          // 表单配置
          formList: [],
          // 表单按钮
          isReset: false
        };
        return parmas;
      }
    },
    isSearch: {
      type: Boolean,
      default: true
    },
    // 是否显示高级
    isSeniorStatus: {
      type: Boolean,
      default: true
    },
    // 表单值
    searchFormValue: {
      type: Object,
      default: () => { }
    }
  },
  watch: {
    configForm: {
      handler () {
        this.formList = this.configForm.formList;
      },
      deep: true
    },
    'configForm.formList': {
      handler () {
        this.formList = this.configForm.formList;
      },
      deep: true
    }
  },
  created () {
    this.flowStatusList = this.$store.state.constant.flowStatusList;
  },
  mounted () {
    // 如果存在下拉项目名称，则 获取项目列表
    if (this.configForm.formList) {
      if (this.configForm.formList.some(v => v.formType === 'project' || v.formType === 'multipleProject')) {
        this.configForm.isProProjectPreApproval ? this.getProProjectPreApproval() : this._getProjectList();
      }
    }
    this.formList = this.configForm.formList;
    this.clonesearchFormValue = this.$clone(this.searchFormValue);
  },
  methods: {
    // 获取项目列表
    _getProjectList () {
      const data = {
        beginTimeFrom: '',
        beginTimeTo: '',
        orgId: '',
        projectName: '',
        projectStatus: [],
        projectTypeCode: [],
        projectManagerName: ''
      };
      this.$store.dispatch('publicApi/getProjectPermissionList', data).then(res => {
        if (res.status === 0) {
          this.projectList = res.results;
        }
      });
    },
    // 选择项目预立项
    getProProjectPreApproval () {
      const data = {
        isFillingProjectCode: 1
      };
      this.$store.dispatch('proProjectPreApproval/getProProjectPreApprovalList', data).then(res => {
        if (res.status === 0) {
          this.projectList = res.results;
        }
      });
    },
    // 重置
    sysHandleResetForm () {
      this.$refs.searchFormValue.clearValidate();
      this.searchEvent({ eventName: 'clear' });
    },
    // 搜索
    sysHandleSearch (type) {
      if (this.configForm.isButtonSearch) {
        if (type === 'search') {
          this.searchEvent({ eventName: 'search' });
        }
      } else {
        this.searchEvent({ eventName: 'search' });
      }
    },
    // 高级
    sysHandleSeniorForm () {
      this.seniorStatus = !this.seniorStatus;
      for (const i in this.formList) {
        const item = this.formList[i];
        if (i > 1) {
          this.$set(item, 'inputStatus', this.seniorStatus ? 'edit' : 'hide');
        }
      }
    },
    // 失去焦点
    handleBlur (item, event) {
      const newValue = event.target.value.replace(/^\s+|\s+$/g, '');
      this.$set(this.searchFormValue, item.prop, newValue);
    },
    searchEvent (params = {}) {
      this.$emit('searchEvent', params);
    },
    // 选择周之后
    weekChange (item, val) {
      if (val) {
        this.week = this.getWeekInMonth(new Date(val));
        this.$set(this.searchFormValue, 'week', this.week);
        this.searchEvent({ eventName: 'search' });
      }
    },
    // 根据日期判断是月的第几周
    getWeekInMonth (t, item) {
      if (t === undefined || t === '' || t == null) {
        t = new Date();
      } else {
        const _t = new Date();
        _t.setYear(t.getFullYear());
        _t.setMonth(t.getMonth());
        _t.setDate(t.getDate());
        const date = _t.getDate(); // 给定的日期是几号
        _t.setDate(1);
        const d = _t.getDay(); // 1. 得到当前的1号是星期几。
        let fisrtWeekend = d;
        if (d === 0) {
          fisrtWeekend = 1;
          // 1号就是星期天
        } else {
          fisrtWeekend = 7 - d + 1; // 第一周的周未是几号
        }
        if (date <= fisrtWeekend) {
          return 1;
        } else {
          return 1 + Math.ceil((date - fisrtWeekend) / 7);
        }
      }
    },
    // 清楚单个所属公司
    handleCloseMultipleOrgName (item, tag) {
      this.searchFormValue.orgList.splice(this.searchFormValue.orgList.indexOf(tag), 1);
      this.searchEvent({ eventName: 'multipleOrgName' });
    },
    // 清空所有所属公司
    handleClearOrg () {
      this.$set(this.searchFormValue, 'orgList', []);
      this.searchEvent({ eventName: 'multipleOrgName' });
    },
    // 打开所属公司弹窗
    handleSelectMultipleOrgName () {
      this.selectOrgList = this.$clone(this.searchFormValue.orgList);
      this.orgFlag = true;
    },
    // 获取所属公司数据
    getOrg (arr) {
      this.$set(this.searchFormValue, 'orgList', arr);
      this.searchEvent({ eventName: 'multipleOrgName' });
      this.orgFlag = false;
    }
  }
};
</script>

<style scoped lang="scss">
.operationFormWrap {
  width: 100%;
}
.form-group {
  width: 100%;
  display: flex;
  // align-items: center;
  .row-form {
    flex: auto;
  }
  .row-button {
    padding-left: 10px;
    display: flex;
    flex-direction: column-reverse;
    text-align: right;
    justify-content: flex-end;
  }
}
.is-botton-style {
  padding-left: 10px;
  display: flex;
  flex-direction: row;
  text-align: right;
  button {
    &:nth-child(1) {
      margin-right: 9px !important;
    }
    // &:last-child {
    //   padding-right: 0 !important;
    // }
  }
}
</style>
