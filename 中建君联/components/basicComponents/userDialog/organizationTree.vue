<template>
    <div class="materialVarieties">
        <div class="materialVarieties-cont">
            <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
                <div class="cons">
                    <div class="cons-table-t content" v-loading="treeLoading">
                        <div class="fixed-scroll" style="display: flex;flex-direction: column;">
                            <div class="treeTitle">
                                <div v-for="item in mainTable.tableList" :key="item.prop" :class="item.prop">
                                    {{ $t(item.label) }}
                                </div>
                            </div>
                            <!-- :load="loadNode" lazy -->
                            <div class="treeCons">
                                <div class="fixed-scroll">
                                    <el-tree :data="mainTable.tableData" ref="tree" node-key="id" :props='props'
                                        class="tree-content" default-expand-all :default-checked-keys='checkedKey'
                                        check-strictly :filter-node-method="filterNode" :show-checkbox='showCheckBox'
                                        @check-change="handleCheckChange" :check-on-click-node="true">
                                        <template slot="empty">
                                            <no-data>
                                            </no-data>
                                        </template>
                                        <div class="custom-tree-node" slot-scope="{ node, data }"
                                            :class="'level' + node.level">
                                            <div class="tree-node">
                                                <div class="orgName">
                                                    <tooltips :value="data.orgName">
                                                    </tooltips>
                                                </div>
                                            </div>
                                        </div>
                                    </el-tree>
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
import { search } from 'mixins/searchMixins';

