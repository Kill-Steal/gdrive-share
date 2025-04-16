import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
  // your Vuetify options here
  theme: {
    defaultTheme: 'light',
  },
  defaults: {
    VAutocomplete: {
      variant: 'outlined',
      density: 'compact',
    },
  },
})
