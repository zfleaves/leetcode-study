<!--
 * @Author: your name
 * @Date: 2020-07-23 09:22:53
 * @LastEditTime: 2021-01-25 15:34:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\home\home.vue
-->
<template>
    <div class="cons">
        <div class="left">
            <img :src="homeImage" alt="">
        </div>
        <div class="right">
            <!-- 项目材料管理 -->
            <h2>{{$t('home.title')}}</h2>
            <p>{{$t('home.tips1')}}</p>
            <p>{{$t('home.tips2')}}</p>
            <p>{{$t('home.tips3')}}</p>
            <p>{{$t('home.tips4')}}</p>
            <p>{{$t('home.tips5')}}</p>
            <a href="https://static.junnysoft.cn/producthelp/proprogress.pdf" target="_blank"><i class="el-icon-link"></i>{{$t('button.seeInstruction')}}</a>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            homeImage: require('assets/images/home.png')
        };
    },
    created() {
        this.getYearAndMonthAndDay('2020-07-10 00:00:00', '2020-07-18 00:00:00');
    },
    methods: {
        getYearAndMonthAndDay(start, end) {
            // const date_all = []; let i = 0;
            // const startTime = getDate(start);
            // const endTime = getDate(end);
            // while ((endTime.getTime() - startTime.getTime()) >= 0) {
            // const year = startTime.getFullYear();
            // const month = (startTime.getMonth() + 1).toString().length == 1 ? `0${(startTime.getMonth() + 1).toString()}` : (startTime.getMonth() + 1).toString();
            // const day = startTime.getDate().toString().length == 1 ? `0${startTime.getDate()}` : startTime.getDate();
            // date_all[i] = `${year}-${month}-${day}`;
            // startTime.setDate(startTime.getDate() + 1);
            // i += 1;
            // }
            // return date_all;
        }
    }
};

</script>
<style scoped lang='scss'>
    .cons{
        background: #FAFAFA;
       .left {
            width: 75%;
            height: 100%;
            float: left;
            line-height: 100%;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            // background: url('../../assets/images/home.png');
            // background-size: center;
            img {
                // width: 80%;
                max-height: 100%;
                max-width: 100%;
                vertical-align: middle;
            }
       }
       .right {
            width: 25%;
            height: 100%;
            float: left;
            h2 {
                font-size: 24px;
                color: #000;
                margin-top: 160px;
                font-weight: normal;
                margin-bottom: 40px;
            }
            p {
                line-height: 42px;
                color: #333;
                font-size: 18px;
            }
            a {
                margin-top: 60px;
                color: #2b74ec;
                display: block;
                font-size: 16px;
                text-decoration: none;
                i {
                    margin-right: 8px;
                }
            }
       }
    }
</style>
