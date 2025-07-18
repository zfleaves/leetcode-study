<template>
  <div class="edit-form-main" v-loading="loading">
    <div class="operationFormWrap">
      <el-form ref="projectForm" label-position="left" :model="projectForm" :rules="rule"
        :validate-on-rule-change="false" label-width="150px" class="demo-ruleForm" :disabled="pageDisabled"
        v-if="projectForm && isResetRule && !loading">
        <el-row :gutter="24">
          <template v-for="(item, index) in formList">
            <el-col v-if="item.inputStatus !== 'hide'" class="demo-ruleForm-list" :class="formClass(item)" :key="index"
              :span="item.span">
              <!-- 插槽 -->
              <template v-if="item.formType === 'slot'">
                <slot :name="'form-' + item.prop" :scope="projectForm" :item="item" :pageDisabled="pageDisabled"></slot>
              </template>
              <!-- 分段提示/底部文字提示 -->
              <div class="divisionTitle" v-else-if="item.formType === 'divisionTitle'">
                <span class="midFont set">{{ $t(item.label) }}</span>
                <span class="midFont error">{{ $t(item.errorLabel) }}</span>
              </div>
              <!-- 标题显示 -->
              <g-edit-title v-else-if="item.formType === 'title'" :title="$t(item.label)" style="border:0;">
              </g-edit-title>
              <!-- 关闭按钮 -->
              <el-button class="urgent cons-bottom" v-else-if="item.formType === 'closeBtn'" type="primary"
                icon="el-icon-circle-close" size="small" :disabled='false' @click="handleClose">{{ $t('button.close') }}
              </el-button>
              <!-- 提示信息 -->
              <div class="promptInformation" v-else-if="item.formType === 'promptInformation'">
                <span class="midFont error promptInformationTxet">{{ $t(item.label) }}</span>
              </div>
              <!-- 其他 -->
              <!-- :class="item.label.length < 7 && 'maxLabel'" :title="$t(item.label)" -->
              <el-form-item v-else :label="$t(item.label)" :prop="item.prop" :title="$t(item.label)"
                style="position:relative;">
                <slot :name="'tips-' + item.prop" :scope="projectForm" :item="item" :pageDisabled="pageDisabled"></slot>
                <div v-if="item.formType === 'text'" class="midFont ellipsis" :title="projectForm[item.prop]"
                  style="color: grey;">
                  {{ projectForm[item.prop] | systemFilters(item) }}</div>
                <!-- 下载模版 -->
                <div v-if="item.formType === 'downloadTemplate'">
                  <span class="midFont set" @click="downloadTemplate(projectForm[item.prop], item)">
                    {{ $t('button.downloadTemplate') }}
                  </span>
                  <span class="midFont info" v-if="item.placeholder">
                    {{ $t(item.placeholder) }}
                  </span>
                </div>
                <!--// 文本输入框-->
                <el-input v-if="item.formType === 'input' && isEditForm(item)" v-model="projectForm[item.prop]"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                  @change="handleChange(item, $event)" @blur="handleBlur(item, $event)"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                  :title="projectForm[item.prop]"
                  :show-word-limit="item.showWordLimit !== null ? item.showWordLimit : true">
                </el-input>
                <el-input v-else-if="item.formType === 'input' && !isEditForm(item)" disabled
                  :value="projectForm[item.prop] | systemFilters(item)" :title="projectForm[item.prop]"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'">
                </el-input>
                <!--// 下拉选择框-->
                <el-select v-if="item.formType === 'select'" v-model="projectForm[item.prop]" ref="elSelect"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                  :multiple='item.multiple || false' :collapse-tags='item.collapseTags || false'
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                  @focus="handleFocus(item, 'focus')" @change="handleChange(item, $event)">
                  <el-option v-for="(child, i) in item.selectList" :key="i" :label="child[item.nameCode]"
                    :value="child[item.valueCode]">
                  </el-option>
                </el-select>
                <!-- 数据字典下拉选择框 -->
                <div v-if="item.formType === 'dicSelect'">
                  <el-select v-model="projectForm[item.prop]" :class="changeStyle(projectForm, item)" ref="elSelect"
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                    :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true"
                    :multiple='item.multiple || false' :collapse-tags='item.collapseTags || false'
                    :clearable="item.clearable === undefined ? true : item.clearable" style="width:100%"
                    @focus="handleFocus(item, 'focus')" @change="handleChange(item, $event)">
                    <el-option v-for="(child, i) in item.selectList" :key="i"
                      :label="item.isTranslate ? $t(child.dataName) : child.dataName"
                      :value="item.isNumber ? Number(child.dataCode) : child.dataCode"
                      :disabled="child.disabled || false">
                    </el-option>
                  </el-select>
                  <el-tooltip v-if="showChangeProp(projectForm, item)" class="change-item" effect="dark"
                    :content="`${$t('tips.primary')}：${setChangeContent(projectForm, item)}`" placement="top">
                    <!-- 变 -->
                    <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                  </el-tooltip>
                </div>
                <!--// Cascader 级联选择器-->
                <el-cascader v-if="item.formType === 'city'" v-model="projectForm[item.prop]"
                  ::placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" style="width: 100%" @change="addressChange"
                  :options="options" :props="{ checkStrictly: true }">
                </el-cascader>
                <!--//数字输入框-->
                <el-input v-if="item.formType === 'number' && isEditForm(item)" type="number"
                  v-model="projectForm[item.prop]" :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                  :size="item.size || 'small'" :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :max="item.max" :min="item.min" :maxlength="item.maxlength"
                  @focus="handleFocus(item)" @change="handleChange(item, $event)" show-word-limit>
                </el-input>
                <el-input v-else-if="item.formType === 'number' && !isEditForm(item)"
                  :value="projectForm[item.prop] | systemFilters(item)" disabled
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'">
                </el-input>
                <el-number v-if="item.formType === 'elNumber' && isEditForm(item)" v-model="projectForm[item.prop]"
                  :class="changeStyle(projectForm, item)" :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                  :size="item.size || 'small'" :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                  :precision="Number(item.precision)" @focus="handleFocus(item)" @change="handleChange(item, $event)"
                  :min="item.min" :max="item.max || 9999999999999999" show-word-limit>
                  <el-tooltip v-if="showChangeProp(projectForm, item)" slot="suffix" class="change-item" effect="dark"
                    :content="`${$t('tips.primary')}：${setChangeContent(projectForm, item)}`" placement="top">
                    <!-- 变 -->
                    <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                  </el-tooltip>
                </el-number>
                <el-input v-else-if="item.formType === 'elNumber' && !isEditForm(item)"
                  :value="projectForm[item.prop] | systemFilters(item)" disabled
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'">
                </el-input>
                <!--// 日期  禁止选择部分日期待定-->
                <el-date-picker v-if="item.formType === 'date' || item.formType === 'time'"
                  v-model="projectForm[item.prop]" :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                  :size="item.size || 'small'" :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :default-time="item.defaultTime"
                  :picker-options="item.pickerOptions ? pickerOptions : item.beforePickerOptions ? beforePickerOptions : ''"
                  :type="item.formType === 'date' ? 'date' : 'datetime'" @focus="handleFocus(item)"
                  :format="(item.formType === 'date' ? 'yyyy-MM-dd ' : 'yyyy-MM-dd HH:mm:ss ') + $t(item.formatTips)"
                  @change="handleChange(item, $event)" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;">
                </el-date-picker>
                <!-- 日期区间 -->
                <el-date-picker v-if="item.formType === 'daterange'" v-model="projectForm[item.prop]"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 100%;" :range-separator="$t('fConfig.to')" :start-placeholder="$t('fConfig.startDate')"
                  :picker-options="item.pickerOptions ? item.pickerOptions : ''"
                  :end-placeholder="$t('fConfig.endDate')" @change="handleChange(item, $event)"
                  @focus="handleFocus(item)">
                </el-date-picker>
                <!-- 时分秒区间 -->
                <el-time-picker v-if="item.formType === 'hourRange'" is-range v-model="projectForm[item.prop]"
                  :size="item.size || 'small'" :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :range-separator="$t('fConfig.to')" style="width: 100%;"
                  :start-placeholder="$t('fConfig.startTime')" :end-placeholder="$t('fConfig.endTime')" format='HH:mm'
                  value-format='HH:mm' @change="handleChange(item, $event)" @focus="handleFocus(item)">
                </el-time-picker>
                <!--年份-->
                <el-date-picker v-if="item.formType === 'year'" v-model="projectForm[item.prop]"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'" :picker-options="item.pickerOptions && pickerOptions"
                  type="year" @change="handleChange(item, $event)" @focus="handleFocus(item)" value-format="yyyy"
                  style="width: 100%;">
                </el-date-picker>
                <!--年份-->
                <el-date-picker v-if="item.formType === 'yearTitle'" v-model="projectForm[item.prop]"
                  :size="item.size || 'small'" clearable :disabled="item.inputStatus === 'disable'"
                  :picker-options="item.pickerOptions && pickerOptions" type="year" @change="handleChange(item, $event)"
                  @focus="handleFocus(item)" :format="'yyyy' + $t('time.year')" :value-format="'yyyy' + $t('time.year')"
                  style="width: 100%;"></el-date-picker>
                <!-- 季度 -->
                <!--月份-->
                <el-date-picker v-if="item.formType === 'month'" v-model="projectForm[item.prop]"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'"
                  :picker-options="item.pickerOptions ? monthPickerOptions : ''" type="month"
                  @change="handleChange(item, $event)" @focus="handleFocus(item)" value-format="yyyy-MM"
                  style="width: 100%;">
                </el-date-picker>
                <!--周-->
                <el-date-picker v-if="item.formType === 'week'" v-model="projectForm[item.prop]"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                  :clearable="item.clearable === undefined ? true : item.clearable"
                  :disabled="item.inputStatus === 'disable'"
                  :format="'yyyy' + $t('time.year') + 'MM' + $t('time.month') + $t('tips.theFirst') + week + $t('time.week')"
                  @focus="handleweekFocus(item)" @change="weekChange(item, $event, true)" value-format="yyyy-MM-dd"
                  class="inp" type="week" :picker-options="{ 'firstDayOfWeek': 1 }">
                </el-date-picker>

                <!--// radio 单选-->
                <el-radio-group v-if="item.formType === 'radio'" v-model="projectForm[item.prop]"
                  @change="handleChange(item, $event)" :size="item.size || 'small'"
                  :disabled="item.inputStatus === 'disable'">
                  <el-radio v-for="(child, i) in item.selectList" :key="i"
                    :label="item.isNumber ? Number(child.value) : child.value">
                    {{ item.isTranslate ? $t(child.label) : child.label }}
                  </el-radio>
                </el-radio-group>
                <!--switch滑块-->
                <el-switch v-if="item.formType === 'switch'" v-model="projectForm[item.prop]"
                  :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'" @focus="handleFocus(item)"
                  @change="handleChange(item, $event)">
                </el-switch>
                <!--基础checkbox单选-->
                <el-checkbox v-if="item.formType === 'checkbox'" v-model="projectForm[item.prop]"
                  :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'" @focus="handleFocus(item)"
                  @change="handleChange(item, $event)">
                </el-checkbox>
                <!--// 基础checkbox多选-->
                <el-checkbox-group v-if="item.formType === 'checkboxGroup'" v-model="projectForm[item.prop]"
                  :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'" @focus="handleFocus(item)"
                  @change="handleChange(item, $event)">
                  <el-checkbox v-for="(child, i) in item.selectList" :key="i" :label="child[item.value]">
                    {{ child[item.label] }}
                  </el-checkbox>
                </el-checkbox-group>
                <!--附件上传-->
                <file-upload v-if="item.formType === 'upload'" :attachment.sync="projectForm[item.prop]"
                  :isPhoto="item.isPhoto" @identify='identify(item, $event)'
                  @moreIdentifyList='moreIdentifyList(item, $event)' :arrayNumber="item.arrayNumber"
                  :isWord="item.isWord" :isPdf="item.isPdf" :isIdentify="item.isIdentify || false"
                  :flowStatus="item.inputStatus === 'disable' || pageDisabled" :isImportantTips="item.isImportantTips"
                  :limit="item.limit || 20" :multiple="item.multiple" :placeholder="item.placeholder"
                  :configParameter="item" @fileInformation="getFileInformation">
                </file-upload>
                <!--textarea-->
                <!-- 原来的代码  :title="(projectForm[item.prop] && projectForm[item.prop].length) > 240 ? projectForm[item.prop] : false" -->
                <div v-if="item.formType === 'textarea'">
                  <el-input type="textarea" @blur="handleBlur(item, $event)" :class="changeStyle(projectForm, item)"
                    :title="projectForm[item.prop]" v-model="projectForm[item.prop]"
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''" :size="item.size || 'small'"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)" show-word-limit
                    :autosize="{ minRows: item.minRows, maxRows: item.maxRows }">
                  </el-input>
                  <el-tooltip v-if="showChangeProp(projectForm, item)" class="change-item" effect="dark"
                    :content="`${$t('tips.primary')}：${setChangeContent(projectForm, item)}`" placement="top">
                    <!-- 变 -->
                    <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                  </el-tooltip>
                </div>
                <!-- 州/国家/城市 -->
                <el-cascader v-if="item.formType === 'area'" style="width:100%"
                  :placeholder="item.placeholder ? $t(item.placeholder) : ''" v-model="projectForm[item.prop]"
                  :disabled="item.inputStatus === 'disable'"
                  :clearable="item.clearable === undefined ? true : item.clearable" :size="item.size || 'small'"
                  :options="area" :props="areaProps" @change="handleChangeOptions(item)">
                </el-cascader>
                <!-- 项目 -->
                <div class="slot-input"
                  :class="(item.inputStatus === 'disable' || pageDisabled) ? 'edit-form-disable' : ''"
                  v-if="item.formType === 'project'">
                  <el-input v-model="projectForm[item.prop]" :size="item.size || 'small'" clearable
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''"
                    :disabled="item.inputStatus === 'disable'" readonly :title="projectForm[item.prop]">
                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                      <i v-if="projectForm[item.prop]" class="slot-close el-icon-circle-close"
                        @click="handleClearProject(item)"></i>
                      <i class="multiple-choice-icon iconfont icon-liebiao" @click="handleSelectProject(item)"></i>
                    </template>
                  </el-input>
                </div>
                <!-- 项目库 -->
                <div class="slot-input"
                  :class="(item.inputStatus === 'disable' || pageDisabled) ? 'edit-form-disable' : ''"
                  v-if="item.formType === 'projectSource'">
                  <el-input v-model="projectForm[item.prop]" :size="item.size || 'small'" clearable
                    :disabled="item.inputStatus === 'disable'" readonly :title="projectForm[item.prop]">
                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                      <i v-if="projectForm[item.prop]" class="slot-close el-icon-circle-close"
                        @click="handleClearProjectSource(item)"></i>
                      <i class="multiple-choice-icon iconfont icon-liebiao"
                        @click="handleSelectProjectSource(item)"></i>
                    </template>
                  </el-input>
                </div>
                <!-- 合同 -->
                <div class="slot-input" v-if="item.formType === 'contract'">
                  <el-input v-model="projectForm[item.prop]" :size="item.size || 'small'" clearable
                    :disabled="item.inputStatus === 'disable'" readonly :title="projectForm[item.prop]"
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''">
                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                      <i v-if="projectForm[item.prop]" class="slot-close el-icon-circle-close"
                        @click="handleClearContract(item)"></i>
                      <i class="multiple-choice-icon iconfont icon-liebiao" @click="handleSelectContract"></i>
                    </template>
                  </el-input>
                </div>
                <!-- 甲方单位 -->
                <div class="slot-input" v-if="item.formType === 'partyA'">
                  <el-input v-model="projectForm[item.prop]" :size="item.size || 'small'" clearable
                    :disabled="item.inputStatus === 'disable'" readonly :title="projectForm[item.prop]"
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''">
                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                      <i v-if="projectForm[item.prop]" class="slot-close el-icon-circle-close"
                        @click="handleClearPartyA(item)"></i>
                      <i class="multiple-choice-icon iconfont icon-liebiao" @click="handleSelectPartyA"></i>
                    </template>
                  </el-input>
                </div>
                <!-- 乙方单位 -->
                <div class="slot-input" v-if="item.formType === 'partyB'">
                  <el-input v-model="projectForm[item.prop]" :size="item.size || 'small'" clearable
                    :disabled="item.inputStatus === 'disable'" readonly :title="projectForm[item.prop]"
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''">
                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                      <i v-if="projectForm[item.prop]" class="slot-close el-icon-circle-close"
                        @click="handleClearPartyB(item)"></i>
                      <i class="multiple-choice-icon iconfont icon-liebiao" @click="handleSelectPartyB(item)"></i>
                    </template>
                  </el-input>
                </div>
                <!-- 选择员工 -->
                <div class="slot-input" v-if="item.formType === 'userRadio'">
                  <el-input v-model="projectForm[item.prop]" :size="item.size || 'small'" clearable
                    :disabled="item.inputStatus === 'disable'" readonly
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''">
                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                      <i v-if="projectForm[item.prop]" class="slot-close el-icon-circle-close"
                        @click="handleClearUser(item)"></i>
                      <i class="multiple-choice-icon iconfont icon-liebiao" @click="handleSelectUser(item)"></i>
                    </template>
                  </el-input>
                </div>
                <!-- 多选项目 -->
                <div class="slot-input" v-if="item.formType === 'multipleProject'">
                  <div class="assginer-items" v-if="projectForm[item.prop]"
                    :title="projectForm[item.prop].map(v => v.projectName).join(',')">
                    <template v-for="(tag, i) in projectForm[item.prop].slice(0, 1)">
                      <template>
                        <el-tag :key="i" @close="handleCloseMultipleProject(item, tag)" size="mini"
                          :closable="item.inputStatus !== 'disable' && !pageDisabled" type="info">
                          <span v-if="tag[item.nameCode].length > 15" :title="tag[item.nameCode]">{{
    tag[item.nameCode].slice(0, 15) }}...</span>
                          <span v-else>{{ tag[item.nameCode] }}</span>
                        </el-tag>
                      </template>
                    </template>
                    <el-tag type="info" size="mini" v-if="projectForm[item.prop].length > 1">
                      +{{ projectForm[item.prop].length - 1 }}</el-tag>
                  </div>
                  <div class="set" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                    <i class="multiple-choice-icon iconfont icon-liebiao"
                      @click="handleSelectMultipleProject(item)"></i>
                  </div>
                </div>
                <!-- 选择所属公司 -->
                <div class="slot-input" v-if="item.formType === 'orgName'">
                  <el-input v-model="projectForm[item.prop]" :size="item.size || 'small'" clearable
                    :disabled="item.inputStatus === 'disable'" readonly
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''">
                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                      <i v-if="projectForm[item.prop]" class="slot-close el-icon-circle-close"
                        @click="handleClearOrg(item)"></i>
                      <i class="multiple-choice-icon iconfont icon-liebiao" @click="handleSelectOrg(item)"></i>
                    </template>
                  </el-input>
                </div>
                <!-- 选择组织权限 -->
                <div class="slot-input" v-if="item.formType === 'asPropertyOrg'">
                  <el-input v-model="projectForm[item.prop]" :size="item.size || 'small'" clearable
                    :disabled="item.inputStatus === 'disable'" readonly
                    :placeholder="item.placeholder ? $t(item.placeholder) : ''">
                    <template slot="suffix" v-if="item.inputStatus !== 'disable' && !pageDisabled">
                      <i v-if="projectForm[item.prop]" class="slot-close el-icon-circle-close"
                        @click="handleClearAs(item)"></i>
                      <i class="multiple-choice-icon iconfont icon-liebiao" @click="handleSelectAs(item)"></i>
                    </template>
                  </el-input>
                </div>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </div>

    <!-- 选择项目 -->
    <g-dialog v-if="porjectFlag" :dialogConfig="dialogConfig" :isVisible.sync="porjectFlag">
      <projectDialog slot="body" slot-scope="{height}" :dialogHeight="height"
        :projectId='projectForm[projectConfig[currentConfig.prop].key] || 0' :selectedList='projectIdList'
        style="height:100%;" :isCheckbox='projectConfig[currentConfig.prop].isCheckbox || false'
        :isEdit="currentConfig.inputStatus !== 'disable' && !pageDisabled"
        :executeStatus="projectConfig[currentConfig.prop].executeStatus || []"
        :isNoAutn="projectConfig[currentConfig.prop].isNoAutn || false" :close.sync="porjectFlag"
        :sourceUrl='projectConfig[currentConfig.prop].sourceUrl || "proProject/getProjectPermissionPage"'
        @getProject="getProject" v-if="porjectFlag && !projectConfig[currentConfig.prop].isProProjectPreApproval">
      </projectDialog>
      // 项目预立项
      <ProProjectPreApproval slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId='projectForm[projectConfig[currentConfig.prop].key] || 0' :selectedList='projectIdList'
        style="height:100%;" :isCheckbox='projectConfig[currentConfig.prop].isCheckbox || false'
        :isEdit="currentConfig.inputStatus !== 'disable' && !pageDisabled"
        :executeStatus="projectConfig[currentConfig.prop].executeStatus || []"
        :isNoAutn="projectConfig[currentConfig.prop].isNoAutn || false" :close.sync="porjectFlag"
        :sourceUrl='projectConfig[currentConfig.prop].sourceUrl || "proProject/getProjectPermissionPage"'
        @getData="getProject" v-if="porjectFlag && projectConfig[currentConfig.prop].isProProjectPreApproval">
      </ProProjectPreApproval>
    </g-dialog>
    <!-- 项目库 -->
    <g-dialog v-if="porjectSourceFlag" :dialogConfig="dialogPorjectSourceConfig" :isVisible.sync="porjectSourceFlag">
      <projectSourceDialog slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="porjectSourceFlag"
        :selectInfo="projectSourceSelectInfo" :projectId="projectForm[projectSourceConfig[currentConfig.prop].key]"
        @getData="getProjectSource" v-if="porjectSourceFlag">
      </projectSourceDialog>
    </g-dialog>
    <!-- 选择收入合同 -->
    <g-dialog v-if="contractFlag" :dialogConfig="contractDialogConfig" :isVisible.sync="contractFlag">
      <contractDialog slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId='projectForm[contractConfig.key] || 0' :close.sync="contractFlag" @getData="getContract"
        v-if="contractFlag" :contractTypeCodes='[projectForm.contractTypeCode] || []'>
      </contractDialog>
    </g-dialog>
    <!-- 选择甲方单位 -->
    <g-dialog v-if="partyAFlag" :dialogConfig="partyADialogConfig" :isVisible.sync="partyAFlag">
      <partyADialog slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId='projectForm[partyAConfig.key] || 0' :close.sync="partyAFlag" @getData="getPartyA" v-if="partyAFlag">
      </partyADialog>
    </g-dialog>
    <!-- 选择乙方单位 -->
    <g-dialog v-if="partyBFlag" :dialogConfig="partyBDialogConfig" :isVisible.sync="partyBFlag">
      <partyBDialog slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectId='projectForm[partyBConfig[currentConfig.prop].key] || 0' :close.sync="partyBFlag" @getData="getPartyB"
        v-if="partyBFlag">
      </partyBDialog>
    </g-dialog>
    <!-- 员工 -->
    <g-dialog v-if="userFlag" :dialogConfig="userDialogConfig" :isVisible.sync="userFlag">
      <organizationUserTable slot="body" slot-scope="{height}" :dialogHeight="height"
        :selectedUsers="projectForm[userConfig[currentConfig.prop].key] || []"
        :choice="userConfig[currentConfig.prop].formType === 'userRadio' ? 'isRadio' : 'isCheckbox'"
        :isAccountInfo="userConfig[currentConfig.prop].isAccountInfo || false" :close.sync="userFlag"
        @selectUser="getUser" v-if="userFlag"></organizationUserTable>
    </g-dialog>
    <!-- 选择所属公司 -->
    <el-dialog v-dialogDrag :title="orgDialogConfig.title" :visible.sync="orgFlag" :top="orgDialogConfig.top" center
      :width="orgDialogConfig.width" append-to-body>
      <selectOrg v-if="orgFlag" :close.sync="orgFlag" :isRadio='currentConfig.isRadio || true' @getData='getOrg'
        :isShowDepartName='currentConfig.isShowDepartName || false'
        :isOnlyCheckDepartName='currentConfig.isOnlyCheckDepartName || false'
        :isComplete='currentConfig.isComplete || false' :isAuthority='currentConfig.isAuthority || false'
        :selectOrgId="projectForm[currentConfig.key] || ''">
      </selectOrg>
    </el-dialog>
    <!-- 权限组织 -->
    <g-dialog v-if="asFlag" :dialogConfig="asDialogConfig" :isVisible.sync="asFlag">
      <asPropertyOrgDialog v-if="asFlag" slot="body" slot-scope="{height}" :dialogHeight="height" :close.sync="asFlag"
        :isRadio='asConfig.isRadio || true' @getData='getAs' :selectId="projectForm[asConfig.key] || ''">
      </asPropertyOrgDialog>
    </g-dialog>
    <!-- 流程中打印 -->
    <el-dialog v-dialogDrag :visible.sync="printShow" v-if="printShow" :title="$t('print.setPrintTemplate')" center
      top="15%" width="40%">
      <el-form :model="printForm" :rules="printRules" status-icon class="demo-ruleForm dialog-form"
        style="padding: 20px;" ref="printForm">
        <!-- 打印模板 -->
        <el-form-item :label="$t('print.printModelName')" prop="printModelId" label-width="100px">
          <el-select v-model.trim="printForm.printModelId" size="small" clearable :filterable="true"
            style="width: 100%">
            <el-option v-for="(child, i) in printTemplateList" :key="i" :label="child.printModelName" :value="child.id">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="footer">
          <el-button icon="el-icon-circle-check" type="primary" class="urgent" size="small"
            @click.native.prevent="() => printShow = false">{{ $t('print.close') }}
          </el-button>
          <el-button size="small" icon="el-icon-circle-check" type="primary"
            @click.native.prevent="submitLoginPass('printForm')">
            <!-- 配置打印模板 -->
            {{ $t('button.determine') }}
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { provinceAndCityData, regionData } from 'element-china-area-data';
import axios from 'axios';
import filters from '@/mixins/filters/index';

