<template>
  <div>
    <todos></todos>
  </div>
</template>

<script>
import todos from './components/todos/Todos.vue'

export default {
  components: { todos }
}
</script>

<style>
body{
  margin: 0 !important;
  padding: 0;
}
</style>
