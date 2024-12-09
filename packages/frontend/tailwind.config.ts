import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/typography/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-lato)', ...fontFamily.sans]
      },
      fontSize: {
        // Custom font sizes
        // Display
        'display-lg': ['4rem', { lineHeight: '4.5rem' }], // 64px
        'display-sm': ['3rem', { lineHeight: '3.5rem' }], // 48px

        //Heading
        'heading-h1': ['2.625rem', { lineHeight: '3rem' }], // 42px
        'heading-h2': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        'heading-h3': ['1.875rem', { lineHeight: '2.25rem' }], // 32px
        'heading-h4': ['1.75rem', { lineHeight: '2.25rem' }], // 28px
        'heading-h5': ['1.5rem', { lineHeight: '2rem' }], // 24px
        'heading-h6': ['1.25rem', { lineHeight: '1.75rem' }], // 20px

        // Paragraph
        'paragraph-lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'paragraph-base': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'paragraph-sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'paragraph-xs': ['0.75rem', { lineHeight: '1rem' }], // 12px
        'paragraph-2xs': ['0.625rem', { lineHeight: '0.75rem' }] // 10px
      },
      spacing: {
        // Custom spacing scale
        0.5: '0.125rem', // 2px
        1: '0.25rem', // 4px
        1.5: '0.375rem', // 6px
        2: '0.5rem', // 8px
        2.5: '0.625rem', // 10px
        3: '0.75rem', // 12px
        4: '1rem', // 16px
        5: '1.25rem', // 20px
        6: '1.5rem', // 24px
        8: '2rem', // 32px
        10: '2.5rem', // 40px
        12: '3rem', // 48px
        16: '4rem' // 64px
      },
      fontWeight: {
        // Custom font weights
        light: '100',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '900'
      },
      lineHeight: {
        // Custom line heights
        normal: '1.5', // 24px
        none: '1', // 16px
        tight: '1.25', // 20px
        snug: '1.375', // 22px
        comfortable: '1.625' // 26px
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config;
