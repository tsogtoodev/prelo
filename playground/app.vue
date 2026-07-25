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
    <PreloStairs v-if="active === 'stairs'" :key="`stairs-${playKey}`" />
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
  background: #fff;
  color: #000;
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