export default {
  name: 'editForm',
  components: {
    fileUpload(resolve) {
      require(['../upload/fileUpload.vue'], resolve);
    },
    selectOrg(resolve) {
      require(['components/basicComponents/userDialog/selectOrg'], resolve);
    },
    projectDialog(resolve) {
      require(['components/basicComponents/global/dialog/projectDialog/projectDialog.vue'], resolve);
    },
    ProProjectPreApproval(resolve) {
      require(['views/projectLibrary/components/proProjectPreApproval/proProjectPreApproval.vue'], resolve);
    },
    contractDialog(resolve) {
      require(['components/basicComponents/global/dialog/contractDialog/contractDialog.vue'], resolve);
    },
    projectSourceDialog(resolve) {
      require(['components/basicComponents/global/dialog/projectSourceDialog/projectSourceDialog.vue'], resolve);
    },
    partyADialog(resolve) {
      require(['components/basicComponents/global/dialog/partyADialog/partyADialog.vue'], resolve);
    },
    partyBDialog(resolve) {
      require(['components/basicComponents/global/dialog/partyBDialog/partyB.vue'], resolve);
    },
    organizationUserTable(resolve) {
      require(['components/basicComponents/userDialog/organizationUserTable.vue'], resolve);
    },
    asPropertyOrgDialog(resolve) {
      require(['components/basicComponents/global/dialog/asPropertyOrgDialog/asPropertyOrgDialog.vue'], resolve);
    }
  },
  data() {
    return {
      // 所属公司
      orgDialogConfig: {
        title: this.$t('dialog.orgName'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '40%'
      },
      orgConfig: '',
      orgFlag: false,
      // 权限组织
      asDialogConfig: {
        title: this.$t('fConfig.propertyOrgName'),
        appendBody: false,
        center: true,
        top: '50px',
        width: '80%'
      },
      asConfig: '',
      asFlag: false,
      options: regionData,
      area: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      beforePickerOptions: {
        disabledDate(time) {
          // 不包含当前日期
          return time.getTime() < (Date.now() - (24 * 60 * 60 * 1000));
        }
      },
      monthPickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime();
        }
      },
      formList: [],
      rules: {},
      // projectForm: {},
      pageDisabled: false,
      oldFormData: {},
      areaStep: 0,
      areaProps: {
        value: 'id',
        label: 'placename'
      },
      dialogConfig: {
        title: this.$t('dialog.selectProject'),
        appendBody: true,
        center: true,
        top: '80px',
        width: '80%',
        span: '0.7'
      },
      porjectFlag: false,
      projectConfig: '',
      projectIdList: [],
      // 项目库
      porjectSourceFlag: false,
      dialogPorjectSourceConfig: {
        title: this.$t('dialog.selectProject'),
        appendBody: true,
        center: true,
        top: '80px',
        width: '80%',
        span: '0.7'
      },
      projectSourceConfig: '',
      projectSourceSelectInfo: {},
      // 合同
      contractDialogConfig: {
        title: this.$t('tips.pleaseSelectContract'),
        appendBody: false,
        center: true,
        top: '80px',
        width: '80%',
        span: '0.7'
      },
      contractConfig: {},
      contractFlag: false,
      // 甲方
      partyADialogConfig: {
        title: `${this.$t('tips.pleaseSelect')}${this.$t('dialog.partyA')}`,
        appendBody: false,
        center: true,
        top: '80px',
        width: '80%',
        span: '0.7'
      },
      partyAConfig: '',
      partyAFlag: false,
      // 乙方
      partyBDialogConfig: {
        title: `${this.$t('tips.pleaseSelect')}${this.$t('dialog.supplierQualifiedName')}`,
        appendBody: false,
        center: true,
        top: '80px',
        width: '80%',
        span: '0.7'
      },
      partyBConfig: '',
      partyBFlag: false,
      oldRelationForm: {},
      week: 1,
      // 选择员工
      userFlag: false,
      userDialogConfig: {
        title: this.$t('dialog.selectUser'),
        appendBody: false,
        center: true,
        top: '80px',
        width: '80%',
        span: '0.7'
      },
      userConfig: '',
      rule: {},
      currentConfig: {}, // 点击打开弹出框的当前行配置
      weekConfig: {},
      isResetRule: true,
      requiredRules: {},
      loading: false,
      // 流程中打印
      printShow: false,
      printDialogConfig: {
        title: this.$t('print.setPrintTemplate'),
        appendBody: false,
        center: true,
        top: '15%',
        width: '40%',
        span: '0.7'
      },
      printTemplateList: [],
      printForm: {
        printModelId: ''
      },
      printRules: {
        printModelId: [{ required: true, message: `${this.$t('tips.pleaseSelect')}${this.$t('print.printModelName')}`, trigger: 'change' }]
      }
    };
  },
  props: {
    tableConfig: {
      type: Object,
      default: () => {
        const params = {
          // 表单配置
          formList: []
        };
        return params;
      }
    },
    // 当前表单状态
    type: {
      type: String,
      default: 'add'
    },
    // 表单值
    projectForm: {
      type: Object,
      default: () => { }
    },
    customRules: {
      type: Object,
      default: () => { }
    }
  },
  created() {
    axios.get('https://static.junnysoft.cn/web/areaAll.js').then(res => {
      this.area = res.data;
    });
  },
  watch: {
    tableConfig: {
      handler() {
        const tableConfig = JSON.parse(JSON.stringify(this.tableConfig));
        this.pageDisabled = this.type === 'info';
        let state = 'pleaseEnter';
        this.userConfig = {};
        this.projectConfig = {};
        this.projectSourceConfig = {};
        this.orgConfig = {};
        this.partyBConfig = {};
        tableConfig.formList.forEach(item => {
          if (item.formType === 'project' || item.formType === 'multipleProject') {
            this.projectConfig[item.prop] = this.$clone(item);
          }
          if (item.formType === 'projectSource') {
            this.projectSourceConfig[item.prop] = this.$clone(item);
          }
          if (item.formType === 'contract') {
            this.contractConfig = this.$clone(item);
          }
          if (item.formType === 'partyA') {
            this.partyAConfig = this.$clone(item);
          }
          if (item.formType === 'partyB') {
            this.partyBConfig[item.prop] = this.$clone(item);
          }
          if (item.formType === 'week') {
            this.weekConfig = item;
          }
          if (item.formType === 'userRadio') {
            this.userConfig[item.prop] = this.$clone(item);
          }
          if (item.formType === 'orgName') {
            this.orgConfig[item.prop] = this.$clone(item);
          }
          if (item.formType === 'asPropertyOrg') {
            this.asConfig = this.$clone(item);
          }
          if (item.isRule) {
            this.rules[item.prop] = [];
            if (item.formType === 'input' || item.formType === 'number' || item.formType === 'elNumber' || item.formType === 'textarea') {
              state = 'pleaseEnter';
            } else if (item.formType === 'upload') {
              state = 'upload';
            } else {
              state = 'pleaseSelect';
            }
            this.rules[item.prop].push({
              message: item.rulesMessage ? this.$t(item.rulesMessage) : item.formType === 'slot'
                ? `${this.$t(item.label)} ${this.$t('tips.notNull')}` : `${this.$t(`tips.${state}`)}${this.$t(item.label)}`,
              trigger: item.formType === 'input' ? 'blur' : 'change',
              required: true
            });
          }
        });
        this.formList = tableConfig.formList;
        this.rule = { ...this.rules, ...this.customRules, ...this.requiredRules };
      },
      immediate: true
    },
    'tableConfig.formList': {
      handler() {
        let state = 'pleaseSelect';
        this.tableConfig.formList.forEach(item => {
          if (item.formType === 'week') {
            this.weekConfig = item;
          }
          if (item.isRule) {
            this.rules[item.prop] = [];
            if (item.formType === 'input' || item.formType === 'number' || item.formType === 'elNumber' || item.formType === 'textarea') {
              state = 'pleaseEnter';
            } else if (item.formType === 'upload') {
              state = 'upload';
            } else {
              state = 'pleaseSelect';
            }
            let message = '';
            if (item.rulesMessage) {
              message = this.$t(item.rulesMessage);
            } else {
              if (item.formType === 'slot') {
                message = `${this.$t(item.label)} ${this.$t('tips.notNull')}`;
              } else {
                message = `${this.$t(`tips.${state}`)} ${this.$t(item.label)}`;
              }
            }
            this.rules[item.prop].push({
              message,
              trigger: item.formType === 'input' ? 'blur' : 'change',
              required: true
            });
          }
        });
        this.formList = this.tableConfig.formList;
        this.rule = { ...this.rules, ...this.customRules, ...this.requiredRules };
      },
      deep: true
    },

    customRules: {
      handler() {
        this.rule = { ...this.rules, ...this.customRules, ...this.requiredRules };
      },
      deep: true
    },
    requiredRules: {
      handler() {
        this.rule = { ...this.rules, ...this.customRules, ...this.requiredRules };
      },
      deep: true
    },
    statesPrintDialogStatus: {
      handler() {
        if (this.$store.state.tagNav.printTemplateList && this.$store.state.tagNav.printTemplateList.length > 0) {
          this.printTemplateList = this.$store.state.tagNav.printTemplateList;
          this.printShow = true;
        } else {
          this.printShow = false;
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    statesPrintDialogStatus() {
      return this.$store.state.tagNav.printTemplateList;
    }
  },
  mounted() {
    this.oldFormData = this.$clone(this.projectForm);
    this.oldRelationForm = this.$clone(this.projectForm);
    this.getPageControlList();
  },
  methods: {
    // 查询租户有效的页面控制设置记录
    getPageControlList() {
      if (this.$route.name === 'processApprovalPage') return;
      this.loading = true;
      const pageCode = this.$route.params.translateName ? this.$route.params.translateName : this.$route.name;
      const data = {
        subSystemCode: this.$utils.config.subSystemCode,
        pageCode,
        controlTypeCodes: ['01', '03']
      };
      this.$store.dispatch('publicApi/getPageControlPublicApi', data).then(res => {
        if (res.status === 0 && res.results && res.results.length) {
          const checkFormList = res.results.filter(v => !v.formDetailCode); // 获取主表需要校验的字段
          for (const item of checkFormList) {
            if (item.controlTypeCode === '01') {
              // 必填
              this.$set(this.requiredRules, item.columnCode, { required: item.whetherOrNot === 1, message: `${this.$t(item.columnLanguage)}${this.$t('tips.required')}!` });
            }
            if (item.controlTypeCode === '03') {
              // 编辑
              const index = this.tableConfig.formList.findIndex(v => v.prop === item.columnCode);
              if (index >= 0) {
                this.$set(this.tableConfig.formList[index], 'inputStatus', item.whetherOrNot === 1 ? 'edit' : 'disable');
              }
            }
          }
          this.loading = false;
        } else {
          this.requiredRules = {};
          this.loading = false;
        }
      }).catch(e => {
        this.requiredRules = {};
        this.loading = false;
      });
    },
    // 表单状态class
    formClass(item) {
      let demoFormList = '';
      if (item.span === 8) {
        demoFormList = '';
      }
      if (item.isRule && (item.inputStatus === 'disable' || this.pageDisabled)) {
        return `is-required edit-form-disable ${demoFormList}`;
      } else if (item.inputStatus === 'disable' || this.pageDisabled) {
        return `edit-form-disable ${demoFormList}`;
      } else if (item.isRule) {
        return `is-required ${demoFormList}`;
      } else {
        return demoFormList;
      }
    },
    resetRules(mainFormConfig, key = '') {
      this.isResetRule = false;
      let tableConfig = {};
      if (mainFormConfig) {
        tableConfig = JSON.parse(JSON.stringify(mainFormConfig));
      } else {
        tableConfig = JSON.parse(JSON.stringify(this.tableConfig));
      }
      this.rules = {};
      this.pageDisabled = this.type === 'info';
      let state = 'pleaseSelect';
      this.userConfig = {};
      this.projectConfig = {};
      this.projectSourceConfig = {};
      this.orgConfig = {};
      tableConfig.formList.forEach(item => {
        if (item.formType === 'project' || item.formType === 'multipleProject') {
          this.projectConfig[item.prop] = this.$clone(item);
        }
        if (item.formType === 'projectSource') {
          this.projectSourceConfig[item.prop] = this.$clone(item);
        }
        if (item.formType === 'contract') {
          this.contractConfig = this.$clone(item);
        }
        if (item.formType === 'partyA') {
          this.partyAConfig = this.$clone(item);
        }
        if (item.formType === 'partyB') {
          this.partyBConfig[item.prop] = this.$clone(item);
        }
        if (item.formType === 'week') {
          this.weekConfig = item;
        }
        if (item.formType === 'userRadio') {
          this.userConfig[item.prop] = this.$clone(item);
        }
        if (item.formType === 'orgName') {
          this.orgConfig[item.prop] = this.$clone(item);
        }
        if (item.formType === 'asPropertyOrg') {
          this.asConfig = this.$clone(item);
        }
        if (item.isRule) {
          this.rules[item.prop] = [];
          if (item.formType === 'input' || item.formType === 'number' || item.formType === 'elNumber' || item.formType === 'textarea') {
            state = 'pleaseEnter';
          } else if (item.formType === 'upload') {
            state = 'upload';
          } else {
            state = 'pleaseSelect';
          }
          this.rules[item.prop].push({
            message: item.rulesMessage ? this.$t(item.rulesMessage) : item.formType === 'slot'
              ? `${this.$t(item.label)} ${this.$t('tips.notNull')}` : `${this.$t(`tips.${state}`)}${this.$t(item.label)}`,
            trigger: item.formType === 'input' ? 'blur' : 'change',
            required: true
          });
        }
      });
      this.formList = tableConfig.formList;
      this.rule = { ...this.rules, ...this.customRules, ...this.requiredRules };
      this.$refs.projectForm && this.$refs.projectForm.clearValidate(key);
      this.isResetRule = true;
    },
    // 切换设备所在地
    handleChangeOptions(item) {
      this.areaStep = 0;
      if (this.projectForm.areas && this.projectForm.areas.length === 0) return;
      const keysList = item.keysList ? item.keysList : ['continent', 'country', 'province', 'city', 'area'];
      for (const item of keysList) {
        this.projectForm[item] = '';
      }
      this.getArea(this.area, keysList);
      // 将地址整合为一个字段
      if (item.isAddress) {
        const addressList = [];
        for (const item of keysList) {
          const data = this.projectForm[item] && this.projectForm[item].split('-')[0];
          data && addressList.push(data);
        }
        item.address && this.$set(this.projectForm, item.address, addressList.join(''));
      }
    },
    // 获取值
    getArea(arr, keysList) {
      const key = keysList[this.areaStep];
      for (const i in arr) {
        const item = arr[i];
        if (item.id === this.projectForm.areas[this.areaStep]) {
          this.projectForm[key] = `${item.placename}-${item.id}-${item.code}-${item.lev}`;
          if (item.children && item.children.length) {
            this.areaStep++;
            this.getArea(item.children, keysList);
          }
        }
      }
    },
    // 清除表单的值
    resetForm() {
      this.$refs.projectForm.resetFields();
    },
    // 选中之前
    handleFocus(item, type) {
      this.$set(this.oldRelationForm, item.prop, this.projectForm[item.prop]);
    },
    // 失去焦点
    handleBlur(item, event) {
      const newValue = event.target.value.replace(/^\s+|\s+$/g, '');
      this.$set(this.projectForm, item.prop, newValue);
    },
    // 选中
    handleChange(item, event) {
      const params = {
        paramsConfig: item,
        selectList: event,
        oldRelationForm: this.$clone(this.oldRelationForm)
      };
      this.$emit('editFormEvent', { eventName: 'relationTable', params });
    },
    // 附件自动识别
    identify(item, event) {
      const params = {
        paramsConfig: item,
        identifyUrl: event
      };
      this.$emit('editFormEvent', { eventName: 'identify', params });
    },
    // 附件自动识别
    moreIdentifyList(item, event) {
      const params = {
        paramsConfig: item,
        invoiceList: event
      };
      this.$emit('editFormEvent', { eventName: 'moreIdentifyList', params });
    },
    getFileInformation(params) {
      this.$emit('getFileInformation', params);
    },
    // 判断关联字段不能为空且提示 传入数组arr对象  value（关联字段数据库字段，不含表名） 键 lable （关联字段显示名称）值
    jsJudgeEmpty(arr) {
      let status = true;
      for (const i in arr) {
        const item = arr[i];
        if (!this.projectForm[item.value]) {
          const placeholder = `${item.lable} 不能为空`;
          this.$message.error(placeholder);
          return status = false;
        }
      }
      return status;
    },
    // 数据匹配 多用于弹出框 多个数据赋值 liek = value obj需要的数据
    jsDataListMatching(arr, obj) {
      for (const i in arr) {
        const item = arr[i];
        this.projectForm[item.liek] = obj[item.value];
      }
    },
    // 下拉选择框数据匹配 item 字段渲染参数(固定) val选中的值(固定)  assignment 需要赋值的字段(不含表名)
    jsDataMatching(item, val, assignment) {
      const key = item.selectList.findIndex((v) => v.id === val);
      if (key >= 0) {
        this.projectForm[assignment] = item.selectList[key].lable;
      } else {
        this.projectForm[assignment] = '';
      }
    },
    // 清空指定字段数据 传入数组arr: 需要清空的字段(不含表名)
    jsSetWipeData(arr) {
      arr.forEach((item) => {
        this.projectForm[item] = '';
      });
    },
    // 不验证获取值
    getForm() {
      return JSON.parse(JSON.stringify(this.projectForm));
    },
    // 得到form 表单值
    getValidateForm(callback) {
      this.$refs.projectForm.validate((valid) => {
        if (valid) {
          callback && callback();
        } else {
          const errorTime = setTimeout(() => {
            const isError = document.getElementsByClassName('is-error');
            if (isError[0].querySelector('input') && isError[0].querySelector('input').type === 'file') {
              this.$message.error(this.$t('tips.uploadFile'));
            } else if (isError[0].querySelector('input')) {
              isError[0].querySelector('input').focus();
            } else if (isError[0].querySelector('textarea')) {
              isError[0].querySelector('textarea').focus();
            }
            clearTimeout(errorTime);
          }, 100);
        }
      });
    },
    // 清除表单验证
    handleClearValidate() {
      this.$nextTick(() => {
        this.$refs.projectForm.clearValidate();
      });
    },
    // 选择城市地区
    addressChange(arr) {
      this.projectForm.cityArr = arr;
    },
    // 选择周
    handleweekFocus(item) {
      this.$set(this.oldRelationForm, item.prop, this.projectForm[item.prop]);
    },
    // 选择周之后
    weekChange(item, val, isInfo = false) {
      if (val) {
        // console.log(val);
        // console.log(new Date(val), 'new Date(val)');
        this.week = this.getWeekInMonth(new Date(val));
        this.$set(this.projectForm, 'week', this.week);
      }
      if (isInfo) {
        const params = {
          paramsConfig: item,
          selectList: val,
          oldRelationForm: this.$clone(this.oldRelationForm)
        };
        this.$emit('editFormEvent', { eventName: 'relationTable', params });
      }
    },
    setWeek(val) {
      this.week = this.getWeekInMonth(new Date(val));
      // console.log(this.week, 'this.week');
      this.$set(this.projectForm, 'week', this.week);
    },
    // 根据日期判断是月的第几周
    getWeekInMonth(t, item) {
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
        // console.log(date, fisrtWeekend);
        if (date <= fisrtWeekend) {
          return 1;
        } else {
          return 1 + Math.ceil((date - fisrtWeekend) / 7);
        }
      }
    },
    // 设置状态
    isEditForm(item) {
      return item.inputStatus !== 'disable';
    },
    // ----------------------- 项目库 -----------------
    // 清除项目
    handleClearProjectSource(item) {
      this.$emit('editFormEvent', { eventName: 'clearProjcet', params: item });
    },
    // 选择项目
    handleSelectProjectSource(item) {
      this.currentConfig = item;
      this.$set(this.projectSourceConfig, item.prop, item);
      if (this.projectForm[item.prop]) {
        this.projectSourceSelectInfo = {
          [item.prop]: this.projectForm[item.prop],
          id: this.projectForm[item.key],
          projectSource: this.projectForm.projectSource
        };
      } else {
        this.projectSourceSelectInfo = {};
      }
      this.porjectSourceFlag = true;
    },
    // 获取项目
    getProjectSource(arr) {
      const params = {
        paramsConfig: this.projectSourceConfig[this.currentConfig.prop],
        selectList: arr
      };
      this.$emit('editFormEvent', { eventName: 'projcet', params });
      this.porjectSourceFlag = false;
    },
    // ----------------------- 收入合同 -----------------
    handleClearContract(item) {
      this.$emit('editFormEvent', { eventName: 'clearContract', params: item });
    },
    // 选择收入合同
    handleSelectContract() {
      if (this.contractConfig.relationKey && !this.projectForm[this.contractConfig.relationKey.receive]) {
        this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t(`fConfig.${this.contractConfig.relationKey.value}`)}`);
        return;
      }
      this.contractFlag = true;
    },
    // 获取收入合同
    getContract(arr) {
      const params = {
        paramsConfig: this.contractConfig,
        selectList: arr
      };
      this.$emit('editFormEvent', { eventName: 'contract', params });
      if (this.contractConfig.operateData) {
        params.operateFun = this.contractConfig.operateFun;
        this.$emit('editFormEvent', { eventName: 'operateFun', params });
      }
      this.contractFlag = false;
    },
    // ----------------------- 项目 -----------------
    // 清除项目
    handleClearProject(item) {
      this.$emit('editFormEvent', { eventName: 'clearProjcet', params: item });
    },
    // 选择项目
    handleSelectProject(item) {
      this.currentConfig = item;
      this.$set(this.projectConfig, item.prop, item);
      this.porjectFlag = true;
    },
    // 获取项目
    getProject(arr) {
      const params = {
        paramsConfig: this.projectConfig[this.currentConfig.prop],
        selectList: arr
      };
      this.$emit('editFormEvent', { eventName: 'projcet', params });
      this.porjectFlag = false;
    },
    // 多选项目
    handleSelectMultipleProject(item) {
      this.currentConfig = item;
      this.projectIdList = this.$clone(this.projectForm[item.prop]);
      this.porjectFlag = true;
    },
    // 多选删除项目
    handleCloseMultipleProject(item, tag) {
      const params = {
        item,
        tag
      };
      this.$emit('editFormEvent', { eventName: 'clearProjcet', params });
    },
    // ----------------------- 甲方单位 -----------------
    handleClearPartyA(item) {
      this.$emit('editFormEvent', { eventName: 'clearPartyA', params: item });
    },
    // 选择甲方单位
    handleSelectPartyA() {
      this.partyAFlag = true;
    },
    // 获取甲方单位
    getPartyA(arr) {
      const params = {
        paramsConfig: this.partyAConfig,
        selectList: arr
      };
      this.$emit('editFormEvent', { eventName: 'partyA', params });
      this.partyAFlag = false;
    },
    // ----------------------- 乙方单位 -----------------
    handleClearPartyB(item) {
      this.$emit('editFormEvent', { eventName: 'clearPartyB', params: item });
    },
    // 选择甲方单位
    handleSelectPartyB(item) {
      this.currentConfig = item;
      this.partyBFlag = true;
    },
    // 获取甲方单位
    getPartyB(arr) {
      const params = {
        paramsConfig: this.partyBConfig[this.currentConfig.prop],
        selectList: arr
      };
      this.$emit('editFormEvent', { eventName: 'partyB', params });
      this.partyBFlag = false;
    },
    // ------------------------ 员工单选 -----------------
    handleClearUser(item) {
      this.$emit('editFormEvent', { eventName: 'clearUser', params: item });
    },
    // 选择员工
    handleSelectUser(item) {
      this.currentConfig = item;
      const formType = this.userConfig[this.currentConfig.prop].formType;
      if (formType === 'userRadio') {
        this.userDialogConfig.width = '60%';
      } else {
        this.userDialogConfig.width = '80%';
      }
      this.userFlag = true;
    },
    // 获取员工
    async getUser(arr) {
      if (arr.length && this.currentConfig.isPerson) {
        const personnelUserId = arr[0].id || arr[0].userId;
        const res = await this.$store.dispatch('publicApi/getPersonnelAccountList', { personnelUserId }).then();
        this.$set(arr[0], 'accountId', res.results.length ? res.results[0].id : '');
        this.$set(arr[0], 'accountUserName', res.results.length ? res.results[0].accountUserName : '');
        this.$set(arr[0], 'openAccountBank', res.results.length ? res.results[0].openAccountBank : '');
        this.$set(arr[0], 'openAccountDate', res.results.length ? res.results[0].openAccountDate : '');
        this.$set(arr[0], 'cardNumber', res.results.length ? res.results[0].cardNumber : '');
        this.$set(arr[0], 'accountStatusValue', res.results.length ? res.results[0].accountStatusValue : '');
        this.$set(arr[0], 'accountStatusCode', res.results.length ? res.results[0].accountStatusCode : '');
      }
      const params = {
        paramsConfig: this.userConfig[this.currentConfig.prop],
        selectList: arr
      };
      this.$emit('editFormEvent', { eventName: 'user', params });
      this.userFlag = false;
    },
    // ------------------------ 所属公司单选 -----------------
    // ------------------------ 清除所属公司 -----------------
    handleClearOrg(item) {
      this.$emit('editFormEvent', { eventName: 'clearOrg', params: item });
    },
    // 选择所属公司
    handleSelectOrg(item) {
      this.currentConfig = item;
      this.$set(this.orgConfig, item.prop, item);
      this.orgFlag = true;
    },
    // 获取所属公司
    getOrg(arr) {
      const params = {
        paramsConfig: this.orgConfig[this.currentConfig.prop],
        selectList: arr
      };
      this.$emit('editFormEvent', { eventName: 'org', params });
      this.orgFlag = false;
    },
    // -------------------- 组织权限 --------------------
    handleClearAs(item) {
      this.$emit('editFormEvent', { eventName: 'clearAsPropertyOrg', params: item });
    },
    // 选择所属公司
    handleSelectAs(item) {
      this.asConfig = item;
      this.asFlag = true;
    },
    // 获取所属公司
    getAs(arr) {
      const params = {
        paramsConfig: this.asConfig,
        selectList: arr
      };
      this.$emit('editFormEvent', { eventName: 'asPropertyOrg', params });
      this.asFlag = false;
    },
    // 关闭弹窗
    getDialogClose(val) {
      this.settlementFlag = val;
      this.InvoiceFlag = val;
      this.paymentFlag = val;
    },
    // 字段变化后
    changeStyle(row, item) {
      if (row[item.prop] !== row[item.originProp] && item.isChange) {
        return 'afterStatus';
      }
    },
    showChangeProp(row, item) {
      if (row[item.prop] !== row[item.originProp] && item.isChange) {
        return true;
      }
    },
    setChangeContent(row, item) {
      return row[item.originProp] ? filters.systemFilters(row[item.originProp], item) : '';
    },
    submitLoginPass(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const printModelId = this.$base64.encode(this.printForm.printModelId);
          const params = {
            printModelId
          };
          this.$store.commit('tagNav/set_print_dialogShow', []);
          this.$emit('editFormEvent', { eventName: 'setPrintModelId', params });
          this.printShow = false;
        }
      });
    },
    // 下载附件模版
    downloadTemplate(value, item) {
      if (!value) {
        const tips = item.noDataTips ? this.$message.error(this.$t(item.noDataTips)) : '';
        console.log(item.noDataTips, 'item.noDataTips');
        return tips;
      }
      const attachmentIdList = value.split(',');
      const data = {
        fileIds: attachmentIdList.map((item) => (item = Number(item)))
      };
      this.$store.dispatch('publicApi/getFilepath', data).then(res => {
        if (res.status === 0 && res.results && res.results.length) {
          this.downFilePath(res.results[0]);
        } else {
          this.$message.warning(this.$t('tips.noFile'));
        }
      });
    },
    // 文件下载
    downFilePath(row) {
      const url = `${this.$utils.config.fileCmsUrl}${row.id}`;
      const link = document.createElement('a');
      link.style.display = 'none';
      link.target = '_Blank';
      link.href = url;
      link.target = '_Blank';
      const fileName = this.fileNameFilvalter(row);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    },
    // 文件名称
    fileNameFilvalter(item) {
      const fileName = item.fileName ? item.fileName.substr(0, item.fileName.lastIndexOf('_')) : '';
      return fileName ? `${fileName}.${item.fileSuffix}` : '';
    },
    // 取消
    handleClose() {
      this.$emit('editFormEvent', { eventName: 'close', params: {} });
    }
  }
};
</script>

<style scoped lang="scss">
.change-item {
  position: absolute;
  right: -15px;
}

.afterStatus {
  /deep/ .el-input__inner {
    color: #ff4a4a !important;
  }
}

.edit-form-main {
  position: relative;
}

.operationFormWrap {
  width: 100%;
  margin-top: 12px;
  margin-bottom: 12px;

  /deep/.el-range-editor--small .el-range-separator {
    line-height: 36px;
    font-size: 14px;
    vertical-align: middle;
  }

  /deep/.el-range-editor--small.el-input__inner {
    height: 36px;
  }

  /deep/ .el-form-item {
    min-height: 36px;
  }

  .demo-ruleForm-list {
    padding-left: 12px !important;
    padding-right: 12px !important;
    box-sizing: border-box;
  }
}

.divisionTitle {
  line-height: 40px;
}

.jsDialog {
  padding: 10px;
  min-height: 400px;

  .footer {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    height: 45px;
    line-height: 45px;
    padding: 0 15px;
    font-size: 14px;
  }
}

.slot-input {
  display: flex;
  justify-content: space-between;

  .assginer-items {
    flex: 1;

    /deep/ .el-tag--mini {
      margin-right: 8px;
    }
  }

  .set {
    width: 16px;
  }
}

/deep/ .tips-item {
  position: absolute;
  top: 0px;
  font-size: 18px;
  right: -22px;
}

.amountCon {
  /deep/ .el-input__suffix {
    right: 10px;
  }
}

.promptInformation {
  margin-bottom: 20px;
  line-height: 25px;

  &:before {
    content: "";
    display: inline-block;
    height: 20px;
    position: absolute;
    top: 3px;
    border-left: 3px solid #ff4a4a;
  }

  .promptInformationTxet {
    margin-left: 10px;
  }
}

.textPrompt {
  margin-bottom: 20px;
  line-height: 25px;

  .textPromptTxet {
    margin-left: 10px;
  }
}

.cons-bottom {
  position: absolute;
  right: 22px;
  top: 0px !important;
}
</style>
