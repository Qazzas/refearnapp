<template>
  <section class="px-4 py-16">
    <div class="mx-auto max-w-3xl">
      <h1 class="mb-6 text-center text-4xl font-bold">
        Let's Discuss Your Project
      </h1>
      <p class="mb-10 text-center text-slate-500">
        Ready to scale? Fill out the form below and we'll reach out to schedule
        your discovery call.
      </p>

      <iframe
        data-tally-src="https://tally.so/embed/rjK8Ap?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        width="100%"
        height="800"
        title="Enterprise Discovery & Onboarding"
      >
      </iframe>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Load the Tally script once the component mounts
  const script = document.createElement('script');
  script.src = 'https://tally.so/widgets/embed.js';
  script.async = true;
  document.body.appendChild(script);
});
</script>
