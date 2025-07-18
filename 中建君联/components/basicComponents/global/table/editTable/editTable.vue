<template>
  <div class="editTable">
    <div class="detailedTable" v-loading="loading">
      <!-- {{subTable.treeProps}} {{subTable.rowKey}} -->
      <!-- :span-method="subTable.spanMethod || localConfig.spanMethod" -->
      <!-- :row-class-name="subTable.getRowClassName || getRowClassName" -->
      <!--  -->
      <el-form v-if="!loading" :model="subTable" ref="editTable" :rules="rule" :disabled="pageDisabled"
        class="demo-ruleForm" :validate-on-rule-change="false">
        <el-table size="mini" :height="height" :max-height="height" :data="subTable.tableData" ref="multipleTable"
          class="edit-table-form" :class="subTable.subTableName"
          :span-method="subTable.spanMethod || localConfig.spanMethod" :default-expand-all="subTable.defaultExpandAll"
          :expand-row-keys="subTable.expandRowKeys || expandRowKeys" :row-key="subTable.rowKey || localConfig.rowKey"
          :lazy="subTable.lazy || localConfig.lazy" :load="subTable.load || localConfig.load"
          :tree-props="subTable.treeProps || localConfig.treeProps"
          :row-class-name="subTable.getRowClassName || getRowClassName" border @selection-change="selectionChange"
          :show-summary="subTable.showSummary || localConfig.showSummary"
          :summary-method="subTable.summaryMethod || localConfig.summaryMethod"
          :cell-class-name="subTable.cellClassName || localConfig.cellClassName"
          :cell-style="subTable.cellStyle || localConfig.cellStyle"
          >
          <template slot="empty">
            <no-data>
            </no-data>
          </template>
          <el-table-column v-if="isSelection" type="selection" align="center" key="2" :label="$t('fConfig.choice')"
            width="70">
          </el-table-column>
          <el-table-column type="index" class-name="dragAllow" align="center"
            v-if="subTable.isIndex !== undefined ? subTable.isIndex : true" :label="$t('fConfig.serialNumber')" key="1"
            width="80">
          </el-table-column>
          <!-- 子级 -->
          <el-table-column type="expand" v-if="subTable.childrenName">
            <template slot-scope="props">
              <template v-if="subTable.isChildrenData === false ? props.row[subTable.childrenName].length > 0 : true">
                <el-form :model="subTable" ref="editChildrenTable" :disabled="pageDisabled"
                  class="demo-ruleForm children-table" :rules="childrenRule">
                  <el-table size="mini" max-height="200" :data="props.row[subTable.childrenName]"
                    class="edit-table-form" :default-expand-all="subTable.defaultExpandAll"
                    :expand-row-keys="subTable.expandRowKeys || expandRowKeys" :row-key="subTable.childrenRowKey || localConfig.rowKey"
                    :lazy="subTable.lazy || localConfig.lazy" :load="subTable.load || localConfig.load"
                    :tree-props="subTable.treeProps || localConfig.treeProps">
                    <template slot="empty">
                      <no-data>
                      </no-data>
                    </template>
                    <el-table-column type="index" align="center" :label="$t('fConfig.serialNumber')" key="1" width="60">
                    </el-table-column>
                    <template v-for="(item) in childrenSlaveColumns">
                      <el-table-column :key="item.prop" :label="$t(item.label)" :prop="item.prop"
                        :show-overflow-tooltip="item.showOverflowTooltip !== undefined ? item.showOverflowTooltip : true"
                        :align="(item.filterName === 'setMoney' || item.filterName === 'number') ? 'right' : item.align || 'left'"
                        :width="item.minWidth" v-if="item.inputStatus !=='hide'">
                        <template slot="header">
                          <div class="header-cell">
                            <tooltips :value="$t(item.label)" :isMust="childrenRuleKeyList.indexOf(item.prop) > -1">
                            </tooltips>
                            <slot :name="`header-${item.prop}`"></slot>
                          </div>
                        </template>
                        <template slot-scope="scope">
                          <div class="ellipsis" v-if="item.formType === 'text'"
                            :style="(item.formType === 'text' && (item.filterName === 'setMoney' || item.filterName === 'number')) ? 'text-align: right;' : ''">
                            <span v-if="item.fn" class="smallFont set"
                              @click='handleTable(item, scope.row, $event, scope.$index)'>{{scope.row[item.prop] | systemFilters(item)}}</span>
                            <span v-else class="smallFont grey">{{scope.row[item.prop] | systemFilters(item)}}</span>
                          </div>
                          <div class="ellipsis" v-else-if="item.formType === 'customOriginProp'"
                            :style="(item.filterName === 'setMoney' || item.filterName === 'number') ? 'text-align: right;' : ''">
                            <span v-if="item.fn" class="smallFont set"
                              @click='handleTable(item, scope.row, $event, scope.$index)'>{{scope.row[item.prop] | systemFilters(item)}}</span>
                            <span v-else class="smallFont grey">{{scope.row[item.prop] | systemFilters(item)}}</span>
                            <el-tooltip v-if="showChangeProp(scope.row, item)" class="item" effect="dark"
                              :content="`${$t('tips.primary')}：${customSetChangeContent(scope.row, item)}`"
                              placement="bottom">
                              <!-- 变 -->
                              <span class="customOriginProp"><i class="el-icon-view smallFont error"
                                  style="right: 5px;"></i></span>
                            </el-tooltip>
                          </div>
                          <!-- :prop="`tableData.${scope.$index}.${item.prop}`" -->
                          <el-form-item size="small" v-else
                            :prop="`tableData.${props.$index}.${subTable.childrenName}.${scope.$index}.${item.prop}`"
                            :rules="childrenRule[item.prop]"
                            :title11="`tableData.${props.$index}.${subTable.childrenName}.${scope.$index}.${item.prop}`">
                            <slot v-if="item.formType === 'slot'" :name="'edit-table-children-' + item.prop" :item="item"
                              :scope="scope.row" :rowIndex="scope.$index"></slot>
                            <el-input v-if="item.formType === 'input' && item.inputStatus !== 'disable'" size="small"
                              :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                              @change="handleChange(item, scope.row, $event, scope.$index)"
                              :clearable="item.clearable === undefined ? true : item.clearable"
                              v-model.trim="scope.row[item.prop]" :placeholder="$t(item.placeholder)">
                            </el-input>
                            <div class="ellipsis smallFont grey" v-else-if="item.formType === 'input'">
                              {{scope.row[item.prop]}}</div>
                            <!-- textarea -->
                            <el-input v-if="item.formType === 'textarea' && item.inputStatus !== 'disable'"
                              type="textarea" v-model.trim="scope.row[item.prop]" :placeholder="$t(item.placeholder)"
                              size="small" :disabled="item.inputStatus === 'disable'"
                              :maxlength="Number(item.maxlength)"
                              :clearable="item.clearable === undefined ? true : item.clearable"
                              :autosize="{ minRows: item.minRows, maxRows: item.maxRows}">
                            </el-input>
                            <div class="ellipsis smallFont grey" v-else-if="item.formType === 'textarea'">
                              {{scope.row[item.prop]}}</div>
                            <!-- 数字 -->
                            <el-number v-if="item.formType === 'number' && item.inputStatus !== 'disable'"
                              controls-position="right" size="small"
                              :max="item.maxValue ? scope.row[item.maxValue] || 0 : item.max" :min="item.min"
                              :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                              :precision="Number(item.precision)" v-model.trim="scope.row[item.prop]"
                              :placeholder="$t(item.placeholder)"
                              :clearable="item.clearable === undefined ? true : item.clearable"
                              @change="handleChange(item, scope.row, $event, scope.$index)">
                            </el-number>
                            <div class="ellipsis smallFont grey" v-else-if="item.formType === 'number'">
                              {{scope.row[item.prop] && scope.row[item.prop].toFixed(item.precision)}}</div>
                            <!-- 下拉选择框 -->
                            <el-select v-if="item.formType === 'select' && item.inputStatus !== 'disable'"
                              v-model.trim="scope.row[item.prop]" :placeholder="$t(item.placeholder)"
                              :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'"
                              :filterable="item.filterable || true" style="width:100%"
                              :clearable="item.clearable === undefined ? true : item.clearable"
                              @change="handleChange(item, scope.row, $event, scope.$index)">
                              <el-option v-for="(child, i) in item.selectList" :key="i" :label="child[item.nameCode]"
                                :value="child[item.valueCode]">
                              </el-option>
                            </el-select>
                            <div class="ellipsis smallFont grey" v-else-if="item.formType === 'select'">
                              {{setSelectData(scope.row[item.prop], item.selectList || [], item)}}</div>
                            <!-- 数据字典下拉选择框 -->
                            <el-select v-if="item.formType === 'dicSelect' && item.inputStatus !== 'disable'"
                              v-model.trim="scope.row[item.prop]" :placeholder="$t(item.placeholder)"
                              :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'"
                              :filterable="item.filterable || true" style="width:100%"
                              :clearable="item.clearable === undefined ? true : item.clearable"
                              @change="handleChange(item, scope.row, $event, scope.$index)">
                              <el-option v-for="(child, i) in item.selectList" :key="i"
                                :label="item.isTranslate ? $t(child.dataName) : child.dataName"
                                :value="item.isNumber ? Number(child.dataCode) : child.dataCode">
                              </el-option>
                            </el-select>
                            <div class="ellipsis smallFont grey" v-else-if="item.formType === 'dicSelect'">
                              {{setDicData(scope.row[item.prop], item.selectList || [], item)}}</div>
                            <!-- checkbox -->
                            <el-checkbox v-if="item.formType === 'checkbox'" :disabled="item.inputStatus === 'disable'"
                              v-model="scope.row[item.prop]">
                            </el-checkbox>
                            <!-- jsEditor -->
                            <el-input v-if="item.type==='jsEditor'" :disabled="item.inputStatus === 'disable'"
                              v-model.trim="scope.row[item.prop]" placeholder="编辑JS" size="small" readonly>
                              <el-button style="margin-right: 5px;" slot="suffix" type="text" size="mini"
                                @click="handleJsEditor(scope.row, item, scope.$index)">
                                编辑
                              </el-button>
                            </el-input>
                            <!-- date time -->
                            <el-date-picker
                              v-if="(item.formType === 'date' || item.formType === 'time') && item.inputStatus !== 'disable'"
                              v-model="scope.row[item.prop]" :placeholder="$t(item.placeholder)"
                              :size="item.size || 'small'" prefix-icon="icon"
                              :clearable="item.clearable === undefined ? true : item.clearable"
                              :disabled="item.inputStatus === 'disable'"
                              :picker-options="item.pickerOptions && pickerOptions"
                              :type="item.formType === 'date' ? 'date' : 'datetime'" value-format='yyyy-MM-dd HH:mm:ss'
                              style="width: 100%;">
                            </el-date-picker>
                            <div class="ellipsis smallFont grey"
                              v-else-if="(item.formType === 'date' || item.formType === 'time')">
                              {{scope.row[item.prop] | systemFilters(item)}}</div>
                            <!-- 附件 attachment -->
                            <!-- {{pageDisabled}} -->
                            <upload-file v-if="item.formType === 'attachment'"
                              :flowStatus="item.inputStatus !== 'disable' && !pageDisabled" :limit="item.limit"
                              :multiple="item.multiple" :isPhoto="item.isPhoto" :attachment.sync="scope.row[item.prop]">
                            </upload-file>
                            <!-- 选择公司账户 -->
                            <el-select v-if="item.formType === 'companyAccount' && item.inputStatus !== 'disable'"
                              v-model.trim="scope.row[item.key]" :placeholder="$t(item.placeholder)"
                              :size="item.size || 'small'" :disabled="item.inputStatus === 'disable'" style="width:100%"
                              :clearable="item.clearable === undefined ? true : item.clearable"
                              @change="handleCompanyAccountChangeAll(item, scope.row, $event, scope.$index)">
                              <el-option v-for="item in companyAccountList" :key="item.name"
                                :label="item.fullAccountName" :value="item.cardNumber">
                                <span>{{ item.name }}</span>
                              </el-option>
                            </el-select>
                            <!-- 进度条 -->
                            <el-progress
                              v-if="item.formType === 'elProgress'"
                              :percentage="(scope.row[item.prop] || 0)"
                              :text-inside="true"
                              :stroke-width="item.strokeWidth || 26">
                            </el-progress>
                            <div class="ellipsis smallFont grey" v-else-if="item.formType === 'companyAccount'">
                              {{scope.row[item.prop]}}
                            </div>
                            <!-- 按钮 -->
                            <div v-if="item.formType === 'operate'">
                              <template v-for="but in item.buts">
                                <el-button :key="but.fn" v-if="but.show  || true" :disabled="but.disabled || false"
                                  :class="but.class" @click="setFn(but, props.row, scope.$index)" type="text"
                                  size="mini" v-fast-click>
                                  {{$t(but.name)}}
                                </el-button>
                              </template>
                              <slot name='table-buts' :scope="scope.row" :pageDisabled="pageDisabled" :buts="item.buts"
                                :item="item"></slot>
                            </div>
                          </el-form-item>
                        </template>
                      </el-table-column>
                    </template>
                  </el-table>
                </el-form>
              </template>
            </template>
          </el-table-column>
          <template v-for="(item) in slaveColumns">
            <el-table-column :key="item.prop" :label="$t(item.label)" :prop="item.prop"
              :show-overflow-tooltip="item.showOverflowTooltip !== undefined ? item.showOverflowTooltip : true"
              :align="(item.filterName === 'setMoney' || item.filterName === 'number' || item.filterName==='elNumber') ? 'right' : item.align || 'left'"
              :width="item.minWidth" v-if="item.inputStatus !=='hide'">
              <!-- // 子表头 -->
              <template v-if="item.children && item.children.length">
                <template v-for="child in ((item.children || []))">
                  <el-table-column :key="child.prop" :label="$t(child.label)" :prop="child.prop"
                    :show-overflow-tooltip="child.showOverflowTooltip !== undefined ? child.showOverflowTooltip : true"
                    :align="(child.filterName === 'setMoney' || child.filterName === 'number' || child.filterName==='elNumber') ? 'right' : child.align || 'left'"
                    :width="child.minWidth" v-if="child.inputStatus !=='hide'">
                    <!-- 三级表头 -->
                    <template v-if="child.children && child.children.length">
                      <template v-for="third in (child.children || [])">
                        <el-table-column :key="third.prop" :label="$t(third.label)" :prop="third.prop"
                          :show-overflow-tooltip="third.showOverflowTooltip !== undefined ? third.showOverflowTooltip : true"
                          :align="(third.filterName === 'setMoney' || third.filterName === 'number' || third.filterName==='elNumber') ? 'right' : third.align || 'left'"
                          :width="third.minWidth" v-if="third.inputStatus !=='hide'">
                          <template slot="header">
                            <div class="header-cell">
                              <tooltips :value="$t(third.label)" :isMust="ruleKeyList.indexOf(third.prop) > -1">
                              </tooltips>
                              <slot :name="`header-${third.prop}`"></slot>
                            </div>
                          </template>
                          <template slot-scope="scope">
                            <div class="ellipsis" v-if="third.formType === 'text'"
                              :style="(third.formType === 'text' && (third.filterName === 'setMoney' || third.filterName === 'number' || third.filterName==='elNumber')) ? 'text-align: right;' : ''">
                              <span v-if="third.fn" class="smallFont set"
                                @click='handleTable(third, scope.row, $event, scope.$index)'>{{scope.row[third.prop] | systemFilters(third)}}</span>
                              <span v-else class="smallFont grey">{{scope.row[third.prop] | systemFilters(third)}}</span>
                            </div>
                            <div class="ellipsis" v-else-if="third.formType === 'customOriginProp'"
                              :style="(third.filterName === 'setMoney' || third.filterName === 'number') ? 'text-align: right;' : ''">
                              <span v-if="third.fn" class="smallFont set"
                                @click='handleTable(third, scope.row, $event, scope.$index)'>{{scope.row[third.prop] | systemFilters(third)}}</span>
                              <span v-else class="smallFont grey">{{scope.row[third.prop] | systemFilters(third)}}</span>
                              <el-tooltip v-if="showChangeProp(scope.row, third)" class="item" effect="dark"
                                :content="`${$t('tips.primary')}：${customSetChangeContent(scope.row, third)}`"
                                placement="bottom">
                                <!-- 变 -->
                                <span class="customOriginProp"><i class="el-icon-view smallFont error"
                                    style="right: 5px;"></i></span>
                              </el-tooltip>
                            </div>
                            <el-form-item size="small" v-else
                              :prop="subTable.treeProps? '' : `tableData.${scope.$index}.${third.prop}`"
                              :rules="rule[third.prop]">
                              <slot v-if="third.formType === 'slot'" :name="'edit-table-' + third.prop" :third="third"
                                :scope="scope.row" :rowIndex="scope.$index"></slot>
                              <el-input v-if="third.formType === 'input' && third.inputStatus !== 'disable' && type !== 'info'"
                                size="small" :disabled="third.inputStatus === 'disable'" :maxlength="Number(third.maxlength)"
                                @change="handleChange(third, scope.row, $event, scope.$index)"
                                @blur="handleBlur(third, scope.row, $event)"
                                :clearable="third.clearable === undefined ? true : third.clearable"
                                v-model="scope.row[third.prop]" :placeholder="third.placeholder">
                              </el-input>
                              <div class="ellipsis smallFont grey" v-else-if="third.formType === 'input'">
                                <tooltips :value="scope.row[third.prop]">
                                </tooltips>
                                <!-- {{scope.row[third.prop]}} -->
                              </div>
                              <!-- textarea -->
                              <el-input
                                v-if="third.formType === 'textarea' && third.inputStatus !== 'disable' && type !== 'info'"
                                type="textarea" v-model="scope.row[third.prop]" :placeholder="third.placeholder" size="small"
                                :disabled="third.inputStatus === 'disable'" :maxlength="Number(third.maxlength)"
                                :clearable="third.clearable === undefined ? true : third.clearable"
                                @blur="handleBlur(third, scope.row, $event)"
                                :autosize="{ minRows: third.minRows, maxRows: third.maxRows}">
                              </el-input>
                              <div class="ellipsis smallFont grey" v-else-if="third.formType === 'textarea'">
                                <tooltips :value="scope.row[third.prop]">
                                </tooltips>
                                <!-- {{scope.row[third.prop]}} -->
                              </div>
                              <!-- 数字 -->
                              <elPerInput
                                v-if="third.formType === 'elPerInput' && third.inputStatus !== 'disable' && type !== 'info'"
                                controls-position="right" size="small"
                                :max="third.maxValue ? scope.row[third.maxValue] || 0 : third.max" :min="third.min"
                                :disabled="third.inputStatus === 'disable'" :maxlength="Number(third.maxlength)"
                                :precision="Number(third.precision)" v-model="scope.row[third.prop]"
                                :placeholder="third.placeholder"
                                :clearable="third.clearable === undefined ? true : third.clearable"
                                @change="handleChange(third, scope.row, $event, scope.$index)">
                              </elPerInput>
                              <div class="ellipsis smallFont grey" v-else-if="third.formType === 'elPerInput'">
                                <tooltips :value="scope.row[third.prop]">
                                </tooltips>
                                <!-- {{scope.row[third.prop]}} -->
                              </div>
                              <!-- 数字 -->
                              <el-number
                                v-if="third.formType === 'number' && third.inputStatus !== 'disable' && type !== 'info'"
                                controls-position="right" size="small" :disabled="third.inputStatus === 'disable'"
                                :maxlength="Number(third.maxlength)" :precision="Number(third.precision)"
                                v-model="scope.row[third.prop]" :placeholder="third.placeholder"
                                :clearable="third.clearable === undefined ? true : third.clearable"
                                :max="third.maxValue ? scope.row[third.maxValue] || 0 : third.max" :min="third.min"
                                @change="handleChange(third, scope.row, $event, scope.$index)">
                              </el-number>
                              <div class="ellipsis smallFont grey" v-else-if="third.formType === 'number'">
                                {{scope.row[third.prop]}}
                              </div>
                              <el-number
                                v-if="third.formType === 'elNumber' && third.inputStatus !== 'disable' && type !== 'info'"
                                controls-position="right" size="small" :disabled="third.inputStatus === 'disable'"
                                :maxlength="Number(third.maxlength)" :precision="Number(third.precision)"
                                v-model="scope.row[third.prop]" :placeholder="third.placeholder"
                                :clearable="third.clearable === undefined ? true : third.clearable"
                                :max="third.maxValue ? scope.row[third.maxValue] || 0 : third.max" :min="third.min"
                                @change="handleChange(third, scope.row, $event, scope.$index)">
                              </el-number>
                              <div class="ellipsis smallFont grey" v-else-if="third.formType === 'elNumber'">
                                {{scope.row[third.prop]}}
                              </div>
                              <!-- 下拉选择框 -->
                              <el-select v-if="third.formType === 'select' && third.inputStatus !== 'disable'"
                                v-model="scope.row[third.prop]" :placeholder="third.placeholder" :size="third.size || 'small'"
                                :disabled="third.inputStatus === 'disable'" :filterable="third.filterable || true"
                                style="width:100%" :clearable="third.clearable === undefined ? true : third.clearable"
                                @change="handleChange(third, scope.row, $event, scope.$index)">
                                <el-option v-for="(third, i) in third.selectList" :key="i" :label="third[third.nameCode]"
                                  :value="third[third.valueCode]">
                                </el-option>
                              </el-select>
                              <div class="ellipsis smallFont grey" v-else-if="third.formType === 'select'">
                                {{setSelectData(scope.row[third.prop], third.selectList || [], third)}}</div>
                              <!-- 数据字典下拉选择框 -->
                              <el-select v-if="third.formType === 'dicSelect' && third.inputStatus !== 'disable'"
                                v-model="scope.row[third.prop]" :placeholder="third.placeholder" :size="third.size || 'small'"
                                :disabled="third.inputStatus === 'disable'" :filterable="third.filterable || true"
                                style="width:100%" :clearable="third.clearable === undefined ? true : third.clearable"
                                @change="handleChange(third, scope.row, $event, scope.$index)">
                                <el-option v-for="(ch, i) in third.selectList" :key="i"
                                  :label="third.isTranslate ? $t(ch.dataName) : ch.dataName"
                                  :value="third.isNumber ? Number(ch.dataCode) : ch.dataCode">
                                </el-option>
                              </el-select>
                              <div class="ellipsis smallFont grey" v-else-if="third.formType === 'dicSelect'">
                                {{setDicData(scope.row[third.prop], third.selectList || [], third)}}</div>
                              <!-- checkbox -->
                              <el-checkbox v-if="third.formType === 'checkbox'" :disabled="third.inputStatus === 'disable'"
                                v-model="scope.row[third.prop]">
                              </el-checkbox>
                              <!-- jsEditor -->
                              <el-input v-if="third.type==='jsEditor'" :disabled="third.inputStatus === 'disable'"
                                v-model="scope.row[third.prop]" placeholder="编辑JS" size="small" readonly>
                                <el-button style="margin-right: 5px;" slot="suffix" type="text" size="mini"
                                  @click="handleJsEditor(scope.row, third, scope.$index)">
                                  编辑
                                </el-button>
                              </el-input>
                              <!-- date time -->
                              <el-date-picker
                                v-if="(third.formType === 'date' || third.formType === 'time') && third.inputStatus !== 'disable'"
                                v-model="scope.row[third.prop]" :placeholder="third.placeholder" :size="third.size || 'small'"
                                prefix-icon="icon" :clearable="third.clearable === undefined ? true : third.clearable"
                                :disabled="third.inputStatus === 'disable'"
                                :picker-options="third.pickerOptions && pickerOptions"
                                :type="third.formType === 'date' ? 'date' : 'datetime'" value-format='yyyy-MM-dd HH:mm:ss'
                                style="width: 100%;">
                              </el-date-picker>
                              <div class="ellipsis smallFont grey"
                                v-else-if="(third.formType === 'date' || third.formType === 'time')">
                                {{scope.row[third.prop] | systemFilters(third)}}</div>
                              <!-- 附件 attachment -->
                              <!-- {{pageDisabled}} -->
                              <upload-file v-if="third.formType === 'attachment'"
                                :flowStatus="third.inputStatus !== 'disable' && !pageDisabled" :limit="third.limit"
                                :multiple="third.multiple" :isPhoto="third.isPhoto" :attachment.sync="scope.row[third.prop]">
                              </upload-file>
                              <el-progress
                                v-if="third.formType === 'elProgress'"
                                :percentage="scope.row[third.prop] || 0"
                                :text-inside="true"
                                :stroke-width="third.strokeWidth || 26">
                              </el-progress>
                              <div class="ellipsis smallFont grey" v-else-if="third.formType === 'companyAccount'">
                                {{scope.row[third.prop]}}
                              </div>
                              <!-- 按钮 -->
                              <div v-if="third.formType === 'operate'">
                                <template v-for="but in third.buts">
                                  <el-button :key="but.fn" v-if="but.show  || true"
                                    :disabled="but.disabled || pageDisabled || third.inputStatus === 'disable'"
                                    :class="but.class" @click="setFn(but, scope.row, scope.$index)" type="text" size="mini"
                                    v-fast-click>
                                    {{$t(but.name)}}
                                  </el-button>
                                </template>
                                <slot name='table-buts' :scope="scope.row" :pageDisabled="pageDisabled" :buts="third.buts"
                                  :item="third"></slot>
                              </div>
                            </el-form-item>
                          </template>
                        </el-table-column>
                      </template>
                    </template>

                    <template slot="header">
                      <div class="header-cell">
                        <tooltips :value="$t(child.label)" :isMust="ruleKeyList.indexOf(child.prop) > -1">
                        </tooltips>
                        <slot :name="`header-${child.prop}`"></slot>
                      </div>
                    </template>
                    <template slot-scope="scope">
                      <div class="ellipsis" v-if="child.formType === 'text'"
                        :style="(child.formType === 'text' && (child.filterName === 'setMoney' || child.filterName === 'number' || child.filterName==='elNumber')) ? 'text-align: right;' : ''">
                        <span v-if="child.fn" class="smallFont set"
                          @click='handleTable(child, scope.row, $event, scope.$index)'>{{scope.row[child.prop] | systemFilters(child)}}</span>
                        <span v-else class="smallFont grey">{{scope.row[child.prop] | systemFilters(child)}}</span>
                      </div>
                      <div class="ellipsis" v-else-if="child.formType === 'customOriginProp'"
                        :style="(child.filterName === 'setMoney' || child.filterName === 'number') ? 'text-align: right;' : ''">
                        <span v-if="child.fn" class="smallFont set"
                          @click='handleTable(child, scope.row, $event, scope.$index)'>{{scope.row[child.prop] | systemFilters(child)}}</span>
                        <span v-else class="smallFont grey">{{scope.row[child.prop] | systemFilters(child)}}</span>
                        <el-tooltip v-if="showChangeProp(scope.row, child)" class="item" effect="dark"
                          :content="`${$t('tips.primary')}：${customSetChangeContent(scope.row, child)}`"
                          placement="bottom">
                          <!-- 变 -->
                          <span class="customOriginProp"><i class="el-icon-view smallFont error"
                              style="right: 5px;"></i></span>
                        </el-tooltip>
                      </div>
                      <el-form-item size="small" v-else
                        :prop="subTable.treeProps? '' : `tableData.${scope.$index}.${child.prop}`"
                        :rules="rule[child.prop]">
                        <slot v-if="child.formType === 'slot'" :name="'edit-table-' + child.prop" :child="child"
                          :scope="scope.row" :rowIndex="scope.$index"></slot>
                        <el-input v-if="child.formType === 'input' && child.inputStatus !== 'disable' && type !== 'info'"
                          size="small" :disabled="child.inputStatus === 'disable'" :maxlength="Number(child.maxlength)"
                          @change="handleChange(child, scope.row, $event, scope.$index)"
                          @blur="handleBlur(child, scope.row, $event)"
                          :clearable="child.clearable === undefined ? true : child.clearable"
                          v-model="scope.row[child.prop]" :placeholder="child.placeholder">
                        </el-input>
                        <div class="ellipsis smallFont grey" v-else-if="child.formType === 'input'">
                          <tooltips :value="scope.row[child.prop]">
                          </tooltips>
                          <!-- {{scope.row[child.prop]}} -->
                        </div>
                        <!-- textarea -->
                        <el-input
                          v-if="child.formType === 'textarea' && child.inputStatus !== 'disable' && type !== 'info'"
                          type="textarea" v-model="scope.row[child.prop]" :placeholder="child.placeholder" size="small"
                          :disabled="child.inputStatus === 'disable'" :maxlength="Number(child.maxlength)"
                          :clearable="child.clearable === undefined ? true : child.clearable"
                          @blur="handleBlur(child, scope.row, $event)"
                          :autosize="{ minRows: child.minRows, maxRows: child.maxRows}">
                        </el-input>
                        <div class="ellipsis smallFont grey" v-else-if="child.formType === 'textarea'">
                          <tooltips :value="scope.row[child.prop]">
                          </tooltips>
                          <!-- {{scope.row[child.prop]}} -->
                        </div>
                        <!-- 数字 -->
                        <elPerInput
                          v-if="child.formType === 'elPerInput' && child.inputStatus !== 'disable' && type !== 'info'"
                          controls-position="right" size="small"
                          :max="child.maxValue ? scope.row[child.maxValue] || 0 : child.max" :min="child.min"
                          :disabled="child.inputStatus === 'disable'" :maxlength="Number(child.maxlength)"
                          :precision="Number(child.precision)" v-model="scope.row[child.prop]"
                          :placeholder="child.placeholder"
                          :clearable="child.clearable === undefined ? true : child.clearable"
                          @change="handleChange(child, scope.row, $event, scope.$index)">
                        </elPerInput>
                        <div class="ellipsis smallFont grey" v-else-if="child.formType === 'elPerInput'">
                          <tooltips :value="scope.row[child.prop]">
                          </tooltips>
                          <!-- {{scope.row[child.prop]}} -->
                        </div>
                        <!-- 数字 -->
                        <el-number
                          v-if="child.formType === 'number' && child.inputStatus !== 'disable' && type !== 'info'"
                          controls-position="right" size="small" :disabled="child.inputStatus === 'disable'"
                          :maxlength="Number(child.maxlength)" :precision="Number(child.precision)"
                          v-model="scope.row[child.prop]" :placeholder="child.placeholder"
                          :clearable="child.clearable === undefined ? true : child.clearable"
                          :max="child.maxValue ? scope.row[child.maxValue] || 0 : child.max" :min="child.min"
                          @change="handleChange(child, scope.row, $event, scope.$index)">
                        </el-number>
                        <div class="ellipsis smallFont grey" v-else-if="child.formType === 'number'">
                          {{scope.row[child.prop]}}
                        </div>
                        <el-number
                          v-if="child.formType === 'elNumber' && child.inputStatus !== 'disable' && type !== 'info'"
                          controls-position="right" size="small" :disabled="child.inputStatus === 'disable'"
                          :maxlength="Number(child.maxlength)" :precision="Number(child.precision)"
                          v-model="scope.row[child.prop]" :placeholder="child.placeholder"
                          :clearable="child.clearable === undefined ? true : child.clearable"
                          :max="child.maxValue ? scope.row[child.maxValue] || 0 : child.max" :min="child.min"
                          @change="handleChange(child, scope.row, $event, scope.$index)">
                        </el-number>
                        <div class="ellipsis smallFont grey" v-else-if="child.formType === 'elNumber'">
                          {{scope.row[child.prop]}}
                        </div>
                        <!-- 下拉选择框 -->
                        <el-select v-if="child.formType === 'select' && child.inputStatus !== 'disable'"
                          v-model="scope.row[child.prop]" :placeholder="child.placeholder" :size="child.size || 'small'"
                          :disabled="child.inputStatus === 'disable'" :filterable="child.filterable || true"
                          style="width:100%" :clearable="child.clearable === undefined ? true : child.clearable"
                          @change="handleChange(child, scope.row, $event, scope.$index)">
                          <el-option v-for="(child, i) in child.selectList" :key="i" :label="child[child.nameCode]"
                            :value="child[child.valueCode]">
                          </el-option>
                        </el-select>
                        <div class="ellipsis smallFont grey" v-else-if="child.formType === 'select'">
                          {{setSelectData(scope.row[child.prop], child.selectList || [], child)}}</div>
                        <!-- 数据字典下拉选择框 -->
                        <el-select v-if="child.formType === 'dicSelect' && child.inputStatus !== 'disable'"
                          v-model="scope.row[child.prop]" :placeholder="child.placeholder" :size="child.size || 'small'"
                          :disabled="child.inputStatus === 'disable'" :filterable="child.filterable || true"
                          style="width:100%" :clearable="child.clearable === undefined ? true : child.clearable"
                          @change="handleChange(child, scope.row, $event, scope.$index)">
                          <el-option v-for="(ch, i) in child.selectList" :key="i"
                            :label="child.isTranslate ? $t(ch.dataName) : ch.dataName"
                            :value="child.isNumber ? Number(ch.dataCode) : ch.dataCode">
                          </el-option>
                        </el-select>
                        <div class="ellipsis smallFont grey" v-else-if="child.formType === 'dicSelect'">
                          {{setDicData(scope.row[child.prop], child.selectList || [], child)}}</div>
                        <!-- checkbox -->
                        <el-checkbox v-if="child.formType === 'checkbox'" :disabled="child.inputStatus === 'disable'"
                          v-model="scope.row[child.prop]">
                        </el-checkbox>
                        <!-- jsEditor -->
                        <el-input v-if="child.type==='jsEditor'" :disabled="child.inputStatus === 'disable'"
                          v-model="scope.row[child.prop]" placeholder="编辑JS" size="small" readonly>
                          <el-button style="margin-right: 5px;" slot="suffix" type="text" size="mini"
                            @click="handleJsEditor(scope.row, child, scope.$index)">
                            编辑
                          </el-button>
                        </el-input>
                        <!-- date time -->
                        <el-date-picker
                          v-if="(child.formType === 'date' || child.formType === 'time') && child.inputStatus !== 'disable'"
                          v-model="scope.row[child.prop]" :placeholder="child.placeholder" :size="child.size || 'small'"
                          prefix-icon="icon" :clearable="child.clearable === undefined ? true : child.clearable"
                          :disabled="child.inputStatus === 'disable'"
                          :picker-options="child.pickerOptions && pickerOptions"
                          :type="child.formType === 'date' ? 'date' : 'datetime'" value-format='yyyy-MM-dd HH:mm:ss'
                          style="width: 100%;">
                        </el-date-picker>
                        <div class="ellipsis smallFont grey"
                          v-else-if="(child.formType === 'date' || child.formType === 'time')">
                          {{scope.row[child.prop] | systemFilters(child)}}</div>
                        <!-- 附件 attachment -->
                        <!-- {{pageDisabled}} -->
                        <upload-file v-if="child.formType === 'attachment'"
                          :flowStatus="child.inputStatus !== 'disable' && !pageDisabled" :limit="child.limit"
                          :multiple="child.multiple" :isPhoto="child.isPhoto" :attachment.sync="scope.row[child.prop]">
                        </upload-file>
                        <!-- 选择公司账户 -->
                        <el-select v-if="child.formType === 'companyAccount' && child.inputStatus !== 'disable'"
                          v-model.trim="scope.row[child.key]" :placeholder="child.placeholder"
                          :size="child.size || 'small'" :disabled="child.inputStatus === 'disable'" style="width:100%"
                          :clearable="child.clearable === undefined ? true : child.clearable"
                          @change="handleCompanyAccountChangeAll(child, scope.row, $event, scope.$index)">
                          <el-option v-for="item in companyAccountList" :key="item.name" :label="item.fullAccountName"
                            :value="item.cardNumber">
                            <span>{{ item.name }}</span>
                          </el-option>
                        </el-select>
                        <!-- 进度条 -->
                        <el-progress
                          v-if="child.formType === 'elProgress'"
                          :percentage="(scope.row[child.prop] || 0)"
                          :text-inside="true"
                          :stroke-width="child.strokeWidth || 26">
                        </el-progress>
                        <div class="ellipsis smallFont grey" v-else-if="child.formType === 'companyAccount'">
                          {{scope.row[child.prop]}}
                        </div>
                        <!-- 按钮 -->
                        <div v-if="child.formType === 'operate'">
                          <template v-for="but in child.buts">
                            <el-button :key="but.fn" v-if="but.show  || true"
                              :disabled="but.disabled || pageDisabled || child.inputStatus === 'disable'"
                              :class="but.class" @click="setFn(but, scope.row, scope.$index)" type="text" size="mini"
                              v-fast-click>
                              {{$t(but.name)}}
                            </el-button>
                          </template>
                          <slot name='table-buts' :scope="scope.row" :pageDisabled="pageDisabled" :buts="child.buts"
                            :item="child"></slot>
                        </div>
                      </el-form-item>
                    </template>
                  </el-table-column>
                </template>
              </template>
              <template slot="header">
                <div class="header-cell">
                  <tooltips :value="$t(item.label)" :isMust="ruleKeyList.indexOf(item.prop) > -1">
                  </tooltips>
                  <slot :name="`header-${item.prop}`"></slot>
                </div>
              </template>
              <template slot-scope="scope">
                <div class="ellipsis" v-if="item.formType === 'text'"
                  :style="(item.formType === 'text' && (item.filterName === 'setMoney' || item.filterName === 'number' || item.filterName==='elNumber')) ? 'text-align: right;' : ''">
                  <span v-if="item.fn" class="smallFont set"
                    @click='handleTable(item, scope.row, $event, scope.$index)'>{{scope.row[item.prop] | systemFilters(item)}}</span>
                  <span v-else class="smallFont grey">{{scope.row[item.prop] | systemFilters(item)}}</span>
                </div>
                <div class="ellipsis" v-else-if="item.formType === 'customOriginProp'"
                  :style="(item.filterName === 'setMoney' || item.filterName === 'number') ? 'text-align: right;' : ''">
                  <span v-if="item.fn" class="smallFont set"
                    @click='handleTable(item, scope.row, $event, scope.$index)'>{{scope.row[item.prop] | systemFilters(item)}}</span>
                  <span v-else class="smallFont grey">{{scope.row[item.prop] | systemFilters(item)}}</span>
                  <el-tooltip v-if="showChangeProp(scope.row, item)" class="item" effect="dark"
                    :content="`${$t('tips.primary')}：${customSetChangeContent(scope.row, item)}`" placement="bottom">
                    <!-- 变 -->
                    <span class="customOriginProp"><i class="el-icon-view smallFont error"
                        style="right: 5px;"></i></span>
                  </el-tooltip>
                </div>
                <el-form-item size="small" v-else
                  :title11="subTable.treeProps? '' : `tableData.${scope.$index}.${item.prop}`"
                  :prop="subTable.treeProps? '' : `tableData.${scope.$index}.${item.prop}`" :rules="rule[item.prop]">
                  <slot v-if="item.formType === 'slot'" :name="'edit-table-' + item.prop" :item="item" :scope="scope.row"
                    :rowIndex="scope.$index"></slot>
                  <el-input v-if="item.formType === 'input' && item.inputStatus !== 'disable' && type !== 'info'"
                    size="small" :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                    @change="handleChange(item, scope.row, $event, scope.$index)"
                    @blur="handleBlur(item, scope.row, $event)"
                    :clearable="item.clearable === undefined ? true : item.clearable" v-model="scope.row[item.prop]"
                    :placeholder="$t(item.placeholder)">
                  </el-input>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType === 'input'">
                    <tooltips :value="scope.row[item.prop]">
                    </tooltips>
                    <!-- {{scope.row[item.prop]}} -->
                  </div>
                  <!--  -->
                  <el-input v-if="item.formType === 'changeProp'" :class="changeStyle(scope.row, item)" size="small"
                    :disabled="changePropDisabled(scope.row, item)" :maxlength="Number(item.maxlength)"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    v-model.trim="scope.row[item.prop]" :placeholder="$t(item.placeholder)">
                    <el-tooltip v-if="showChangeProp(scope.row, item)" slot="suffix" class="item" effect="dark"
                      :content="`${$t('tips.primary')}：${setChangeContent(scope.row, item)}`" placement="top">
                      <!-- 变 -->
                      <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                    </el-tooltip>
                  </el-input>
                  <!-- 数字变更 -->
                  <el-number
                    v-if="item.formType === 'changePropNumber' && item.inputStatus !== 'disable' && type !== 'info'"
                    :class="changeStyle(scope.row, item)" :disabled="changePropDisabled(scope.row, item)"
                    controls-position="right" size="small" :maxlength="Number(item.maxlength)"
                    :precision="Number(item.precision)" v-model="scope.row[item.prop]"
                    :placeholder="$t(item.placeholder)"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    :max="item.maxValue ? scope.row[item.maxValue] || 0 : item.max" :min="item.min"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                    <el-tooltip v-if="showChangeProp(scope.row, item)" slot="suffix" class="item" effect="dark"
                      :content="`${$t('tips.primary')}：${setChangeContent(scope.row, item)}`" placement="top">
                      <!-- 变 -->
                      <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                    </el-tooltip>
                  </el-number>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType === 'changePropNumber'">
                    {{scope.row[item.prop]}}
                    <el-tooltip v-if="showChangeProp(scope.row, item)" class="item" effect="dark"
                      :content="`${$t('tips.primary')}：${setChangeContent(scope.row, item)}`" placement="top">
                      <!-- 变 -->
                      <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                    </el-tooltip>
                  </div>
                  <!-- 日期变更 date time -->
                  <div
                    v-if="(item.formType === 'changePropDate' || item.formType === 'changePropTime') && item.inputStatus !== 'disable'">
                    <el-date-picker :class="changeStyle(scope.row, item)"
                      :disabled="changePropDisabled(scope.row, item)" v-model="scope.row[item.prop]"
                      :placeholder="$t(item.placeholder)" :size="item.size || 'small'" prefix-icon="icon"
                      :clearable="item.clearable === undefined ? true : item.clearable"
                      :picker-options="item.pickerOptions && pickerOptions"
                      :type="item.formType === 'changePropDate' ? 'date' : 'datetime'"
                      value-format='yyyy-MM-dd HH:mm:ss' style="width: 100%;">
                    </el-date-picker>
                    <el-tooltip v-if="showChangeProp(scope.row, item)" class="item" effect="dark"
                      :content="`${$t('tips.primary')}：${setChangeContent(scope.row, item)}`" placement="top">
                      <!-- 变 -->
                      <span class="changeStatus"><i class="el-icon-view smallFont error" style="right: 5px;"></i></span>
                    </el-tooltip>
                  </div>
                  <div class="ellipsis smallFont grey"
                    v-else-if="(item.formType === 'changePropDate' || item.changePropTime==='time')">
                    {{scope.row[item.prop] | systemFilters(item)}}</div>
                  <!-- textarea -->
                  <el-input v-if="item.formType === 'textarea' && item.inputStatus !== 'disable' && type !== 'info'"
                    type="textarea" v-model="scope.row[item.prop]" :placeholder="$t(item.placeholder)" size="small"
                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    @blur="handleBlur(item, scope.row, $event)"
                    :autosize="{ minRows: item.minRows, maxRows: item.maxRows}">
                  </el-input>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType === 'textarea'">
                    <!-- <tooltips :value="scope.row[item.prop]">
                    </tooltips> -->
                    {{scope.row[item.prop]}}
                  </div>
                  <el-input v-if="item.formType === 'textareaInfo'" type="textarea" v-model="scope.row[item.prop]"
                    :placeholder="$t(item.placeholder)" size="small" :disabled="item.inputStatus === 'disable'"
                    :maxlength="Number(item.maxlength)"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    @blur="handleBlur(item, scope.row, $event)"
                    :autosize="{ minRows: item.minRows, maxRows: item.maxRows}">
                  </el-input>
                  <!-- 数字 -->
                  <elPerInput v-if="item.formType === 'elPerInput' && item.inputStatus !== 'disable' && type !== 'info'"
                    controls-position="right" size="small"
                    :max="item.maxValue ? scope.row[item.maxValue] || 0 : item.max" :min="item.min"
                    :disabled="item.inputStatus === 'disable'" :maxlength="Number(item.maxlength)"
                    :precision="Number(item.precision)" v-model.trim="scope.row[item.prop]"
                    :placeholder="$t(item.placeholder)"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                  </elPerInput>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType === 'elPerInput'">
                    <tooltips :value="scope.row[item.prop]">
                    </tooltips>
                    <!-- {{scope.row[item.prop]}} -->
                  </div>
                  <!-- 数字 -->
                  <el-number v-if="item.formType === 'number' && item.inputStatus !== 'disable' && type !== 'info'"
                    controls-position="right" size="small" :disabled="item.inputStatus === 'disable'"
                    :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                    v-model="scope.row[item.prop]" :placeholder="$t(item.placeholder)"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    :max="item.maxValue ? scope.row[item.maxValue] || 0 : item.max" :min="item.min"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                  </el-number>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType === 'number'">
                    {{scope.row[item.prop]}}
                  </div>
                  <el-number v-if="item.formType === 'elNumber' && item.inputStatus !== 'disable' && type !== 'info'"
                    controls-position="right" size="small" :disabled="item.inputStatus === 'disable'"
                    :maxlength="Number(item.maxlength)" :precision="Number(item.precision)"
                    v-model="scope.row[item.prop]" :placeholder="$t(item.placeholder)"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    :max="item.maxValue ? scope.row[item.maxValue] || 0 : item.max" :min="item.min"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                  </el-number>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType === 'elNumber'">
                    {{scope.row[item.prop]}}
                  </div>
                  <!-- 下拉选择框 -->
                  <el-select v-if="item.formType === 'select' && item.inputStatus !== 'disable'"
                    v-model.trim="scope.row[item.prop]" :placeholder="$t(item.placeholder)" :size="item.size || 'small'"
                    :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                    <el-option v-for="(child, i) in item.selectList" :key="i" :label="child[item.nameCode]"
                      :value="child[item.valueCode]">
                    </el-option>
                  </el-select>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType === 'select'">
                    {{setDicData(scope.row[item.prop], item.selectList || [], item)}}</div>
                  <!-- 数据字典下拉选择框 -->
                  <el-select v-if="item.formType === 'dicSelect' && item.inputStatus !== 'disable'"
                    v-model.trim="scope.row[item.prop]" :placeholder="$t(item.placeholder)" :size="item.size || 'small'"
                    :disabled="item.inputStatus === 'disable'" :filterable="item.filterable || true" style="width:100%"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    @change="handleChange(item, scope.row, $event, scope.$index)">
                    <el-option v-for="(child, i) in item.selectList" :key="i"
                      :label="item.isTranslate ? $t(child.dataName) : child.dataName"
                      :value="item.isNumber ? Number(child.dataCode) : child.dataCode">
                    </el-option>
                  </el-select>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType === 'dicSelect'">
                    {{setDicData(scope.row[item.prop], item.selectList || [], item)}}</div>
                  <!-- checkbox -->
                  <el-checkbox v-if="item.formType === 'checkbox'" :disabled="item.inputStatus === 'disable'"
                    v-model="scope.row[item.prop]">
                  </el-checkbox>
                  <!-- jsEditor -->
                  <el-input v-if="item.type==='jsEditor'" :disabled="item.inputStatus === 'disable'"
                    v-model.trim="scope.row[item.prop]" placeholder="编辑JS" size="small" readonly>
                    <el-button style="margin-right: 5px;" slot="suffix" type="text" size="mini"
                      @click="handleJsEditor(scope.row, item, scope.$index)">
                      编辑
                    </el-button>
                  </el-input>
                  <!-- date time -->
                  <el-date-picker
                    v-if="(item.formType === 'date' || item.formType === 'time') && item.inputStatus !== 'disable'"
                    v-model="scope.row[item.prop]" :placeholder="$t(item.placeholder)" :size="item.size || 'small'"
                    prefix-icon="icon" :clearable="item.clearable === undefined ? true : item.clearable"
                    :disabled="item.inputStatus === 'disable'" :picker-options="item.pickerOptions && pickerOptions"
                    :type="item.formType === 'date' ? 'date' : 'datetime'" value-format='yyyy-MM-dd HH:mm:ss'
                    style="width: 100%;">
                  </el-date-picker>
                  <div class="ellipsis smallFont grey" v-else-if="(item.formType === 'date' || item.formType === 'time')">
                    {{scope.row[item.prop] | systemFilters(item)}}</div>
                  <!-- 附件 attachment -->
                  <!-- {{pageDisabled}} -->
                  <upload-file v-if="item.formType === 'attachment'"
                    :flowStatus="item.inputStatus !== 'disable' && !pageDisabled" :limit="item.limit"
                    :multiple="item.multiple" :isPhoto="item.isPhoto" :attachment.sync="scope.row[item.prop]">
                  </upload-file>
                  <!-- 进度条 -->
                  <el-progress
                    v-if="item.formType === 'elProgress'"
                    :percentage="(scope.row[item.prop] || 0)"
                    :text-inside="true"
                    :stroke-width="item.strokeWidth || 26">
                  </el-progress>
                  <!-- 选择公司账户 -->
                  <el-select v-if="item.formType === 'companyAccount' && item.inputStatus !== 'disable'"
                    v-model.trim="scope.row[item.key]" :placeholder="$t(item.placeholder)" :size="item.size || 'small'"
                    :disabled="item.inputStatus === 'disable'" style="width:100%"
                    :clearable="item.clearable === undefined ? true : item.clearable"
                    @change="handleCompanyAccountChangeAll(item, scope.row, $event, scope.$index)">
                    <el-option v-for="item in companyAccountList" :key="item.name" :label="item.fullAccountName"
                      :value="item.cardNumber">
                      <span>{{ item.name }}</span>
                    </el-option>
                  </el-select>
                  <div class="ellipsis smallFont grey" v-else-if="item.formType === 'companyAccount'">
                    {{scope.row[item.prop]}}
                  </div>
                  <!-- 按钮 -->
                  <div v-if="item.formType === 'operate'">
                    <template v-for="but in item.buts">
                      <el-button :key="but.fn" v-if="but.show  || true"
                        :disabled="but.disabled || pageDisabled || item.inputStatus === 'disable'" :class="but.class"
                        @click="setFn(but, scope.row, scope.$index)" type="text" size="mini" v-fast-click>
                        {{$t(but.name)}}
                      </el-button>
                    </template>
                    <slot name='table-buts' :scope="scope.row" :pageDisabled="pageDisabled" :buts="item.buts"
                      :item="item" :rowIndex="scope.$index"></slot>
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
          </template>
          <slot name="table-column" :rule="rule" :pageDisabled="pageDisabled"></slot>
        </el-table>
      </el-form>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';// 拖拽排序文件

