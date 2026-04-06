<template>
  <section ref="sectionRef" class="py-20 px-6 bg-rose-50 section-enter" :class="{ visible: isVisible }">
    <div class="max-w-3xl mx-auto text-center mb-12">
      <p class="font-script text-4xl text-rose-400 mb-2">Wedding Gift</p>
      <h2 class="font-serif text-3xl font-semibold text-rose-800">Digital Gift</h2>
      <div class="gold-divider" />
      <p class="text-gray-500 text-sm mt-4">Your presence is our greatest gift. But if you wish to bless us:</p>
    </div>

    <div class="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="account in bankAccounts"
        :key="account.id"
        class="card-romantic p-6 text-center"
      >
        <div class="text-3xl mb-3">🏦</div>
        <h3 class="font-serif text-xl font-semibold text-rose-800 mb-1">{{ account.bankName }}</h3>
        <div class="gold-divider" />
        <p class="font-mono text-2xl font-bold tracking-widest text-gray-800 my-3">{{ account.accountNumber }}</p>
        <p class="text-gray-600 text-sm">{{ account.accountHolder }}</p>

        <!-- QR Code -->
        <div v-if="account.qrCode" class="mt-4 flex justify-center">
          <img :src="account.qrCode" alt="QR Code" class="w-32 h-32 object-contain rounded-xl border border-rose-100" />
        </div>

        <!-- Copy button -->
        <button
          @click="copyNumber(account.accountNumber)"
          class="btn-outline mt-4 text-sm"
        >
          {{ copied === account.accountNumber ? '✅ Copied!' : '📋 Copy Number' }}
        </button>
      </div>
    </div>

    <div v-if="bankAccounts.length === 0" class="text-center text-gray-400 py-8 text-sm">No bank account info provided</div>
  </section>
</template>

<script setup lang="ts">
interface BankAccount { id: string; bankName: string; accountNumber: string; accountHolder: string; qrCode?: string }
defineProps<{ bankAccounts: BankAccount[] }>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const copied = ref('')

async function copyNumber(num: string) {
  await navigator.clipboard.writeText(num).catch(() => {})
  copied.value = num
  setTimeout(() => { copied.value = '' }, 2000)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { isVisible.value = true; observer.disconnect() }
  }, { threshold: 0.1 })
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>
