<template>
    <div class="useNavigation" v-loading="loading">
        <div class='roleParent' v-for="item in roleList" :key='item.id'>
            <div class="roleItem midFont">
               <p class="roleName">
                   <span class="midFont">
                       <!-- 角色名称： -->
                       {{$t('dialog.roleName')}}：
                    </span>
                   <span class="midFont set">{{item.rolesName}}</span>
                </p>
               <!-- 发起工作可前往 -->
                <p class="roleName">{{$t('dialog.youCanGo')}}：</p>
                <div class="scrollBox"  v-if='list[item.id].length'>
                    <div v-for='(child, index) in list[item.id]' :key='child.id'>
                        <div class="roleName" @click.stop.prevent='handleClick(child)'>
                            <span>{{index + 1}}、</span>
                            <span class=" midFont set">{{child.subSystemName}}
                            <i class="el-icon-right"></i>
                            {{child.parentResName}}
                            <i class="el-icon-right"></i>
                            {{child.resName}}
                            </span>
                        </div>
                    </div>
                </div>
                <div v-else class="parentResNameTips smallFont light-grey">
                            <!-- 您的岗位职责上没有需要发起的工作，可能您需要的是参与审批、查询工作，或者管理员未正确设置您的发起工作。 -->
                           <p>
                                {{$t('dialog.parentResNameTips')}}
                           </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: 'useNavigation',
    data() {
        return {
                roleData: [],
                userRoles: {},
                isShow: false,
                roleList: [],
                list: {},
                loading: false
            };
    },
    created() {
        this.getOrganizationQuickRoleMenu();
    },
    methods: {
        async getOrganizationQuickRoleMenu() {
            this.loading = true;
            const userRoles = this.$utils.Auth.hasUserInfo().userRoles;
            this.userRoles = userRoles.length > 3 ? userRoles.splice(0, 3) : userRoles;
            const params = {
                roleIds: this.userRoles.map(v => v.id),
                subSystemCode: ''
            };
            await this.$store.dispatch('publicApi/organizationQuickRoleMenu', params).then((res) => {
                if (res.status === 0) {
                    this.roleData = res.results || [];
                    this.list = {};
                    const userRoles = this.$clone(this.userRoles);
                    for (const i in userRoles) {
                        const item = userRoles[i];
                        const data = this.roleData.filter(v => v.roleId === item.id);
                        this.$set(this.list, item.id, data);
                    }
                    this.roleList = userRoles;
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.$message.error(this.$t('res.errorMessage'));
                }
            });
        },
        handleClick(row) {
            this.$store.dispatch('publicApi/checkSubSystemMenusPublic', { subSystemCode: row.subSystemCode }).then(res => {
                if (res.status === 0) {
                    if (res.results) {
                        console.log(row.subSystemUrl, row.path, 'row.path');
                        const jumpUrl = `${this.$utils.config.jumpUrl}${row.subSystemUrl}/#/${row.path}`;
                        window.open(jumpUrl, '_blank');
                    } else {
                        // 您没有此子系统权限，请联系管理员授权
                        this.$message.warning(this.$t('dialog.noPermission'));
                    }
                } else {
                    this.$message.error(this.$t('res.errorMessage'));
                }
            });
        }
    }
};
</script>
<style scoped lang="scss">
    .useNavigation {
        position: fixed;
        width: 650px;
        min-height: 50%;
        top: 80px;
        right: 30px;
        max-height: calc(100% - 80px);
        // overflow: hidden;
        z-index: 1100;
        padding: 0 30px;
        background: white;
        box-sizing: content-box;
        .roleParent{
            position: relative;
            cursor: pointer;
            border-bottom: 1px solid #eeeeee;
            padding: 10px 20px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            box-sizing: content-box;
        }
        .roleItem{
            .scrollBox {
                overflow: auto;
                height: 160px;
                width: 650px;
            }
            .roleName{
                height: 32px;
                line-height: 32px;
                // width: 100%;
                .el-icon-user-solid{
                    margin-right: 5px;
                }
            }

            .parentResNameTips{
                height: 150px;
                width: 100%;
                p {
                    width: 100%;
                    line-height: 25px;
                    word-wrap: break-word;
                    word-break: normal;
                }
            }

        }
    }
</style>