export default {
    name: 'organizationTree',
    mixins: [search],
    data() {
        return {
            loading: false,
            props: {
                label: 'orgName',
                children: 'children',
                isLeaf: 'leaf'
            },
            mainTable: {
                rowKey: 'id',
                // 表格数据
                tableData: [],
                // 表格高度
                maxHeight: 500,
                // 子系统表头渲染参数
                tableList: [
                    // 材料名称
                    { show: true, prop: 'orgName', label: 'fConfig.organization' }
                ]
            },
            orgName: '',
            // =====================
            pageNo: 1,
            pageSize: 10,
            total: 0,
            treeLoading: false,
            orgList: [],
            checkedKey: [],
            treeExpandData: [],
            tableData: [],
            selectedIsRadio: false
        };
    },
    props: {
        dialogHeight: {
            type: Number,
            default: 300
        },
        showCheckBox: {
            type: Boolean,
            default: true
        },
        selectList: {
            type: Array,
            default: () => { }
        },
        filterOgName: {
            type: String,
            default: ''
        },
        isRadio: {
            type: Boolean,
            default: true
        },
        isCheckBox: {
            type: Boolean,
            default: false
        },
        selectOrgId: {
            default: ''
        },
        selectOrgList: {
            default: () => []
        },
        // 是否显示部门
        isShowDepartName: {
            default: true,
            type: Boolean
        },
        isOnlyCheckDepartName: {
            default: false,
            type: Boolean
        },
        isAuthority: {
            default: true,
            type: Boolean
        },
        isRelation: { // 是否关联上级所属公司
            default: false,
            type: Boolean
        },
        relationOrgId: { // 关联的上级所属公司
            default: 0
        },
        isComplete: { // 是否展示完整路径
            default: false,
            type: Boolean
        },
        // 带出最近的一级父级
        isGetParentOrg: {
            default: false,
            type: Boolean
        },
        // 公司层级调整时需要将当前组织机构置灰
        isNeedDisable: {
            default: false,
            type: Boolean
        },
        soucrceOrgId: {
            type: Number,
            default: null
        }
    },
    watch: {
        filterOgName: {
            handler(val) {
                this.$refs.tree.filter(val);
            },
            deep: true
        }
    },
    async created() {
        this.selectedIsRadio = !this.isCheckBox;
        if (this.selectOrgId) {
            this.checkedKey = [this.selectOrgId];
        }
        if (this.selectOrgList.length > 0) {
            this.checkedKey = this.selectOrgList;
        }
        this.authorityOrgIdList = this.$utils.Auth.hasUserInfo().data || [];
        this._getOrgTree();
        if (this.selectOrgList.length) {
            this.setCheckTree(this.mainTable.tableData);
        }
    },
    methods: {
        // 条件过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.orgName.indexOf(value) !== -1;
        },
        // 获取分类树
        _getOrgTree() {
            this.$store.dispatch('publicApi/getEffectiveOrgTree').then(res => {
                if (res.status === 0) {
                    localStorage.removeItem('belongCompany');
                    if (this.isComplete || this.isRelation) {
                        this.setCompleteData(res.results);
                    }

                    if (this.isGetParentOrg) {
                        this.setParentOrgData(res.results, res.results[0]);
                    }
                    if (!this.isShowDepartName) {
                        this.filterOgr(res.results);
                    }
                    this.mainTable.tableData = res.results;
                    // if (this.selectOrgId) {
                    //   this.treeExpandData = [Number(this.selectOrgId)];
                    // } else {
                    //   this.treeExpandData = this.mainTable.tableData.length && [this.mainTable.tableData[0].id];
                    // }
                    this.treeLoading = false;
                    this.$emit('currentRow', this.mainTable.tableData[0]);// 进页面首次点击
                    this.$nextTick(() => {
                        this.setCheckTree(res.results);
                    });
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
            });
        },
        // 带出最近的一级父级公司
        setParentOrgData(arr, list = {}, parentOrgId = '', parentOrgName = '', parentOrgCode = '') {
            if (list.orgAttributeCode === '04') {
                parentOrgId = parentOrgId;
                parentOrgName = parentOrgName;
                parentOrgCode = parentOrgCode;
            } else {
                parentOrgId = list.id;
                parentOrgName = list.orgName;
                parentOrgCode = list.orgCode;
            }
            for (const item of arr) {
                this.$set(item, 'parentOrgId', parentOrgId);
                this.$set(item, 'parentOrgName', parentOrgName);
                this.$set(item, 'parentOrgCode', parentOrgCode);

                if (item.children && item.children.length) {
                    this.setParentOrgData(item.children, item, parentOrgId, parentOrgName, parentOrgCode);
                }
            }
        },
        // 展示完整路径
        setCompleteData(arr, parentName = '', orgNameList = [], parentIdList = [], companyList = []) {
            for (const item of arr) {
                item.completeList = [];
                item.companyList = [];
                item.companyList = item.orgAttributeCode !== '04' ? companyList.concat([{ orgName: item.orgName, id: item.id }]) : companyList;
                item.parentIdList = parentIdList.concat([item.id]);
                if (parentName) {
                    item.completeList = orgNameList.concat(parentName);
                }
                if (item.children && item.children.length) {
                    this.setCompleteData(item.children, item.orgName, item.completeList, item.parentIdList, item.companyList);
                }
            }
        },
        setCheckTree(arr) {
            for (const i in arr) {
                const item = arr[i];
                this.$set(item, 'code', item.orgCode);
                item.currentOrgName = item.orgName;
                if (this.isAuthority) {
                    if (this.authorityOrgIdList.indexOf(item.id) >= 0) {
                        this.$set(item, 'disabled', false);
                    } else {
                        this.$set(item, 'disabled', true);
                    }
                }
                if (this.isOnlyCheckDepartName && this.isShowDepartName) {
                    if (item.orgAttributeCode === '04') {
                        this.$set(item, 'disabled', false);
                    } else {
                        this.$set(item, 'disabled', true);
                    }
                }
                if (this.isRelation && this.relationOrgId) {
                    this.$set(item, 'disabled', this.isRelationDepart(item));
                }
                if (this.selectedIsRadio) {
                    if (Number(this.selectOrgId) === Number(item.id)) {
                        this.$refs.tree.setChecked(item, true);
                    } else {
                        this.$refs.tree.setChecked(item, false);
                    }
                }
                if (this.isCheckBox) {
                    if (this.selectOrgList.findIndex(v => v.id === item.id) >= 0) {
                        this.$refs.tree.setChecked(item, true);
                    } else {
                        this.$refs.tree.setChecked(item, false);
                    }
                }
                if (this.isNeedDisable) {
                    if (this.soucrceOrgId === item.id) {
                        this.$set(item, 'disabled', true);
                    } else {
                        this.$set(item, 'checked', false);
                    }
                }
                if (item.children && item.children.length) {
                    this.setCheckTree(item.children, item.parentIdList);
                }
            }
        },
        isRelationDepart(row) {
            if (row.orgAttributeCode !== '04') return true;
            if (row.parentIdList.indexOf(this.relationOrgId) < 0) return true;
            return false;
        },

        filterOgr(targetList) { // 遍历后台传来的路由字符串，转换为组件对象
            const filterList = targetList.filter(v => {
                if (v.children && v.children.length) {
                    v.children = this.filterOgr(v.children);
                }
                return v.orgAttributeCode !== '04';
            });
            return filterList;
        },

        // 点击当前行
        handleCheckChange(data, checked, node) {
            if (this.selectedIsRadio && checked) {
                if (data.disabled) return; // 如果禁选 无后续操作
                this.$refs.tree.setCheckedNodes([data]);
                this.orgList = [data];
                this.$emit('currentRow', data);
                this.$emit('setOrgList', this.orgList);
                if (this.isRelation) {
                    if (this.isRelationDepart(data)); // 关联后的禁选 无后续操作
                }
            } else if (this.isCheckBox && checked) {
                if (data.disabled) return; // 如果禁选 无后续操作
                const checkedNode = this.$refs.tree.getCheckedNodes().filter(v => v.id > 0);
                this.$emit('currentRow', data);
                this.$emit('setOrgList', checkedNode);
                if (this.isRelation) {
                    if (this.isRelationDepart(data)); // 关联后的禁选 无后续操作
                }
            }
        },
        getNode() {
            const node = this.$refs.tree.getCheckedNodes().filter(v => v.id > 0);
            // console.log(node);
            return node;
        }
    }
};
</script>

<style scoped lang="scss">
.materialVarieties {
    min-width: 100%;
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
}

.treeTitle {
    height: 40px;
    width: calc(100% - 2px);
    display: flex;
    border: 1px solid #ebeef5;
    background: #fafafa;
    line-height: 40px;
    color: #909399;
    text-align: left;
    font-size: 14px;
    font-weight: bold;

    .orgName {
        margin-left: 10px;
        min-width: 100px;
        float: left;
        height: 100%;
        width: 100;
    }
}

.treeCons {
    flex: 1;
    width: calc(100% - 2px);
    position: relative;
    // background: pink;
    border: 1px solid #ebeef5;
    border-top: 0;

    /deep/ .el-tree-node__content {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ebeef5;
    }

    .custom-tree-node {
        // display: flex;
        flex-direction: row;
        height: 100%;
        flex: 1;
        text-align: left;

        .orgName {
            min-width: 100px;
            float: left;
            height: 100%;
            width: 100%;
        }
    }
}

.imgUrlList {
    display: inline-block;
    vertical-align: top;
    overflow: hidden;
}

.table_pages {
    margin-top: 10px;
    text-align: center;
}
</style>
