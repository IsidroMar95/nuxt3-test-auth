<template>
  <NuxtLayout name="common">
    Hello From dashboard
    <div>
      <pre>
          {{ session }}
    </pre>
    </div>
    <button type="button"
            class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      Log out
    </button>
  </NuxtLayout>
</template>

<script setup>
useHead({
  title: '🔐 nuxt-auth-example',
})
const {status, getSession} = useSession()
const session = await getSession()

</script>
