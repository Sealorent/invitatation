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

        <!-- View Bank Card Button -->
        <button
          @click="selectedBank = account"
          class="btn-outline mt-2 text-sm"
        >
          💳 View Bank Card
        </button>
      </div>
    </div>

    <div v-if="bankAccounts.length === 0" class="text-center text-gray-400 py-8 text-sm">No bank account info provided</div>

    <!-- Bank Card Modal -->
    <div
      v-if="selectedBank"
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      @click="selectedBank = null"
    >
      <div
        class="bg-gradient-to-br from-rose-900/80 via-rose-800/70 to-rose-900/80 backdrop-blur rounded-3xl p-8 max-w-sm border border-rose-700/50 shadow-2xl"
        @click.stop
      >
        <button
          class="absolute top-4 right-4 text-white text-2xl hover:text-rose-200 transition"
          @click="selectedBank = null"
        >
          ✕
        </button>
        <div class="text-center">
          <div class="text-5xl mb-4">💳</div>
          <h3 class="font-serif text-2xl font-semibold text-rose-100 mb-2">{{ selectedBank.bankName }}</h3>
          <p class="text-rose-200 text-sm mb-4">Account Number</p>
          <p class="font-mono text-2xl font-bold tracking-widest text-white bg-black/30 py-3 px-4 rounded-lg mb-4">{{ selectedBank.accountNumber }}</p>
          <p class="text-rose-100 mb-2">Account Holder</p>
          <p class="text-white font-semibold mb-6">{{ selectedBank.accountHolder }}</p>
          <button
            @click.stop="copyNumber(selectedBank.accountNumber)"
            class="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            {{ copied === selectedBank.accountNumber ? '✅ Copied!' : '📋 Copy Number' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface BankAccount { id: string; bankName: string; accountNumber: string; accountHolder: string; qrCode?: string }
defineProps<{ bankAccounts: BankAccount[] }>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const copied = ref('')
const selectedBank = ref<BankAccount | null>(null)

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
