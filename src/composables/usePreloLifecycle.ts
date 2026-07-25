import type { ComponentInternalInstance } from 'vue'
import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface PreloLifecycleOptions {
  /** Current `modelValue` prop; `undefined` means uncontrolled. */
  modelValue: () => boolean | undefined
  /**
   * Fixed auto-hide delay in ms. `undefined` means true-preloader mode:
   * hide once the app has fully loaded (see `whenAppLoaded`).
   */
  duration: () => number | undefined
  /** Minimum visible time in ms when waiting for the app to load. */
  minDuration: () => number
  /** How long the exit animation takes before the overlay can unmount. */
  exitTotalMs: () => number
  /** Called when the overlay decides to hide (emit `update:modelValue`). */
  onHide: () => void
  /** Called after the exit animation finishes and the overlay unmounts. */
  onComplete: () => void
}

/**
 * Shared show → leave → unmount choreography for prelo overlays.
 *
 * `rendered` keeps the overlay in the DOM through the exit animation;
 * `leaving` drives the exit CSS.
 */
export function usePreloLifecycle(options: PreloLifecycleOptions) {
  const instance = getCurrentInstance()

  const controlled = computed(() => options.modelValue() !== undefined)
  const internalShow = ref(true)
  const visible = computed(() =>
    controlled.value ? options.modelValue() !== false : internalShow.value,
  )

  const rendered = ref(true)
  const leaving = ref(false)

  let disposed = false
  let hideTimer: ReturnType<typeof setTimeout> | undefined
  let exitTimer: ReturnType<typeof setTimeout> | undefined

  onMounted(() => {
    if (controlled.value)
      return

    const hide = () => {
      internalShow.value = false
      options.onHide()
    }

    const duration = options.duration()
    if (duration != null) {
      if (duration > 0)
        hideTimer = setTimeout(hide, duration)
    }
    else {
      const shownAt = Date.now()
      whenAppLoaded(instance).then(() => {
        if (disposed)
          return
        const remaining = Math.max(0, options.minDuration() - (Date.now() - shownAt))
        hideTimer = setTimeout(hide, remaining)
      })
    }
  })

  watch(visible, (value) => {
    if (!value && rendered.value && !leaving.value) {
      leaving.value = true
      exitTimer = setTimeout(() => {
        leaving.value = false
        rendered.value = false
        options.onComplete()
      }, options.exitTotalMs())
    }
    else if (value) {
      clearTimeout(exitTimer)
      leaving.value = false
      rendered.value = true
    }
  })

  onBeforeUnmount(() => {
    disposed = true
    clearTimeout(hideTimer)
    clearTimeout(exitTimer)
  })

  return { rendered, leaving }
}

/**
 * Resolves once the surrounding app has fully loaded.
 *
 * In a Nuxt app this waits for the initial suspense to resolve (hydration and
 * async data done), then for the window `load` event (all assets fetched).
 * In a plain Vue app only the `load` event applies. Resolves immediately when
 * everything already happened.
 */
function whenAppLoaded(instance: ComponentInternalInstance | null): Promise<void> {
  return (async () => {
    // Detect Nuxt the same way useNuxtApp() falls back: the NuxtApp instance
    // is exposed on the Vue app as `$nuxt`.
    const nuxtApp = (instance?.appContext.app as any)?.$nuxt
    if (nuxtApp?.isHydrating) {
      await new Promise<void>((resolve) => {
        if (typeof nuxtApp.hooks?.hookOnce === 'function')
          nuxtApp.hooks.hookOnce('app:suspense:resolve', () => resolve())
        else
          nuxtApp.hook('app:suspense:resolve', () => resolve())
      })
    }
    if (typeof document !== 'undefined' && document.readyState !== 'complete') {
      await new Promise<void>((resolve) => {
        window.addEventListener('load', () => resolve(), { once: true })
      })
    }
  })()
}
