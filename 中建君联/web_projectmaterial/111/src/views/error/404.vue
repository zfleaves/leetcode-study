<template>
  <div style="width: 100%;height: 100%;">
    <div class="container container-star">
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-1"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
      <div class="star-2"></div>
    </div>
    <div class="container container-bird">
      <div class="bird bird-anim">
        <div class="bird-container">
          <div class="wing wing-left">
            <div class="wing-left-top"></div>
          </div>
          <div class="wing wing-right">
            <div class="wing-right-top"></div>
          </div>
        </div>
      </div>
      <div class="bird bird-anim">
        <div class="bird-container">
          <div class="wing wing-left">
            <div class="wing-left-top"></div>
          </div>
          <div class="wing wing-right">
            <div class="wing-right-top"></div>
          </div>
        </div>
      </div>
      <div class="bird bird-anim">
        <div class="bird-container">
          <div class="wing wing-left">
            <div class="wing-left-top"></div>
          </div>
          <div class="wing wing-right">
            <div class="wing-right-top"></div>
          </div>
        </div>
      </div>
      <div class="bird bird-anim">
        <div class="bird-container">
          <div class="wing wing-left">
            <div class="wing-left-top"></div>
          </div>
          <div class="wing wing-right">
            <div class="wing-right-top"></div>
          </div>
        </div>
      </div>
      <div class="bird bird-anim">
        <div class="bird-container">
          <div class="wing wing-left">
            <div class="wing-left-top"></div>
          </div>
          <div class="wing wing-right">
            <div class="wing-right-top"></div>
          </div>
        </div>
      </div>
      <div class="bird bird-anim">
        <div class="bird-container">
          <div class="wing wing-left">
            <div class="wing-left-top"></div>
          </div>
          <div class="wing wing-right">
            <div class="wing-right-top"></div>
          </div>
        </div>
      </div>
      <div class="container-title">
        <div class="title">
          <div class="number">4</div>
          <div class="moon">
            <div class="face">
              <div class="mouth"></div>
              <div class="eyes">
                <div class="eye-left"></div>
                <div class="eye-right"></div>
              </div>
            </div>
          </div>
          <div class="number">4</div>
        </div>
        <div class="subtitle">{{$t('tips.errorTips')}}</div>
        <p> <a href="javascript:void (0)"><button @click="back">{{$t('button.backToPreviousPage')}}</button></a></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      back() {
        this.$router.go(-1);
      }
    }
  };
</script>

<style scoped lang="scss">
// @import url("https://fonts.googleapis.com/css?family=Lato|Russo+One");
@import "./style/404.scss";
</style>