export default {
  data () {
    return {
      deleteList: [],
      jsEditorShow: false,
      jsCode: '',
      jsRow: '',
      jsRowCode: '',
      selectedUsers: [],
      tableChickList: [],
      toConfigure: {
        size: 'small', // 表格的尺寸
        border: false, // 是否显示边框
        stripe: false, // 是否显示斑马纹
        highlightCurrentRow: true, // 当前行高亮
        choice: 'checkbox', // radio => 单选  checkbox => 多选
        spanMethod: '', // 表格合并函数,
        getRowId: 'columnSource' // row-key
      },
      pageDisabled: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now();
        }
      },
      btnParameter: {},
      dialogShow: false,
      fromData: [],
      slaveColumns: [],
      childrenSlaveColumns: [],
      // 已选明细
      tableSelectList: [],
      localConfig: {
        summaryMethod: null,
        showSummary: false,
        rowKey: 'id'
      },
      companyAccountList: [],
      sortable: null,
      requiredRules: [],
      loading: false,
      summariesList: [],
      expandRowKeys: []
      // type: ''
    };
  },
  computed: {
    rule () {
      for (const i in this.tableConfig.rules) {
        const slaveColumn = this.tableConfig.slaveColumns.find(v => v.prop === i);
        const item = this.tableConfig.rules[i];
        item.forEach(v => {
          if (v.message) {
            v.message = this.$t(v.message);
          } else {
            if (slaveColumn) {
              v.message = `${this.$t(slaveColumn.label)} ${this.$t('tips.notNull')}`;
            } else {
              v.message = `${this.$t('tips.notNull')}`;
            }
          }
        });
      }
      return { ...this.tableConfig.rules, ...this.customRules, ...this.requiredRules };
    },
    childrenRule () {
      for (const i in this.tableConfig.childrenRule) {
        const slaveColumn = this.tableConfig.childrenSlaveColumns.find(v => v.prop === i);
        const item = this.tableConfig.childrenRule[i];
        item.forEach(v => {
          if (v.message) {
            v.message = this.$t(v.message);
          } else {
            if (slaveColumn) {
              v.message = `${this.$t(slaveColumn.label)} ${this.$t('tips.notNull')}`;
            } else {
              v.message = `${this.$t('tips.notNull')}`;
            }
          }
        });
      }
      return {};
      // return { ...this.tableConfig.childrenRule, ...this.childrenCustomRules };
    },
    ruleKeyList () {
      const list = [];
      Object.keys({ ...this.tableConfig.rules, ...this.customRules, ...this.requiredRules }).forEach(key => {
        if (this.rule[key] && this.rule[key].length && this.rule[key][0].required) {
          list.push(key);
        }
      });
      return list;
    },
    childrenRuleKeyList () {
      const list = [];
      // Object.keys({ ...this.tableConfig.childrenRule, ...this.childrenCustomRules }).forEach(key => {
      //   list.push(key);
      // });
      return list;
    }
  },

  components: {
    uploadFile (resolve) {
      require(['components/basicComponents/global/upload/uploadFile.vue'], resolve);
    },
    elPerInput (resolve) {
      require(['components/basicComponents/global/elPerInput/elPerInput.vue'], resolve);
    }
  },
  props: {
    tableConfig: {
      type: Object,
      default: () => {
        const params = {
          // 表头配置
          slaveColumns: [],
          // 子表
          childrenSlaveColumns: [],
          // 校验
          rules: {},
          // 初始化行数据
          tableDataRow: {},
          // 子表行数据
          childrenTableDataRow: {}
        };
        return params;
      }
    },
    tableData: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'add'
    },
    isSelection: {
      type: Boolean,
      default: false
    },
    subTable: {
      type: Object,
      default: () => {
        const params = {
          // 是否默认展开行
          defaultExpandAll: true,
          // 默认展开行
          expandRowKeys: []
        };
        return params;
      }
    },
    customRules: {
      type: Object,
      default: () => { }
    },
    height: {
      type: Number,
      default: 430
    },
    getRowClassName: {
      type: Function
    }
  },
  watch: {
    tableConfig: {
      handler () {
        this.slaveColumns = this.tableConfig.slaveColumns;
        this.childrenSlaveColumns = this.tableConfig.childrenSlaveColumns;
        if (!this.subTable.treeProps) {
          this.setSummariesList();
        } else {
          if (this.subTable.tableData && this.subTable.tableData.length > 0) {
            this.subTable.rowKey = this.subTable.rowKey || 'id';
            this.expandRowKeys = this.subTable.tableData.map(v => v[this.subTable.rowKey]);
          }
        }
        this.getCompanyAccountList();
        this.getPageControlList();
      },
      deep: true
    }
  },
  created () {
    this.params = this.$route.params;
    if (!this.subTable.treeProps) {
      this.localConfig.summaryMethod = this.getSummaries;
    } else {
      if (this.subTable.tableData && this.subTable.tableData.length > 0) {
        this.subTable.rowKey = this.subTable.rowKey || 'id';
        this.expandRowKeys = this.subTable.tableData.map(v => v[this.subTable.rowKey]);
      }
    }
  },
  mounted () {
    if (this.tableConfig) {
      this.slaveColumns = this.tableConfig.slaveColumns;
      this.childrenSlaveColumns = this.tableConfig.childrenSlaveColumns;
      if (!this.subTable.treeProps) {
        this.setSummariesList();
      }
      this.getCompanyAccountList();
      this.getPageControlList();
    }
    this.pageDisabled = this.type === 'info';
    // 设置是否可以拖拽排序
    this.subTable.isSortTable && this.handleSortTable();
  },
  methods: {
    // 查询租户有效的页面控制设置记录
    getPageControlList () {
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
          const checkFormList = res.results.filter(v => v.formDetailCode); // 获取子表需要校验的字段
          for (const item of checkFormList) {
            if (item.controlTypeCode === '01' && item.whetherOrNot === 1) {
              // 必填
              this.$set(this.requiredRules, item.columnCode, { required: true, message: `${this.$t(item.columnLanguage)}${this.$t('tips.required')}!` });
            }
            if (item.controlTypeCode === '03') {
              // 编辑
              const detailsKey = this.slaveColumns.findIndex(v => v.prop === item.columnCode);
              if (detailsKey >= 0) {
                this.$set(this.slaveColumns[detailsKey], 'inputStatus', item.whetherOrNot === 1 ? 'edit' : 'disable');
                // 是否为系统控制字段
                this.$set(this.slaveColumns[detailsKey], 'isSystemControlEdit', item.whetherOrNot === 1);
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
    // 拖拽排序
    handleSortTable () {
      this.$nextTick(() => {
        this.setSort(this.subTable.subTableName);
      });
    },
    setSort (className) {
      const el = document.querySelectorAll && document.querySelectorAll(`.${className}>.el-table__body-wrapper > table> tbody`)[0];
      if (!el) return;
      let scrollToptemp = 0;
      const multipleTable = this.$refs.multipleTable;
      this.sortable = Sortable.create(el, {
        animation: 100,
        handle: '.dragAllow',
        setData (dataTransfer) {
          scrollToptemp = multipleTable ? multipleTable.bodyWrapper.scrollTop : 0;
        },
        onEnd: evt => {
          const data = this.$clone(this.subTable.tableData);
          const targetRow = data.splice(evt.oldIndex, 1)[0];
          data.splice(evt.newIndex, 0, targetRow);
          this.resetSort(data, scrollToptemp, multipleTable);
        }
      });
    },
    //     *重新排序*
    resetSort (sortArr, scrollToptemp, el) {
      const newData = [];
      sortArr.forEach((item, index) => {
        newData[index] = {
          ...item,
          sorts: index
        };
      });
      this.subTable.tableData = [];
      this.$nextTick(() => {
        this.subTable.tableData = newData;
        this.$nextTick(() => {
          (el && el.bodyWrapper) && (el.bodyWrapper.scrollTop = scrollToptemp);
        });
      });
    },
    test (props) { },
    // 获取公司账户信息
    getCompanyAccountList () {
      const index = this.slaveColumns.findIndex(v => v.formType === 'companyAccount');
      if (index >= 0) {
        this.$store.dispatch('publicApi/getCompanyAccountList').then(res => {
          for (const item of res.results) {
            this.$set(item, 'name', `${item.fullAccountName}-${item.cardNumber}-${item.openAccountBank}`);
          }
          this.companyAccountList = res.results || [];
        });
      }
    },
    btnFn (fnName) {
      this[fnName]();
    },
    setFn (btnParameter, row, index) {
      const params = {
        btnParameter,
        row,
        index
      };
      this.$emit('editTableEvent', { eventName: 'fnRowName', params });
      this.$emit('fnRowName', [btnParameter, row, index]);
    },
    // 批量删除选中
    selectionChange (val) {
      this.deleteList = val;
      this.$emit('update:delete', this.deleteList);
    },
    // 失去焦点
    handleBlur (item, row, event) {
      const newValue = event.target.value.replace(/^\s+|\s+$/g, '');
      this.$set(row, item.prop, newValue);
    },
    // 无验证子表数据返回
    getTableData () {
      const tableData = JSON.parse(JSON.stringify(this.subTable.tableData));
      if (tableData.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    // 选中
    handleChange (item, row, event, rowIndex) {
      const params = {
        item,
        row,
        event,
        subTable: this.subTable,
        rowIndex
      };
      if (item.isRelation) { // 下拉选择赋值
        this.$emit('editTableEvent', { eventName: 'tableSelect', params });
      }
      if (item.operateData) {
        this.$emit('editTableEvent', { eventName: 'operateDataEvent', params });
        this.$emit('operateDataEvent', { item, row, event, tableData: this.subTable.tableData, rowIndex });
      }
    },
    // 选中公司账户
    handleCompanyAccountChangeAll (item, row, event, rowIndex) {
      const data = this.companyAccountList.find(v => v.cardNumber === event);
      if (item.relationList && item.relationList.length) {
        for (const ol of item.relationList) {
          this.$set(row, ol.receive, data ? data[ol.value] : '');
        }
      }
    },
    // 表格内文本操作时间
    handleTable (item, row, event, rowIndex) {
      const params = {
        item,
        row,
        event,
        subTable: this.subTable,
        rowIndex
      };
      this.$emit('editTableEvent', { eventName: 'handleTable', params });
    },
    // 数据字典
    setDicData (value, selectList, item) {
      const index = selectList && selectList.findIndex(v => String(v.dataCode) === String(value));
      if (index < 0) return '';
      return item.isTranslate ? this.$t(selectList[index].dataName) : selectList[index].dataName;
    },
    setSelectData (value, selectList, item) {
      const index = selectList && selectList.findIndex(v => String(v[item.valueCode]) === String(value));
      if (index < 0) return '';
      return item.isTranslate ? this.$t(selectList[index][item.nameCode]) : selectList[index][item.nameCode];
    },
    // 清空
    clearSelectionTable () {
      this.$refs.multipleTable.clearSelection();
    },
    // 验证子表数据
    validateTableData (callback) {
      this.$refs.multipleTable.clearSelection();
      if (this.subTable.tableData.length === 0) {
        return [];
      }
      let data = false;
      this.$refs.editTable.validate(valid => {
        if (valid) {
          const tableConfig = JSON.parse(JSON.stringify(this.slaveColumns));
          const tableData = JSON.parse(JSON.stringify(this.subTable.tableData));
          for (const i in tableConfig) {
            const item = tableConfig[i];
            for (const i in tableData) {
              const row = tableData[i];
              // checkbox
              if (item.type === 'checkbox') {
                row[item.prop] = row[item.prop] ? 1 : 0;
              }
              // 唯一
              if (item.isRepeat) {
                const repeatList = this.arrTest(this.subTable.tableData, item.prop);
                if (repeatList.length > 0) {
                  this.$message.error(`${item.label} 存在重复！`);
                  this.toggleSelection(repeatList, 'multipleTable');
                  return false;
                }
              }
              row.createTime = this.$utils.commonUtil.formatTime(new Date());
            }
          }
          data = JSON.parse(JSON.stringify(tableData));
          callback && callback(data);
        } else {
          data = false;
        }
      });
      return data;
    },
    // 判断是否重复
    arrTest (arr, key) {
      const list = [];
      const repeatList = [];
      for (const i in arr) {
        const item = arr[i];
        if (list.some(v => v[key] === item[key])) {
          repeatList.push(item);
        } else {
          list.push(item);
        }
      }
      return repeatList;
    },
    // 勾选
    toggleSelection (rows, formName) {
      if (rows) {
        rows.forEach(row => {
          this.$refs[formName].toggleRowSelection(row, true);
        });
      } else {
        this.$refs[formName].clearSelection();
      }
    },
    // 状态处理
    changePropDisabled (row, item) {
      if (this.$route.name === 'processApprovalPage') {
        return item.inputStatus === 'disable';
      } else {
        return item.isSystemControlEdit ? false : item.addPropId ? !!row[item.addPropId] : item.inputStatus === 'disable';
      }
    },
    // 字段变化后
    changeStyle (row, item) {
      const relationKeyIds = item.relationKeyIds || [];
      if (!relationKeyIds.length) return;
      if (relationKeyIds.length > 1) {
        if ((row[relationKeyIds[0]] || row[relationKeyIds[1]]) && row[item.prop] !== row[item.originProp]) {
          return 'afterStatus';
        }
      }
      if (relationKeyIds.length === 1) {
        if (row[relationKeyIds[0]] && row[item.prop] !== row[item.originProp]) {
          return 'afterStatus';
        }
      }
    },
    showChangeProp (row, item) {
      const relationKeyIds = item.relationKeyIds || [];
      if (!relationKeyIds.length) return false;
      if (relationKeyIds.length > 1) {
        if ((row[relationKeyIds[0]] || row[relationKeyIds[1]]) && row[item.prop] !== row[item.originProp]) {
          return true;
        }
      }
      if (relationKeyIds.length === 1) {
        if (row[relationKeyIds[0]] && row[item.prop] !== row[item.originProp]) {
          return true;
        }
      }
    },
    setChangeContent (row, item) {
      if (item.formType === 'changePropDate') {
        return this.$utils.commonUtil.formatDate(row[item.originProp]);
      }
      if (item.formType === 'changePropTime') {
        return this.$utils.commonUtil.formatTime(row[item.originProp]);
      }
      return row[item.originProp] ? row[item.originProp] : '';
    },
    // 变更前数据
    customSetChangeContent (row, item) {
      return row[item.originProp] ? item.filterName === 'setMoney' ? this.$utils.commonUtil.toQfw(row[item.originProp], item.precision) : row[item.originProp] : '';
    },
    // 设置合计的字段
    setSummariesList () {
      this.summariesList = [];
      for (const item of this.slaveColumns) {
        if ((item.filterName === 'setMoney' || item.filterName === 'number' || item.formType === 'number') && !item.notTotal) {
          const index = this.summariesList.findIndex(v => v === item.prop);
          if (index < 0) {
            this.summariesList.push(item.prop);
          }
        }
      }
      this.localConfig.showSummary = this.summariesList.length > 0;
    },
    // 合计
    getSummaries (param) {
      const { columns, data } = param;
      let tableList = [];
      const sumList = ['Quantity', 'quantity', 'amount', 'Amount'];
      for (const item of this.slaveColumns) {
        for (const val of sumList) {
          const index = item.prop ? item.prop.indexOf(val) : -1;
          const hasIsShowSummary = item.isShowSummary !== undefined && item.isShowSummary;
          if ((index >= 0 || hasIsShowSummary) && !item.notTotal) {
            tableList.push(item.prop);
          }
        }
      }
      tableList = tableList.concat(this.tableConfig.customMergeList || []);
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.$t('fConfig.total');
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (tableList.indexOf(column.property) >= 0) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr || 0);
            if (!isNaN(value)) {
              return (prev || 0) + (curr || 0);
            } else {
              return (prev || 0);
            }
          }, 0);
          if (tableList.indexOf(column.property) >= 0) {
            let precision = 4;
            if (column.property.indexOf('amount') >= 0 || column.property.indexOf('Amount') >= 0) {
              precision = 2;
            }
            sums[index] = this.$utils.commonUtil.toQfw(Number(sums[index].toFixed(precision)), precision);
          }
        } else {
          sums[index] = '';
        }
      });
      this.$nextTick(() => {
        // console.log(this.$refs.multipleTable, 'this.$refs.editTable');
        this.$refs.multipleTable && this.$refs.multipleTable.doLayout();
      });
      return sums;
    }
  }
};

