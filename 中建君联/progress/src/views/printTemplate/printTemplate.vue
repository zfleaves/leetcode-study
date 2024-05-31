<template>
  <print-template></print-template>
</template>
<script>
export default {
  components: {
      printTemplate(resolve) {
          require(['components/basicComponents/printTemplate/printTemplate'], resolve);
      }
  }
};
</script>
