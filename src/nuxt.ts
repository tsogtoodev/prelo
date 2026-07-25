import type { NuxtModule } from '@nuxt/schema'
import { existsSync } from 'node:fs'
import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit'

const module: NuxtModule = defineNuxtModule({
  meta: {
    name: '@tsogtoodev/prelo',
    configKey: 'prelo',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  setup(_options, nuxt) {
    for (const name of ['PreloStairs', 'PreloWords']) {
      addComponent({
        name,
        export: name,
        filePath: '@tsogtoodev/prelo',
      })
    }

    // In the published package the stylesheet sits next to this file; when
    // the module runs from source the styles ship inside the SFC instead.
    const resolver = createResolver(import.meta.url)
    const css = resolver.resolve('./prelo.css')
    if (existsSync(css) && !nuxt.options.css.includes(css))
      nuxt.options.css.push(css)
  },
})

export default module
