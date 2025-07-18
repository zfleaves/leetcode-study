<!--
 * @Author: your name
 * @Date: 2020-08-09 10:13:02
 * @LastEditTime: 2022-09-02 18:24:38
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_contract-合同管理\src\components\basicComponents\global\upload\importFile.vue
-->
<template>
    <!--  margin:0 10px; -->
    <div class="uploadOrgWraHouse" style="display: inline-flex;">
        <el-button :disabled="flowStatus" v-fast-click class="more" size="small" type="primary"
            icon="el-icon-folder-opened" @click="setUploadStatus">
            {{ $t(parameter.name) }}
        </el-button>
        <div class="imgUrlList">
            <el-upload v-if="!flowStatus" :action="fileUrl" :headers="myHeaders" :data="fileName" ref="upload"
                :limit="limit" :auto-upload="false" :file-list="imgUrlList" :on-error="handleError"
                :on-change="imgPreview" :on-exceed='handleExceed' :on-success="handleSuccess"
                :before-upload="beforeAvatarUpload">
            </el-upload>
        </div>
        <!-- 导入获取的物资明细 -->
        <template v-loading="loadingShow">
            <slot :dialogImportFlag='dialogImportFlag' :subImportTable='subImportTable'></slot>
        </template>
        <!-- 导入选择项目的单项工程 -->
        <g-dialog v-if="dialogVisible" :dialogConfig="dialogConfig" :isVisible.sync="dialogVisible">
            <div class="content operationFormWrap" slot="body">
                <g-edit-form ref="projectForm" v-if="dialogVisible" :tableConfig="mainFormConfig"
                    :projectForm="projectForm">
                </g-edit-form>
            </div>
            <div slot="footer" class="footer">
                <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
                    @click="dialogVisible = false">
                    {{ $t('button.close') }}
                </el-button>
                <el-button size="small" type="primary" icon="el-icon-circle-check" @click="drawerItemSave" v-fast-click>
                    {{ $t('button.determine') }}
                </el-button>
            </div>
        </g-dialog>

    </div>
</template>

<script>
import config from 'util/config';
import Auth from 'util/auth';

