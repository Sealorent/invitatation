<template>
  <div class="quill-input">
    <div ref="editorRef" />
  </div>
</template>

<script setup lang="ts">
import 'quill/dist/quill.snow.css'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
}>(), {
  placeholder: 'Write additional information...'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLElement | null>(null)
let quill: any = null

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean']
  ]
}

onMounted(async () => {
  if (!editorRef.value) return

  const { default: Quill } = await import('quill')
  quill = new Quill(editorRef.value, {
    theme: 'snow',
    modules,
    placeholder: props.placeholder
  })

  quill.root.innerHTML = props.modelValue || ''
  quill.on('text-change', () => {
    emit('update:modelValue', quill.root.innerHTML || '')
  })
})

watch(() => props.modelValue, (value) => {
  if (!quill) return
  const next = value || ''
  if (quill.root.innerHTML !== next) {
    quill.root.innerHTML = next
  }
})
</script>

<style scoped>
.quill-input :deep(.ql-toolbar.ql-snow) {
  border-color: #fbcfe8;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

.quill-input :deep(.ql-container.ql-snow) {
  border-color: #fbcfe8;
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
}

.quill-input :deep(.ql-editor) {
  min-height: 110px;
  font-size: 0.9rem;
}
</style>
