<script setup lang="ts">
const active = ref<'stairs' | 'words'>('words')
const playKey = ref(0)

function play(variant: 'stairs' | 'words') {
  active.value = variant
  playKey.value++
}
</script>

<template>
  <div>
    <PreloStairs
      v-if="active === 'stairs'"
      :key="`stairs-${playKey}`"
      :blur="12"
      :transparency="40"
    />
    <PreloWords v-else-if="active === 'words'" :key="`words-${playKey}`" />
    <main class="landing">
      <p>Your crazy Landing page</p>
      <div class="row">
        <button class="replay" @click="play('stairs')">
          Replay stairs
        </button>
        <button class="replay" @click="play('words')">
          Replay words
        </button>
      </div>
    </main>
  </div>
</template>

<style>
html,
body {
  margin: 0;
}

body {
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
  background: #fff;
}

.landing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  min-height: 100dvh;
  color: #fff;
  /* Busy test wallpaper: gradients + fine stripes make blur seams obvious. */
  background:
    repeating-linear-gradient(
      45deg,
      rgb(255 255 255 / 25%) 0 2px,
      transparent 2px 14px
    ),
    radial-gradient(circle at 20% 30%, #ff6b6b, transparent 45%),
    radial-gradient(circle at 80% 20%, #4ecdc4, transparent 45%),
    radial-gradient(circle at 65% 80%, #ffe66d, transparent 40%),
    radial-gradient(circle at 30% 75%, #a78bfa, transparent 45%),
    linear-gradient(135deg, #1a1a2e, #16213e);
}

.landing > p {
  font-size: 1.5rem;
  font-weight: 600;
  text-shadow: 0 1px 8px rgb(0 0 0 / 40%);
}

.row {
  display: flex;
  gap: 0.75rem;
}

.replay {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 999px;
  background: #fff;
  font: inherit;
  font-size: 0.875rem;
  cursor: pointer;
}

.replay:hover {
  background: #f5f5f5;
}
</style>
