<script setup lang="ts">
import { computed } from 'vue'
import { usePreloLifecycle } from '../composables/usePreloLifecycle'

/**
 * Stairs preloader — full-screen columns collapse upward right-to-left,
 * revealing the page underneath, while a headline fades in word by word.
 */
const props = withDefaults(
  defineProps<{
    /**
     * Controlled visibility. Leave unset for uncontrolled mode, where the
     * preloader hides itself once the app has fully loaded (or after
     * `duration` ms when set).
     */
    modelValue?: boolean
    /**
     * Fixed auto-hide delay in ms. Leave unset for true-preloader mode:
     * hide once the app has fully loaded (in Nuxt, after hydration and the
     * window `load` event).
     */
    duration?: number
    /** Minimum visible time in ms when waiting for the app to load. */
    minDuration?: number
    /** Headline shown while loading. Words fade in one by one. */
    text?: string
    /** Number of stair columns. */
    columns?: number
    /** Column color. */
    background?: string
    /** Headline color. */
    color?: string
    /** z-index of the overlay. */
    zIndex?: number
    /** Position absolute instead of fixed, for embedding in a container. */
    absolute?: boolean
  }>(),
  {
    modelValue: undefined,
    duration: undefined,
    minDuration: 2500,
    text: 'The first-ever AGI. Period.',
    columns: 5,
    background: '#000',
    color: '#fff',
    zIndex: 50,
    absolute: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  complete: []
}>()

/** Exit choreography (seconds) — mirrors the original framer-motion variant. */
const COLUMN_EXIT_DURATION = 0.5
const COLUMN_EXIT_STAGGER = 0.05
const COLUMN_EXIT_BASE_DELAY = 0.4
const TEXT_EXIT_DURATION = 0.6

const words = computed(() => props.text.split(' ').filter(Boolean))

const exitTotalMs = computed(() => {
  const columnsTotal
    = COLUMN_EXIT_BASE_DELAY
      + COLUMN_EXIT_STAGGER * (props.columns - 1)
      + COLUMN_EXIT_DURATION
  return Math.max(columnsTotal, TEXT_EXIT_DURATION) * 1000 + 50
})

/** Right-to-left stagger: the last column leaves first. */
function columnExitDelay(index: number): string {
  return `${COLUMN_EXIT_BASE_DELAY + COLUMN_EXIT_STAGGER * (props.columns - 1 - index)}s`
}

const { rendered, leaving } = usePreloLifecycle({
  modelValue: () => props.modelValue,
  duration: () => props.duration,
  minDuration: () => props.minDuration,
  exitTotalMs: () => exitTotalMs.value,
  onHide: () => emit('update:modelValue', false),
  onComplete: () => emit('complete'),
})
</script>

<template>
  <div
    v-if="rendered"
    class="prelo-stairs"
    :class="{
      'prelo-stairs--leaving': leaving,
      'prelo-stairs--absolute': absolute,
    }"
    :style="{
      'zIndex': zIndex,
      '--prelo-bg': background,
      '--prelo-color': color,
    }"
  >
    <div class="prelo-stairs__text">
      <slot>
        <h1 class="prelo-stairs__title">
          <span
            v-for="(word, i) in words"
            :key="i"
            class="prelo-stairs__word"
            :style="{ animationDelay: `${0.2 * i}s` }"
          >{{ word }}</span>
        </h1>
      </slot>
    </div>
    <div class="prelo-stairs__columns">
      <div
        v-for="i in columns"
        :key="i"
        class="prelo-stairs__column"
        :style="{ transitionDelay: leaving ? columnExitDelay(i - 1) : '0s' }"
      />
    </div>
  </div>
</template>

<style>
.prelo-stairs {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.prelo-stairs--absolute {
  position: absolute;
}

.prelo-stairs__columns {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
}

.prelo-stairs__column {
  height: 100%;
  flex: 1 1 0%;
  background: var(--prelo-bg, #000);
  transition: height 0.5s cubic-bezier(0.33, 1, 0.68, 1);
}

.prelo-stairs--leaving .prelo-stairs__column {
  height: 0;
}

.prelo-stairs__text {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--prelo-color, #fff);
  transition: opacity 0.6s ease;
}

.prelo-stairs--leaving .prelo-stairs__text {
  opacity: 0;
}

.prelo-stairs__title {
  margin: 0;
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 600;
  letter-spacing: -0.05em;
  animation: prelo-fade-in 4s ease-out both;
}

.prelo-stairs__word {
  display: inline-block;
  margin-right: 0.5rem;
  animation: prelo-fade-in 1s ease-out both;
}

@keyframes prelo-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .prelo-stairs__column,
  .prelo-stairs__text {
    transition-duration: 0.01s;
    transition-delay: 0s !important;
  }

  .prelo-stairs__title,
  .prelo-stairs__word {
    animation-duration: 0.01s;
    animation-delay: 0s !important;
  }
}
</style>
