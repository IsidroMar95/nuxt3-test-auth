<template>
  <div class="h-full bg-red-600">
    <slot>Fallback auth content</slot>
  </div>
</template>

<script>
export default {
  name: "Auth"
}
</script>
