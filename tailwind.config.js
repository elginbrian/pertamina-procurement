/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'base-ink': 'var(--base-ink)',
        
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          active: 'var(--primary-active)',
          text: 'var(--primary-text)',
          start: 'var(--primary-start)',
          end: 'var(--primary-end)',
        },
        
        success: 'var(--success)',
        warning: 'var(--warning)',
        info: 'var(--info)',
        alert: 'var(--alert)',
        notice: 'var(--notice)',
        
        'bg-success': 'var(--bg-success)',
        'bg-warning': 'var(--bg-warning)',
        'bg-info': 'var(--bg-info)',
        'bg-alert': 'var(--bg-alert)',
        'bg-notice': 'var(--bg-notice)',
        
        sidebar: {
          background: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
        },
        
        border: 'var(--border)',
        input: 'var(--input)',
      },
      
      transitionProperty: {
        smooth: 'var(--transition-smooth)',
      },
      
      boxShadow: {
        elegant: 'var(--shadow-elegant)',
        glass: 'var(--shadow-glass)',
        drop: 'var(--shadow-drop)',
      },
    },
  },
  plugins: [],
}
