<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
        <template v-if="item.children">
            <el-submenu  :index="item.name||item.path" :key="item.name">
                <template slot="title">
                <span slot="title">
                    {{item.resName}}
                </span>
                </template>
                <template v-for="child in item.children">
                    <template v-if="!child.hidden">
                        <menu-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0"
                                    :routes="[child]" :key="child.path">
                        </menu-item>
                        <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
                            <el-menu-item :index="item.path+'/'+child.path">
                            <span slot="title">
                                {{item.resName}}
                            </span>
                            </el-menu-item>
                        </router-link>
                    </template>
                </template>
            </el-submenu>
        </template>
    </template>
  </div>
</template>

<script>
  // import {generateTitle} from '@/i18n/translate'

  export default {
    name: 'menuItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    created () {
      for (const i in this.routes) {
        const item = this.routes[i];
      }
    },
    methods: {
      hasOneShowingChildren (children) {
        const showingChildren = children.filter(item => {
          return !item.hidden;
        });
        if (showingChildren.length === 1) {
          return true;
        }
        return false;
      }
      // generateTitle
    }
  };
</script>

