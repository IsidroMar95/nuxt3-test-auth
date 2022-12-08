<template>
  <div class="min-h-screen bg-green-50 flex items-center justify-center flex-col">
    Hello from the index public page
    <NuxtLink
        to="/login"
        type="button"
        class="button">
      Button text
    </NuxtLink>

  </div>
</template>
<style lang="scss">
.button {
  @apply inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 mt-5 text-sm font-medium leading-4 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2;
}
</style>
