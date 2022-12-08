<template>
  <div class="flex flex-col w-full min-h-screen bg-gray-100">
    <main class="overflow-y-auto relative">
      <div class="p-4 mx-auto w-full max-w-7xl md:p-6 lg:p-8">
        <slot>Fallback common content</slot>
      </div>
    </main>
  </div>
</template>