</script>
<style lang="scss" scoped>
/deep/.el-table__footer-wrapper {
  .has-gutter {
    .cell {
      display: inline-block;
    }
  }
}
.afterStatus {
  /deep/ .el-input__inner {
    color: #ff4a4a !important;
  }
}
.changeStatus {
  color: #ff4a4a;
  position: absolute;
  right: -14px;
}
.customOriginProp {
  color: #ff4a4a;
  position: absolute;
  right: 1px;
}
.header-cell{
  display: flex;
}
.editTable {
  flex: 1;
  margin-bottom: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /deep/ .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: 1px solid #ebeef5 !important;
  }
  /deep/ .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5 !important;
  }
  /deep/ .el-table--border td,
  .el-table--border th,
  .el-table__body-wrapper
    .el-table--border.is-scrolling-left
    ~ .el-table__fixed {
    border-right: 1px solid #ebeef5 !important;
  }
  /deep/ .el-table thead th {
    border-right: 1px solid #ebeef5 !important;
  }
  .detailedTable {
    flex: 1;
  }
  /deep/ .el-input--small .el-input__inner {
    line-height: 34px !important;
    height: 34px !important;
    font-size: 14px;
  }
  /deep/ .cell {
    display: flex;
    padding-right: 17px !important;
    padding-left: 17px !important;
  }
  /deep/ .el-table__expand-icon {
    position: relative;
    top: 10px;
  }
  /deep/ .el-form-item {
    width: 100%;
  }
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

.databaseFields {
  padding: 10px;

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
/deep/.el-progress-bar__innerText {
    color: #222607!important;
    line-height: 25px !important;
    margin-bottom: 9px;
}
  /deep/.el-progress-bar__outer {
    border-radius: 5px!important;
}
/deep/.el-progress-bar__inner {
    border-radius: 5px!important;
}
</style>
