<!--
 * @Author: your name
 * @Date: 2024-07-15 09:16:07
 * @LastEditTime: 2024-07-15  11:17:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: src\components\components\userTable\userTable.vue
-->

<template>
    <div style="height: 100%;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t(item.name)" :name="item.code" v-for="item in  list" :key="item.code">
                <component :is='item.code' v-if="activeName === item.code"
                    :dialogHeight="componentDialogHeight"
                    @selectUser="getUser"
                    :isElTabs="true"
                    :selectedUsers="selectedUsers">
                </component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

export default {
    name: 'userTable',
    components: {
        organizationUserTable(resolve) {
            require(['components/basicComponents/userDialog/organizationUserTable'], resolve);
        },
        partnerUserTable(resolve) {
            require(['components/basicComponents/userDialog/partnerUserTable'], resolve);
        }
    },
    data () {
        return {
            activeName: 'organizationUserTable',
            list: [
                // 组织机构内部人员
                { name: 'dialog.organizationUserTable', code: 'organizationUserTable'},
                // 供应商外部人员
                { name: 'dialog.partnerUserTable', code: 'partnerUserTable'}
            ],
            componentDialogHeight: 500
        };
    },
    props: {
        dialogHeight: {
            type: Number,
            default: 500
        },
        selectedUsers: {
            default: ''
        },
        userDataSource: {
            type: String,
            default: 'customer'
        }
    },
    created() {
        this.activeName = this.userDataSource === 'customer' ? 'organizationUserTable' : this.userDataSource === 'supplier' ? 'partnerUserTable' : 'organizationUserTable';
    },
    methods: {
        getUser(data) {
            if (data && data.length > 0) {
                data.forEach(item => {
                    this.$set(item, 'userDataSource', this.activeName === 'organizationUserTable' ? 'customer' : 'supplier');
                    this.$set(item, 'orgId', this.activeName === 'organizationUserTable' ? item.orgId : item.partyBId);
                    this.$set(item, 'orgName', this.activeName === 'organizationUserTable' ? item.orgName : item.partyBName);
                });
            }
            this.$emit('getData', data || []);
        },
        handleClick(tab, event) {
            this.componentDialogHeight = this.activeName === 'organizationUserTable' ? this.dialogHeight : this.dialogHeight - 180;
        }
    }
};
</script>

<style scoped lang="scss">
.importTip {
  margin-top: 5px;
  margin-left: 5px;
  display: flex;
}
.elButton {
  margin-right: 20px;
  margin-top: 5px;
  float: right;
}
.clear {
  clear: both;
}
/dee/.el-message-box{
  width: 560px;
}
</style>