export default {
    name: 'importFile',
    data() {
        return {
            fileUrl: config.url,
            myHeaders: {
                'Access-Token': Auth.hasToken(),
                'Access-Domain': 'customer',
                userId: Auth.hasUserInfo().userId,
                tenantId: Auth.hasUserInfo().tenantId,
                Language: Auth.hasLanguage(),
                resource: 'P2'
            },
            fileName: {
                fileName: '',
                subSystemCode: config.subSystemCode
            },
            imgUrlList: [],
            tableData: [],
            dialogImportFlag: false,
            loadingShow: false,
            subImportTable: {},
            // 导入选择项目的单项工程
            dialogVisible: false,
            dialogConfig: {
                title: `${this.$t('tips.pleaseSelect')}${this.$t('dialog.singleItemName')}`,
                appendBody: false,
                center: true,
                top: '250px',
                width: '30%',
                span: '0.25'
            },
            mainFormConfig: {
                formList: [
                    {
                        name: '单项工程名称', label: 'dialog.singleItemName', prop: 'rowCode', span: 24,
                        formType: 'dicSelect', isRule: true, selectList: []
                    }
                ]
            },
            projectForm: {
                rowCode: '',
                itemName: ''
            },
            projectInfo: {}
        };
    },
    props: {
        parameter: {
            type: Object,
            deefault: () => { }
        },
        buttonConfig: {
            type: Object,
            deefault: () => { }
        },
        tableDetailList: {
            type: Array,
            default: () => []
        },
        flowStatus: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 10
        },
        importUrl: {
            type: String,
            default: ''
        },
        subTable: {
            type: Object,
            deefault: () => { }
        },
        isImportSuccessTips: {
            type: Boolean,
            default: true
        },
        editPage: {},
        projectId: {
            type: Number,
            default: 0
        },
        isAsync: {
            type: Boolean,
            default: false
        },
        // 是否需要选择单项工程
        isSelectProjectSingle: {
            type: Boolean,
            default: false
        },
        projectPreApprovalId: {
            type: Number,
            default: 0
        },
        requestType: {
            type: String,
            default: ''
        }
    },

    mounted() {
        // this.getProjectInfo();
        console.log(this.requestType, 'this.requestType');
        this.fileUrl = `${config.url}${this.importUrl}`;
    },
    watch: {
        importUrl: {
            handler() {
                this.fileUrl = `${config.url}${this.importUrl}`;
            },
            deep: true,
            immediate: true
        }
        // projectId: {
        //     handler() {
        //         this.getProjectInfo();
        //     },
        //     deep: true,
        //     immediate: true
        // }
    },
    methods: {
        async setUploadStatus() {
            this.projectId ? this.fileName.projectId = this.projectId : '';
            this.projectPreApprovalId ? this.fileName.projectPreApprovalId = this.projectPreApprovalId : '';
            this.requestType ? this.fileName.requestType = this.requestType : '';
            // 多子表导入时用
            this.$emit('currentSubTableName', this.subTable.subTableName);
            if (this.editPage.canImprotDetail) {
                // 当是否能导入时 需要接口判断 会产生异步判断
                if (this.isAsync || this.editPage.isAsync) {
                    const isImport = await this.editPage.canImprotDetail(this.parameter);
                    if (isImport) {
                        if (this.isSelectProjectSingle) {
                            this.handleSelectProject();
                        } else {
                            this.$refs.upload.$refs['upload-inner'].handleClick();
                        }

                    }
                } else if (this.editPage.canImprotDetail(this.parameter)) {
                    this.$refs.upload.$refs['upload-inner'].handleClick();
                }
            }
        },
        // 文件超出个数限制时的钩子
        handleExceed(files, fileList) {
            this.$message.error(this.$t('tips.limitTips'));
        },
        // 文件上传失败
        handleError(err) {
            this.$store.commit('diaLog/set_contentLoading', { status: false, text: '' });
            if (err.status === 401) {
                this.$store.commit('user/SET_OVERDUETOKEN', true);
                return;
            }
            this.$message.error(this.$t('tips.uploadFail'));
        },
        beforeAvatarUpload(file) {
            const isLt5M = file.size / 1024 / 1024 < 50;
            if (!isLt5M) {
                this.$message.error(this.$t('tips.isLt5M'));
            }
            this.fileName.fileName = file.name;
            this.$store.commit('diaLog/set_contentLoading', { status: true, text: '' });
            return isLt5M;
        },
        // 文件预览
        imgPreview(files, fileList) {
            const fileName = files.name;
            const regex = /(.xls|.xlsx)$/;
            if (!regex.test(fileName)) {
                this.$message.error(this.$t('tips.importTips'));
            } else {
                this.dialogImportFlag = true;
                this.loadingShow = true;
                this.$refs.upload.submit();
            }
        },
        handleSuccess(response, file, fileList) {
            if (response.status === 0) {
                if (this.isImportSuccessTips && response.data && response.data.length) {
                    this.$message.success(this.$t('tips.importSuccess'));
                }
                this.subImportTable = this.$clone(this.subTable);
                this.subImportTable.tableData = response.data;
                this.$emit('fileName', this.fileName.fileName);
                this.$emit('importData', this.subImportTable);
                this.$refs.upload.clearFiles();
                fileList = [];
            } else {
                if (response.errorCode) {
                    this.$message.error(this.$t(`exception.${response.errorCode}`));
                } else {
                    this.$message.error(response.errorMsg ? response.errorMsg : response.errList[0].errMsg);
                }
                this.dialogImportFlag = false;
            }
            this.loadingShow = false;
            this.$store.commit('diaLog/set_contentLoading', { status: false, text: '' });
        },
        // ------------------------选择单项工程----------------------
        getProjectInfo() {
            const effectiveProjectList = window.localStorage.getItem('effectiveProjectList') ? JSON.parse(window.localStorage.getItem('effectiveProjectList')) : {};
            this.$store.dispatch('proProject/getProjectInfo', { id: effectiveProjectList.id || this.projectId }).then(res => {
                if (res.status === 0) {
                    this.projectInfo = res.results ? res.results.details : [];
                    const selectList = [];
                    this.projectInfo.forEach(v => {
                        selectList.push(
                            {
                                dataName: v.itemName,
                                dataCode: v.rowCode
                            }
                        );
                    });
                    const formList = this.mainFormConfig.formList;
                    const index = formList.findIndex(v => v.prop === 'rowCode');
                    if (index >= 0 && selectList.length > 0) {
                        this.$set(formList[index], 'selectList', selectList);
                    }
                }
            });
        },
        handleSelectProject() {
            this.projectForm = { rowCode: '', itemName: '' };
            if (this.projectInfo.length > 0) {
                if (this.projectInfo.length === 1) {
                    this.projectInfo[0].rowCode ? this.fileName.singleProjectCode = this.projectInfo[0].rowCode : '';
                    this.$emit('singleProject', this.projectInfo[0]);
                    this.$refs.upload.$refs['upload-inner'].handleClick();
                } else {
                    this.dialogVisible = true;
                }
            } else {
                this.$emit('singleProject', null);
            }
        },
        drawerItemSave() {
            if (this.projectForm.rowCode) {
                this.fileName.singleProjectCode = this.projectForm.rowCode || '';
                const index = this.projectInfo.findIndex(v => v.rowCode === this.projectForm.rowCode);
                if (index >= 0) {
                    this.$emit('singleProject', this.projectInfo[index]);
                    this.$refs.upload.$refs['upload-inner'].handleClick();
                }
            } else {
                this.$message.error(`${this.$t('tips.pleaseSelect')}${this.$t('dialog.singleItemName')}`);
            }
            this.dialogVisible = false;
        }
    }
};
</script>

<style scoped lang="scss">
body {
    margin: 0;
}

.imgUrlList {
    display: flex;
    justify-content: space-between;
    align-items: center;

    ul {
        border: none;
    }
}

.footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;
}
</style>
