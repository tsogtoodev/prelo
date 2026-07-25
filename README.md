# @tsogtoodev/prelo

Preloading animations for Vue & Nuxt.

## Variations

| Component | Description |
| --- | --- |
| `PreloStairs` | Full-screen columns collapse upward right-to-left like stairs, revealing the page, while a headline fades in word by word. |
| `PreloWords` | Greetings cycle in the center of a white curtain that lifts away with an elastic curved bottom edge. |

## Install

```bash
pnpm add @tsogtoodev/prelo
```

## Usage — Nuxt

Add the module; components are auto-imported and styles are injected:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@tsogtoodev/prelo/nuxt'],
})
```

```vue
<template>
  <div>
    <PreloStairs />
    <main>Your landing page</main>
  </div>
</template>
```

## Usage — Vue

```ts
import { createApp } from 'vue'
import prelo from '@tsogtoodev/prelo'
import '@tsogtoodev/prelo/style.css'
import App from './App.vue'

createApp(App).use(prelo).mount('#app')
```

Or import a component directly:

```vue
<script setup>
import { PreloStairs } from '@tsogtoodev/prelo'
import '@tsogtoodev/prelo/style.css'
</script>
```

## True preloader behavior

By default every prelo component acts as a real preloader:

- It renders with the server response, so it covers the page from the very
  first paint (the entrance animations are pure CSS and start immediately).
- It starts its reveal animation once the app has **fully loaded** — in Nuxt,
  after the initial suspense resolves (hydration + async data) *and* the
  window `load` event has fired; in plain Vue, on window `load`.
- `minDuration` guarantees the animation gets its moment even when the app
  loads instantly.

Alternatively, pass `duration` for a fixed timer, or `v-model` for full
manual control:

```vue
<!-- True preloader: reveals when the app has loaded (default) -->
<PreloStairs @complete="onRevealed" />

<!-- Fixed timer: hides after 2.5s regardless of load state -->
<PreloStairs :duration="2500" />

<!-- Controlled: you decide when loading ends -->
<PreloStairs v-model="loading" />
```

## `PreloStairs`

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | Controlled visibility. Leave unset for auto-hide. |
| `duration` | `number` | `undefined` | Fixed auto-hide delay in ms. Unset = hide when the app has fully loaded. |
| `minDuration` | `number` | `2500` | Minimum visible time in ms when waiting for the app to load. |
| `text` | `string` | `'The first-ever AGI. Period.'` | Headline; words fade in one by one. |
| `columns` | `number` | `5` | Number of stair columns. |
| `background` | `string` | `'#000'` | Column color. |
| `color` | `string` | `'#fff'` | Headline color. |
| `zIndex` | `number` | `50` | Overlay z-index. |
| `absolute` | `boolean` | `false` | Position `absolute` instead of `fixed`, for embedding in a container. |

### Events

| Event | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Emitted when the auto-hide timer fires. |
| `complete` | — | Emitted after the exit animation finishes and the overlay unmounts. |

### Slots

| Slot | Description |
| --- | --- |
| default | Replaces the headline with custom content (logo, spinner, …). |

## `PreloWords`

Greetings cycle in the center — the first word holds for `firstDelay` ms, then
the rest advance every `wordDelay` ms, stopping on the last word. On exit the
curtain slides up with a curved bottom edge that flattens as it leaves.

```vue
<!-- True preloader: reveals when the app has loaded (default) -->
<PreloWords @complete="onRevealed" />

<!-- Controlled, custom words -->
<PreloWords v-model="loading" :words="['Sain uu', 'Hello', 'Ciao']" />
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | Controlled visibility. Leave unset for auto-hide. |
| `duration` | `number` | `undefined` | Fixed auto-hide delay in ms. Unset = hide when the app has fully loaded. |
| `minDuration` | `number` | `2000` | Minimum visible time in ms when waiting for the app to load. |
| `words` | `string[]` | multilingual greetings | Words cycled in the center; cycling stops on the last word. |
| `firstDelay` | `number` | `1000` | How long the first word stays, in ms. |
| `wordDelay` | `number` | `150` | Delay between the remaining words, in ms. |
| `background` | `string` | `'#fff'` | Curtain color. |
| `color` | `string` | `'#000'` | Word color. |
| `curve` | `number` | `150` | Depth of the curved bottom edge, in px. |
| `zIndex` | `number` | `50` | Overlay z-index. |
| `absolute` | `boolean` | `false` | Position `absolute` instead of `fixed`, for embedding in a container. |

### Events

Same as `PreloStairs`: `update:modelValue` and `complete`.

### Slots

| Slot | Props | Description |
| --- | --- | --- |
| default | `{ word: string }` | Replaces the cycling word with custom content. |

## Development

```bash
pnpm install
pnpm dev        # Nuxt playground at http://localhost:3000
pnpm build      # build the library to dist/
```
