<template>
  <div class="min-h-screen romantic-bg flex items-center justify-center relative overflow-hidden">
    <!-- Floating petals -->
    <div class="petal" style="left:5%;animation-duration:8s">🌸</div>
    <div class="petal" style="left:25%;animation-duration:10s;animation-delay:2s">🌺</div>
    <div class="petal" style="left:50%;animation-duration:7s;animation-delay:1s">🌸</div>
    <div class="petal" style="left:75%;animation-duration:9s;animation-delay:3s">🌹</div>
    <div class="petal" style="left:90%;animation-duration:11s;animation-delay:0.5s">🌸</div>

    <div class="z-10 text-center px-6 max-w-xl animate-fade-in">
      <!-- Logo -->
      <div class="text-7xl mb-6 animate-float">💍</div>
      <h1 class="font-script text-6xl md:text-7xl gold-text mb-4">Wedding Invitation</h1>
      <p class="font-elegant text-xl text-rose-700 mb-2">Create beautiful digital wedding invitations</p>
      <p class="text-gray-500 text-sm mb-10">Share your love story with the world</p>

      <div class="gold-divider" />

      <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink to="/register" class="btn-gold px-8 py-4 text-base w-full sm:w-auto">
          ✨ Create Your Invitation
        </NuxtLink>
        <NuxtLink to="/login" class="btn-outline px-8 py-4 text-base w-full sm:w-auto">
          Sign In
        </NuxtLink>
      </div>

      <p class="text-xs text-gray-400 mt-8">Free to start · No credit card required</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

useHead({ title: 'Wedding Invitation Platform — Create Beautiful Digital Invitations' })
</script>
