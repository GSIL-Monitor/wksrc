<template>
</template>
<script>
export default {
  // name: 'agent-index',
  beforeCreate() {
  // created() {
    console.log(this.$route)
    this.$router.replace({ path: this.$route.query.from })
    // this.$router.go(-1)
  }
}
</script>
