/*
 * @Author: your name
 * @Date: 2021-04-13 11:40:27
 * @LastEditTime: 2021-04-13 16:01:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\demWeek\tempMixins\tempEditPage.js
 */
import { closeRoute } from 'mixins/index';
import Auth from 'util/auth';

export const editPage = {
    mixins: [closeRoute],
    data() {
        return {
            pageConfig: {},
            type: 'add',
            id: 0,
            dialogVisible: false,
            deleteList: {},
            pageDisabled: false,
            loading: false,
            pageConfigLoading: true,
            isProcess: false,
            translateName: '',
            pageData: '',
            subTableData: [],
            oldProjectForm: {}
        };
    },
    activated() {
        if (this.page) {
            this.page.init();
            this.pageConfig = this.page.PageConfig;
        }
    },
    methods: {
        // 校验
        repeatCheckData(rule, value, callback, params) {
            if (!value) {
                // 请输入
                callback(new Error(`${this.$t('tips.pleaseEnter')}${this.$t(params.codeName)}`));
            } else {
                this.$store.dispatch(params.url, { [params.keyName]: value, [params.keyId]: this.id || '' }).then(res => {
                    if (res.results) {
                        // 重复，请重新输入
                        callback(new Error(`${this.$t(this.$t(params.codeName))}${this.$t('tips.repeat')}`));
                    } else {
                        callback();
                    }
                });
            }
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
            this.$store.dispatch(infoUrl.url, { [infoUrl.params]: this.id }).then(res => {
                const results = this.$clone(res.results);
                if (!results) {
                    this.pageConfig = this.page.PageConfig;
                    this.pageConfig.projectForm = this.projectForm; // 挂载form 对象
                    this.pageConfigLoading = true;
                    this.loading = false;
                    return;
                }
                if (results.continent) {
                    results.areas = [];
                    const keysList = ['continent', 'country', 'province', 'city', 'area'];
                    for (const key of keysList) {
                        if (results[key] && results[key].indexOf('-')) {
                            const id = results[key].split('-')[1];
                            results.areas.push(Number(id));
                        }
                    }
                }
                this.pageConfig = this.page.PageConfig;
                this.$set(this.pageConfig, 'projectForm', results);
                this.oldProjectForm = this.$clone(results);
                if (this.pageConfig.subTableMatch) {
                    for (const item of this.pageConfig.subTableMatch) {
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
        // 设置导入明细按钮状态
        setSysHandleExportDetailStatus(tableName) {
            if (this.type !== 'info') return;
            const subTableButton = this.pageConfig.subTableConfig[tableName].subTableButton;
            const index = subTableButton.findIndex(v => v.code === 'sysHandleExportDetail');
            if (index >= 0) {
                this.$set(this.pageConfig.subTableConfig[tableName].subTableButton[index], 'disabled', false);
            }
            this.$forceUpdate();
        },
        // 保存数据
        handleSaveData(data, isProcess = false, callback) {
            if (!isProcess) {
                this.saveData(data, isProcess, callback);
                return;
            }
            this.pageData = this.$clone(data);
            this.handleProcess();
        },
        // 保存数据
        saveData(data, isProcess, callback) {
            const saveUrl = this.page.PageConfig.processParmas.saveUrl;
            this.$store.dispatch(saveUrl.url, data).then(res => {
                const status = this.type === 'add' ? this.$t('button.add') : this.$t('button.edit');
                if (res.status === 0) {
                    if (!isProcess) {
                        this.$message.success(`${status}${this.$t('tips.success')}!`);
                        this.setRoute();
                        return;
                    }
                    callback && callback();
                } else {
                    this.$message.error(`${status}${this.$t('tips.fail')}!${this.$t(`exception.${res.errorCode}`)}`);
                }
            });
        },
        handleProcess() {
            this.$emit('processSubmit', true);
        },
        // 页面状态
        pageStatus() {
            if (this.$route.name === 'processApprovalPage') {
                if (this.nodeCode !== 'BEGIN') {
                    if (this.multitonColumns && this.multitonColumns.length) {
                        for (const item of this.multitonColumns[0].multitonColumns) {
                            if (item.columnCode === this.currentResources.prop) {
                                this.typeResources = item.columnStatusCollectCode !== 'DISABLE' ? 'add' : 'info';
                            }
                        }
                    }
                }
            } else {
                this.typeResources = this.$base64.decode(this.$route.params.type);
            }
            if (this.typeResources === 'info') {
                for (const i in this.page.PageConfig.subTableConfig) {
                    const item = this.page.PageConfig.subTableConfig[i];
                    for (const but of item.subTableButton) {
                        but.disabled === undefined ? (but.disabled = false) : (but.disabled = true);
                    }
                }
            }
        },
        editEvent(eventName) {
            if (eventName === 'close') {
                this.setRoute();
            }
            if (eventName === 'save') {
                this.handleSave();
            }
        },
        // ------------------------------------- 主表 ----------------------------------------------------
        // 获取编辑表单的项目
        editFormEvent({ eventName, params }) {
            if (eventName === 'clearProjcet') {
                this.handleClearProject(params);
            }
            if (eventName === 'projcet') {
                this.handleSelectProject(params);
            }
            if (eventName === 'clearPartyA') {
                this.handleClearPartyA(params);
            }
            if (eventName === 'partyA') {
                this.handleSelectPartyA(params);
            }
            if (eventName === 'clearPartyB') {
                this.handleClearPartyB(params);
            }
            if (eventName === 'partyB') {
                this.handleSelectPartyB(params);
            }
            // 合同
            if (eventName === 'clearContractIncome') {
                this.handleClearContractIncome(params);
            }
            if (eventName === 'contractIncome') {
                this.handleSelectContractIncome(params);
            }
            // 分包计划
            if (eventName === 'clearSubcontract') {
                this.handleClearSubcontract(params);
            }
            if (eventName === 'subcontract') {
                this.handleSelectSubcontract(params);
            }
            if (eventName === 'relationTable') {
                this.handleOtherSelect(params);
            }
            if (eventName === 'clearProjectChild') {
                this.handleClearProjectChild(params);
            }
            if (eventName === 'projectChild') {
                this.handleSelectProjectChild(params);
            }
            if (eventName === 'clearUsePlace') {
                this.handleClearUsePlace(params);
            }
            if (eventName === 'usePlace') {
                this.handleSelectUsePlace(params);
            }
            if (eventName === 'operateFun') {
                this[params.operateFun] && this[params.operateFun](params);
            }
            if (eventName === 'clearUser') { // 清除用户
                this.handleClearUser(params);
            }
            if (eventName === 'user') { // 获取用户
                this.handleSelectUser(params);
            }
            // 所属公司
            if (eventName === 'clearOrg') { // 清除用户
                this.handleClearOrg(params);
            }
            if (eventName === 'org') { // 获取用户
                this.handleSelectOrg(params);
            }
            if (eventName === 'identify') { // 自动识别
                this.handleIdentify(params);
            }
        },
        // 自动识别附件
        handleIdentify(params) {

        },
        // ----------------------------- 项目 -------------------------------
        // 清除项目
        handleClearProject(params) {
            if (params.item && params.item.formType === 'multipleProject') {
                const projectList = this.pageConfig.projectForm[params.item.prop];
                projectList.splice(projectList.indexOf(params.tag), 1);
                return;
            }
            this.handleSelectProject({ selectList: [], paramsConfig: params });
        },
        // 选择项目
        handleSelectProject(params) {
            if (params.paramsConfig.check) {
                this.handleCheckProject(params);
                return;
            }
            // 多选项目
            if (params.paramsConfig.formType === 'multipleProject') {
                this.$set(this.pageConfig.projectForm, params.paramsConfig.prop, this.$clone(params.selectList));
                return;
            }
            this.handleSelect(params, 'projectName');
        },
        // ----------------------------- 甲方单位 -------------------------------
        // 清除甲方单位
        handleClearPartyA(params) {
            this.handleSelectPartyA({ selectList: [], paramsConfig: params });
        },
        // 选择甲方单位
        handleSelectPartyA(params) {
            this.handleSelect(params, 'partyAName');
        },
        // ----------------------------- 乙方单位 -------------------------------
        // 清除甲方单位
        handleClearPartyB(params) {
            this.handleSelectPartyB({ selectList: [], paramsConfig: params });
        },
        // 选择甲方单位
        handleSelectPartyB(params) {
            this.handleSelect(params, 'partyBName');
        },
        // ----------------------------- 收入合同 -------------------------------
        // 清除收入合同
        handleClearContractIncome(params) {
            this.handleSelectContractIncome({ selectList: [], paramsConfig: params });
        },
        // 选择收入合同
        handleSelectContractIncome(params) {
            this.handleSelect(params, 'contractName');
        },
        // ----------------------------- 分包计划 -------------------------------
        // 清除分包计划
        handleClearSubcontract(params) {
            this.handleSelectSubcontract({ selectList: [], paramsConfig: params });
        },
        // 选择分包计划
        handleSelectSubcontract(params) {
            this.handleSelect(params, 'subcontractContent');
        },
        // ----------------------------- 子工程 -------------------------------
        // 清除子工程
        handleClearProjectChild(params) {
            this.handleSelectProjectChild({ selectList: [], paramsConfig: params });
        },
        // 选择子工程
        handleSelectProjectChild(params) {
            this.handleSelect(params, 'usePlaceName');
        },
        // ----------------------------- 目标工程量明细清单 (拟使用部位) -------------------------------
        // 清除目标工程量明细清单
        handleClearUsePlace(params) {
            this.handleSelectUsePlace({ selectList: [], paramsConfig: params });
        },
        // 选择目标工程量明细清单
        handleSelectUsePlace(params) {
            this.handleSelect(params, 'projectDetailName');
        },
        // ----------------------------- 员工 ---------------------------------
        // 清除员工
        handleClearUser(params) {
            this.handleSelectUser({ selectList: [], paramsConfig: params });
        },
        // 选择子工程
        handleSelectUser(params) {
            this.handleSelect(params, 'userName');
        },
        // ----------------------------- 所属公司 ---------------------------------
        // 清除所属公司
        handleClearOrg(params) {
            this.handleSelectOrg({ selectList: [], paramsConfig: params });
        },
        // 选择所属公司
        handleSelectOrg(params) {
            this.handleSelect(params, params.paramsConfig.prop);
        },
        // ----------------------------- 其他与子表关联 -------------------------------
        // 下拉选择框
        handleOtherSelect(params) {
            const arr = params.selectList;
            const item = params.paramsConfig;
            const oldRelationForm = params.oldRelationForm;
            const oldProjectForm = this.oldProjectForm;
            let isTableList = false;
            if (!item.isRelationTable && (!item.relationTable || item.relationTable.length === 0)) {
                this.setSelectValue(item, this.pageConfig.projectForm[item.prop]);
                return;
            }
            for (const table of item.relationTable) {
                if (this.pageConfig.subTableConfig[table].tableData.length) {
                    isTableList = true;
                }
            }
            if (oldProjectForm[item.prop] && isTableList) {
                const deletMessage = this.$t('tips.chengeDataTips').replace('{keyValue}', this.$t(`${item.label}`));
                this.$confirm(deletMessage, this.$t('tips.dataChangePrompt'), {
                    confirmButtonText: this.$t('button.determine'),
                    cancelButtonText: this.$t('button.close'),
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                }).then(() => {
                    for (const table of item.relationTable) {
                        this.deleteDetail(table);
                    }
                    this.setSelectValue(item, this.pageConfig.projectForm[item.prop]);
                }).catch(() => {
                    this.$set(this.pageConfig.projectForm, item.prop, oldProjectForm[item.prop] || ''); // 显示值
                    this.setSelectValue(item, this.pageConfig.projectForm[item.prop], false); //
                    if (item.formType === 'week') {
                        this.$refs.editForm.setWeek(this.pageConfig.projectForm.applyDate);
                        // this.$set(this.projectForm, 'week', this.week);
                    }
                });
            } else {
                this.setSelectValue(item, this.pageConfig.projectForm[item.prop]);
            }
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
                console.log(date, fisrtWeekend);
                if (date <= fisrtWeekend) {
                    return 1;
                } else {
                    return 1 + Math.ceil((date - fisrtWeekend) / 7);
                }
            }
        },
        // 下拉框联动赋值
        setSelectValue(item, event, cancleFlag = true) {
            this.$set(this.oldProjectForm, item.prop, event);
            if (item.isRelation) {
                item.relationList && item.relationList.forEach(row => {
                    let index = 0;
                    if (item.formType === 'select') {
                        index = item.selectList.findIndex(v => v[item.valueCode] === event);
                    } else {
                        index = item.selectList.findIndex(v => v.dataCode === event);
                    }
                    this.$set(this.pageConfig.projectForm, row.receive, item.selectList[index] && item.selectList[index][row.value] || ''); // 显示值
                    this.$set(this.oldProjectForm, row.receive, item.selectList[index] && item.selectList[index][row.value] || ''); // 显示值
                });
            }
            if (item.otherOperate && cancleFlag) {
                item.otherOperateFun && this[item.otherOperateFun]();
            }
        },
        // ----------------------------- 使用弹出框选择后的一系列赋值操作 -------------------------------
        // 确认选择
        handleSelect(params, displayValue, callback) {
            const arr = params.selectList;
            const item = params.paramsConfig;
            if (!callback) { // 弹窗选择后的下拉框回调
                if (item.otherOperate && item.otherOperateFun) {
                    callback = this[item.otherOperateFun];
                }
            }
            // 关联子表时
            if (item.relationTable && item.relationTable.length) {
                let isTableList = false;
                for (const table of item.relationTable) {
                    if (this.pageConfig.subTableConfig[table].tableData.length) {
                        isTableList = true;
                    }
                }
                if (this.pageConfig.projectForm[item.prop] && isTableList) {
                    this.selectChange(item, arr, displayValue, callback);
                } else {
                    this.setRelationData(item, arr, displayValue, callback);
                }
            } else {
                this.setRelationData(item, arr, displayValue, callback);
            }
        },
        // 选择 关联明细删除提示
        selectChange(item, arr, displayValue, callback) {
            const deletMessage = this.$t('tips.chengeDataTips').replace('{keyValue}', this.$t(`fConfig.${displayValue}`));
            this.$confirm(deletMessage, this.$t('tips.dataChangePrompt'), {
                confirmButtonText: this.$t('button.determine'),
                cancelButtonText: this.$t('button.close'),
                dangerouslyUseHTMLString: true,
                type: 'warning'
            }).then(() => {
                for (const table of item.relationTable) {
                    this.deleteDetail(table);
                }
                this.setRelationData(item, arr, displayValue, callback);
            }).catch(() => {
            });
        },
        // 主表联动赋值
        setRelationData(item, arr, displayValue, callback) {
            this.$set(this.pageConfig.projectForm, item.prop, arr.length > 0 ? arr[0][displayValue] : ''); // 显示值
            this.$set(this.pageConfig.projectForm, item.key, arr.length > 0 ? arr[0].id : ''); // 关键值
            if (item.isRelation) {
                item.relationList.forEach(row => {
                    if (row.isAddress) {
                        // 获取详细地址
                        let address = '';
                        if (arr.length > 0) {
                            const continent = arr[0].continent && arr[0].continent.split('-')[0];
                            const country = arr[0].country && arr[0].country.split('-')[0];
                            const province = arr[0].province && arr[0].province.split('-')[0];
                            const city = arr[0].city && arr[0].city.split('-')[0];
                            const area = arr[0].area && arr[0].area.split('-')[0];
                            address = `${continent}${country}${province}${city}${area}`;
                        }
                        this.$set(this.pageConfig.projectForm, row.receive, arr.length > 0 ? address : ''); // 显示值
                    } else if (row.areaCode) {
                        // 货取地址代码
                        const areas = [];
                        const keysList = ['continent', 'country', 'province', 'city', 'area'];
                        for (const key of keysList) {
                            if (arr[0][key] && arr[0][key].indexOf('-')) {
                                const id = arr[0][key].split('-')[1];
                                areas.push(Number(id));
                            }
                            this.$set(this.pageConfig.projectForm, key, arr[0][key] ? arr[0][key] : ''); // 显示值
                        }
                        this.$set(this.pageConfig.projectForm, row.receive, arr.length > 0 ? areas : ''); // 显示值
                    } else {
                        let value = '';
                        if (arr.length) {
                            value = arr[0][row.value] === undefined ? '' : arr[0][row.value];
                        } else {
                            value = '';
                        }
                        this.$set(this.pageConfig.projectForm, row.receive, value); // 显示值
                    }
                });
            }
            if (item.clearRelation && item.clearRelation.length) {
                this.clearRelationData(item.clearRelation);
            }
            callback && callback();
        },
        // 清除相关连动数据
        clearRelationData(clearList) {
            for (const v of clearList) {
                const index = this.pageConfig.mainFormConfig.formList.findIndex(item => item.prop === v.prop);
                if (index >= 0) {
                    this[v.clearFun] && this[v.clearFun](this.pageConfig.mainFormConfig.formList[index]);
                }
            }
        },

        // -------------------------------------------- 子表 ----------------------------------------
        // 子表事件按钮事件传出
        mainOperateBtnSubTable(parameter) {
            this[parameter.code](parameter.subTableCode);
        },
        // 导出明细
        sysHandleExportDetail(tableName) {
            if (this.type !== 'info') {
                this.$message.info(this.$t('tips.exportDetailTips'));
                return;
            }
            const exportParams = {
                url: this.page.PageConfig.processParmas.exportDetail.url,
                params: {
                    [this.page.PageConfig.processParmas.exportDetail.params]: this.id
                }
            };
            this.handleExportDetail(exportParams);
        },
        // 导出明细列表操作
        handleExportDetail(exportParams, tableName) {
            const pageName = this.$route.params && this.$route.params.translateName ? this.$route.params.translateName : this.$route.name;
            const tranSlateName = `menu.${pageName}`;
            this.$store.dispatch(exportParams.url, exportParams.params).then(data => {
                if (!data) return;
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', `${this.$t(tranSlateName)} ${this.$t('dialog.tendersDetail')} ${this.$t('fConfig.excel')}.xls`);
                document.body.appendChild(link);
                link.click();
            });
        },
        // 添加明细
        sysHandleDeletaAdd(tableName) {
            if (this.tableRow) {
                this.pageConfig.subTableConfig[tableName].tableData.push(this.$clone(this.tableRow));
                return;
            }
            const tableDataRow = this.$clone(this.pageConfig.subTableConfig[tableName].tableList.tableDataRow);
            this.pageConfig.subTableConfig[tableName].tableData.push(tableDataRow);
        },
        // 批量删除
        sysHandleDeletaBatch(tableName, otherOperate) {
            if (otherOperate) {
                this.handleDeleteSubTable(Array.from(this.pageConfig.subTableConfig[tableName].tableData), this.$t(`${this.translateName}.${tableName}`), tableName);
            } else {
                if (this.deleteList[tableName] && this.deleteList[tableName].length) {
                    this.handleDeleteSubTable(this.deleteList[tableName], this.$t(`${this.translateName}.${tableName}`), tableName);
                } else {
                    this.$message.error(this.$t('tips.pleaseSelectDetailed'));
                }
            }
        },
        // 批量删除操作
        handleDeleteSubTable(arr, keyValue, tableName) {
            if (arr && arr.length > 0) {
                const deletMessage = this.$t('tips.deleteDetailedTips').replace('{keyValue}', keyValue);
                const deleteDetailsMessage = this.$t('tips.deleteDetailsApiTips').replace('{keyValue}', keyValue);
                let messageTips = deletMessage;
                (this.pageConfig.processParmas.deleteDetailsParams && this.pageConfig.processParmas.deleteDetailsParams.url) && (messageTips = deleteDetailsMessage);
                this.$confirm(messageTips, `${this.$t('button.batchDeletion')}${keyValue}`, {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: this.$t('button.determine'),
                    cancelButtonText: this.$t('button.close'),
                    type: 'warning'
                }).then(() => {
                    this.deleteDetail(tableName, arr);
                }).catch(e => { });
            } else {
                // 请选择明细清单
                arr && this.$message.error(this.$t('tips.pleaseSelectDetailed'));
            }
        },
        deleteDetail(tableName, deleteList) {
            if (!deleteList) {
                deleteList = Array.from(this.pageConfig.subTableConfig[tableName].tableData);
            }
            deleteList.forEach(v => {
                this.pageConfig.subTableConfig[tableName].tableData.splice(this.pageConfig.subTableConfig[tableName].tableData.indexOf(v), 1);
            });
            if (this.pageConfig.processParmas.deleteDetailsParams && this.pageConfig.processParmas.deleteDetailsParams.url) {
                const deleteDetailsParams = this.pageConfig.processParmas.deleteDetailsParams;
                const deleteIds = deleteList.filter(v => v.id).map(i => i.id);
                deleteIds.length && this.$store.dispatch(deleteDetailsParams.url, deleteIds).then(res => {
                    if (res.status === 0) {
                        this.$message.success(`${this.$t('button.delete')}${this.$t('tips.success')}!`);
                    } else {
                        this.$message.error(`${this.$t('button.delete')}${this.$t('tips.fail')}!`);
                    }
                });
            }
            this.$refs[tableName][0].clearSelectionTable();
            // 删除后的数值计算回调
            this.deletTableCallback && this.deletTableCallback(tableName);
        },
        // 子表操作事件
        editTableEvent({ eventName, params }) {
            if (eventName === 'tableSelect') { // 下拉选择
                this.handleTableSelect(params);
            }
            if (eventName === 'operateDataEvent') { // 数值计算
                this.handleCalculation(params);
            }
            if (eventName === 'handleTable') { // 表格文本操作事件
                params.item && params.item.fn && this[params.item.fn](params);
            }
            if (eventName === 'fnRowName') { // 表格操作按钮
                const { btnParameter, row } = params;
                btnParameter.fn && this[btnParameter.fn](row);
            }
        },
        // 子表下拉选择赋值
        handleTableSelect({ item, row, event, subTable, rowIndex }) {
            item.relationList.forEach(res => {
                let index = 0;
                if (item.formType === 'select') {
                    index = item.selectList.findIndex(v => v[item.valueCode] === event);
                } else {
                    index = item.selectList.findIndex(v => v.dataCode === event);
                }
                this.$set(this.pageConfig.subTableConfig[subTable.subTableName].tableData[rowIndex], res.receive, item.selectList[index][res.value]);
            });
        },
        // 数值计算
        handleCalculation(params) {
        },
        // 行内样式表格方法
        getRowClassName({ row, rowIndex }) {
            if (!this.checkRow(row)) {
                return '';
            } else { // 返回true 则爆红
                return 'error-active';
            }
        },
        // 明细模板下载
        sysHandleDownloadTemplate() {
            const pageName = this.$route.params && this.$route.params.translateName ? this.$route.params.translateName : this.$route.name;
            const tranSlateName = `menu.${pageName}`;
            const tableName = this.page.PageConfig.processParmas.dowanloadDetail.tableName;
            const table = `${pageName}.${tableName}`;
            this.$store.dispatch(this.page.PageConfig.processParmas.dowanloadDetail.url).then(data => {
                if (!data) return;
                const url = window.URL.createObjectURL(new Blob([data]));
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', `${this.$t(tranSlateName)} ${this.$t(table)} ${this.$t('fConfig.excel')}.xls`);
                document.body.appendChild(link);
                link.click();
            });
        }
    }
};
