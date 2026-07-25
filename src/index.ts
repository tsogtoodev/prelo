import type { App, Plugin } from 'vue'
import PreloStairs from './components/PreloStairs.vue'
import PreloWords from './components/PreloWords.vue'

export { PreloStairs, PreloWords }

export const prelo: Plugin = {
  install(app: App) {
    app.component('PreloStairs', PreloStairs)
    app.component('PreloWords', PreloWords)
  },
}

export default prelo
