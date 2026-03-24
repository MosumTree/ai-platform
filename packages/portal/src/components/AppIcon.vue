<!-- Spec: specs/portal/home.spec.md -->
<template>
  <span
    v-if="resolvedIcon.kind === 'material'"
    class="app-icon material-symbols-rounded"
    aria-hidden="true"
    :style="iconStyle"
  >
    {{ resolvedIcon.value }}
  </span>
  <span
    v-else
    class="app-icon app-icon--text"
    aria-hidden="true"
    :style="iconStyle"
  >
    {{ resolvedIcon.value }}
  </span>
</template>

<script setup lang="ts">
// Spec: specs/portal/home.spec.md
import { computed } from 'vue'
import type { PortalIconMode } from '@/utils/portalIcon'
import { resolvePortalIcon } from '@/utils/portalIcon'

const props = withDefaults(defineProps<{
  name?: string | null
  fallback?: string
  mode?: PortalIconMode
  size?: number | string
}>(), {
  name: '',
  fallback: 'help',
  mode: 'auto',
})

const resolvedIcon = computed(() => resolvePortalIcon(props.name, {
  fallback: props.fallback,
  mode: props.mode,
}))
const iconStyle = computed(() => {
  if (props.size == null) return undefined

  return {
    fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
  }
})
</script>

<style scoped>
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.material-symbols-rounded {
  font-family: 'Material Symbols Rounded';
  font-weight: 400;
  font-style: normal;
  letter-spacing: normal;
  text-transform: none;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

.app-icon--text {
  font-family: inherit;
}
</style>
