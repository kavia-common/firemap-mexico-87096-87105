import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'

// PUBLIC_INTERFACE
export function createAppVuetify() {
  /**
   * Create and configure Vuetify instance for the app with the
   * Ocean Professional theme and requested header background color (#CDD9BA).
   * Uses Open Sans as the preferred font via CSS variable fallback from index.html.
   */
  const oceanProfessional: ThemeDefinition = {
    dark: false,
    colors: {
      primary: '#2563EB',
      secondary: '#F59E0B',
      success: '#22c55e',
      warning: '#F59E0B',
      error: '#EF4444',
      background: '#FFFDD0',
      surface: '#ffffff',
      // custom role used for header bg
      header: '#CDD9BA',
      onBackground: '#000000',
      onSurface: '#000000',
    },
    variables: {
      // prefer Open Sans font
      'font-family': "var(--open-sans-stack, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif)",
    },
  }

  return createVuetify({
    theme: {
      defaultTheme: 'oceanProfessional',
      themes: { oceanProfessional },
    },
    // use default icon set to avoid extra peer dependency installs
    defaults: {
      VAppBar: {
        color: 'header',
        density: 'comfortable',
        flat: false,
        elevation: 1,
        class: 'text-black',
      },
      VBtn: {
        color: 'primary',
        variant: 'flat',
      },
      VCard: {
        elevation: 2,
        rounded: 'lg',
      },
      VCarousel: {
        hideDelimiters: false,
        height: 360,
        cycle: true,
        interval: 6000,
      },
    },
  })
}

export default createAppVuetify
