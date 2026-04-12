import AOS from 'aos'
import 'aos/dist/aos.css'

export default defineNuxtPlugin((nuxtApp) => {
  AOS.init({
    duration: 1000,
    easing: 'ease-out-quart',
    once: true,
    offset: 60
  })

  nuxtApp.hook('page:finish', () => {
    AOS.refreshHard()
  })
})