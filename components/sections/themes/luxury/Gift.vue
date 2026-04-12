<template>
  <section ref="sectionRef" class="luxury-gift section-enter py-20 px-6" :class="{ visible: isVisible }">
    <div class="max-w-2xl mx-auto text-center">
      <p class="font-script text-4xl text-amber-500 mb-4">Wedding Gift</p>
      
      <div class="flex items-center justify-center gap-4 mb-8">
        <div class="flex-1 h-px bg-gradient-to-r from-transparent to-amber-600/40" />
        <span class="text-2xl text-amber-500">❤️</span>
        <div class="flex-1 h-px bg-gradient-to-l from-transparent to-amber-600/40" />
      </div>

      <div v-if="freeTexts.length" class="mb-8">
        <p
          v-for="(freeText, idx) in freeTexts"
          :key="`luxury-gift-text-${idx}`"
          class="text-zinc-300 text-base leading-relaxed mb-4"
          v-html="freeText"
        />
      </div>

      <button
        v-if="bankAccounts.length"
        @click="showCards = !showCards"
        class="inline-flex items-center gap-3 bg-white text-zinc-900 font-semibold px-8 py-3 rounded-full hover:bg-zinc-100 transition-colors shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gift"><path d="M20 12v10H4V12"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
        <span>SEND GIFT</span>
      </button>

      <!-- Bank Cards Display -->
      <div v-if="showCards && bankAccounts.length" class="mt-12 max-w-2xl mx-auto" data-aos="fade-in">
        <div class="grid grid-cols-1 gap-8">
          <div
            v-for="account in bankAccounts"
            :key="account.id"
            class="relative w-full bank-card rounded-2xl p-6 shadow-lg aspect-[1.586/1] flex flex-col justify-between"
          >
            <div class="flex justify-between items-start">
              <!-- Bank Logo -->
              <div class="text-2xl font-bold text-zinc-800">{{ account.bankName }}</div>
              <!-- Chip placeholder -->
              <div class="w-12 h-10 bg-yellow-400 rounded-md border-2 border-yellow-500/80" />
            </div>

            <div class="text-zinc-800 text-left">
              <!-- Account Number -->
              <p class="text-zinc-600 text-xs font-semibold uppercase tracking-wider mb-1">No Rekening</p>
              <p class="font-mono text-lg font-bold tracking-wider mb-4">{{ formatAccountNumber(account.accountNumber) }}</p>

              <!-- Account Holder -->
              <p class="text-zinc-600 text-xs font-semibold uppercase tracking-wider mb-1">Atas Nama</p>
              <p class="font-semibold text-base uppercase">{{ account.accountHolder }}</p>
            </div>
            
            <!-- Copy Button Inside Card -->
            <button
              @click.stop="copyNumber(account.accountNumber)"
              class="absolute bottom-5 right-6 text-zinc-700 hover:text-zinc-900 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>{{ copied === account.accountNumber ? 'COPIED' : 'SALIN' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import AOS from 'aos'

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountHolder: string
  qrCode?: string
}

const props = defineProps<{
  bankAccounts: BankAccount[]
  freeTexts?: string[]
}>()

const sectionRef = ref<HTMLElement>()
const isVisible = ref(false)
const showCards = ref(false)
const copied = ref('')

const freeTexts = computed(() => props.freeTexts || [])

watch(showCards, (isShowing) => {
  if (isShowing) {
    nextTick(() => {
      AOS.refresh()
    })
  }
})

function formatAccountNumber(num: string): string {
  const digits = num.replace(/\D/g, '')
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

async function copyNumber(num: string) {
  await navigator.clipboard.writeText(num).catch(() => {})
  copied.value = num
  setTimeout(() => {
    copied.value = ''
  }, 2000)
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.1 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<style scoped>
.luxury-gift {
  background:
    radial-gradient(circle at 10% 15%, rgba(193, 149, 65, 0.14), transparent 35%),
    radial-gradient(circle at 82% 80%, rgba(193, 149, 65, 0.1), transparent 35%),
    #000;
}

.bank-card {
  background-color: #ffffff;
  background-image:
    /* Dotted grid pattern */
    url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1' fill='%23E5E7EB'/%3E%3C/svg%3E"),
    /* Large faint circles */
    url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='300' r='80' fill='%23F3F4F6'/%3E%3Ccircle cx='350' cy='150' r='100' fill='%23F3F4F6'/%3E%3C/svg%3E");
  background-repeat: repeat, no-repeat;
  background-position: bottom 1rem right 1rem, center;
  background-size: 12px, cover;
}
</style>
