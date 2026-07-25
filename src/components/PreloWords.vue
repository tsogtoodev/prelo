<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { usePreloLifecycle } from '../composables/usePreloLifecycle'

/**
 * Words preloader — greetings cycle in the center of a white curtain that
 * lifts away with an elastic curved bottom edge.
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
    /** Words cycled in the center. Cycling stops on the last word. */
    words?: string[]
    /** How long the first word stays, in ms. */
    firstDelay?: number
    /** Delay between the remaining words, in ms. */
    wordDelay?: number
    /** Curtain color. */
    background?: string
    /** Word color. */
    color?: string
    /** Depth of the curved bottom edge, in px. */
    curve?: number
    /** z-index of the overlay. */
    zIndex?: number
    /** Position absolute instead of fixed, for embedding in a container. */
    absolute?: boolean
  }>(),
  {
    modelValue: undefined,
    duration: undefined,
    minDuration: 2000,
    words: () => ['Hello', 'Bonjour', 'Ciao', 'Olá', 'やあ', 'Hallå', 'Guten Tag', 'नमस्ते'],
    firstDelay: 1000,
    wordDelay: 150,
    background: '#fff',
    color: '#000',
    curve: 150,
    zIndex: 50,
    absolute: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  complete: []
}>()

/** Exit choreography (seconds) — mirrors the original framer-motion variant. */
const SLIDE_DURATION = 0.8
const SLIDE_DELAY = 0.2
const CURVE_DURATION = 0.7
const CURVE_DELAY = 0.3

const exitTotalMs = Math.max(SLIDE_DELAY + SLIDE_DURATION, CURVE_DELAY + CURVE_DURATION) * 1000 + 50

const { rendered, leaving } = usePreloLifecycle({
  modelValue: () => props.modelValue,
  duration: () => props.duration,
  minDuration: () => props.minDuration,
  exitTotalMs: () => exitTotalMs,
  onHide: () => emit('update:modelValue', false),
  onComplete: () => emit('complete'),
})

const index = ref(0)
let wordTimer: ReturnType<typeof setTimeout> | undefined

function scheduleNextWord() {
  if (index.value >= props.words.length - 1)
    return
  wordTimer = setTimeout(() => {
    index.value++
    scheduleNextWord()
  }, index.value === 0 ? props.firstDelay : props.wordDelay)
}

onMounted(scheduleNextWord)
onBeforeUnmount(() => clearTimeout(wordTimer))
</script>

<template>
  <div
    v-if="rendered"
    class="prelo-words"
    :class="{
      'prelo-words--leaving': leaving,
      'prelo-words--absolute': absolute,
    }"
    :style="{
      'zIndex': zIndex,
      '--prelo-words-bg': background,
      '--prelo-words-color': color,
      '--prelo-words-curve': `${curve}px`,
    }"
  >
    <div class="prelo-words__curve" />
    <slot :word="words[index]">
      <p class="prelo-words__word">
        {{ words[index] }}
      </p>
    </slot>
  </div>
</template>

<style>
.prelo-words {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--prelo-words-bg, #fff);
  transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1) 0.2s;
}

.prelo-words--absolute {
  position: absolute;
}

.prelo-words--leaving {
  transform: translateY(-100%);
}

.prelo-words__curve {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: var(--prelo-words-curve, 150px);
  background: var(--prelo-words-bg, #fff);
  border-radius: 0 0 50% 50% / 0 0 100% 100%;
  transition: height 0.7s cubic-bezier(0.76, 0, 0.24, 1) 0.3s;
  pointer-events: none;
}

.prelo-words--leaving .prelo-words__curve {
  height: 0;
}

.prelo-words__word {
  margin: 0;
  position: relative;
  z-index: 1;
  font-size: 3rem;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.05em;
  color: var(--prelo-words-color, #000);
  animation: prelo-words-fade-in 1s ease-out 0.2s both;
}

@media (min-width: 768px) {
  .prelo-words__word {
    font-size: 3.75rem;
  }
}

@keyframes prelo-words-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 0.75;
  }
}

@media (prefers-reduced-motion: reduce) {
  .prelo-words,
  .prelo-words__curve {
    transition-duration: 0.01s;
    transition-delay: 0s;
  }

  .prelo-words__word {
    animation-duration: 0.01s;
    animation-delay: 0s;
  }
}
</style>
