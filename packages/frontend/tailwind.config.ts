import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/components/ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/auth/components/**/*.{js,ts,jsx,tsx,mdx}'
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
        'display-lg': '4rem', // 64px
        'display-sm': '3rem', // 48px

        //Heading
        'heading-h1': '2.75rem', // 44px
        'heading-h2': '2.25rem', // 36px
        'heading-h3': '2rem', // 32px
        'heading-h4': '1.75rem', // 28px
        'heading-h5': '1.5rem', // 24px
        'heading-h6': '1.25rem', // 20px

        // Paragraph
        'paragraph-lg': '1.125rem', // 18px
        'paragraph-base': '1rem', // 16px
        'paragraph-sm': '0.875rem', // 14px
        'paragraph-xs': '0.75rem', // 12px
        'paragraph-2xs': '0.625rem' // 10px
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
        'display-lg': '4.25rem', // 68px
        'display-sm': '3.25rem', // 52px
        'heading-h1': '2.75rem', // 44px
        'heading-h2': '2.5rem', // 40px
        'heading-h3': '2.25rem', // 36px
        'heading-h4': '2rem', // 32px
        'heading-h5': '1.75rem', // 28px
        'heading-h6': '1.5rem', // 24px
        'paragraph-lg': '1.25rem', // 20px
        'paragraph-base': '1.5rem', // 24px
        'paragraph-sm': '1.25rem', // 20px
        'paragraph-xs': '1rem', // 16px
        'paragraph-2xs': '0.75rem' // 12px
      },
      colors: {
        // Neutral Dark
        'neutral-dark': {
          DEFAULT: 'hsl(0, 0%, 24%)', // #262626
          '100': 'hsl(0, 0%, 47%)', // #787878
          '200': 'hsl(0, 0%, 41%)', // #696969
          '300': 'hsl(0, 0%, 35%)', // #5A5A5A
          '400': 'hsl(0, 0%, 29%)', // #4B4B4B
          '500': 'hsl(0, 0%, 24%)', // #3C3C3C
          '600': 'hsl(0, 0%, 18%)', // #2D2D2D
          '700': 'hsl(0, 0%, 12%)', // #1E1E1E
          '800': 'hsl(0, 0%, 8%)' // #151515
        },

        // Neutral Light
        'neutral-light': {
          DEFAULT: 'hsl(217, 16%, 79%)', // #C1C7D0
          '100': 'hsl(210, 40%, 98%)', // #FAFBFC
          '200': 'hsl(220, 14%, 96%)', // #F4F5F7
          '300': 'hsl(219, 20%, 93%)', // #EBECF0
          '400': 'hsl(216, 16%, 89%)', // #DFE1E6
          '500': 'hsl(217, 16%, 79%)', // #C1C7D0
          '600': 'hsl(217, 16%, 74%)', // #B3BAC5
          '700': 'hsl(217, 16%, 69%)', // #A5ADBA
          '800': 'hsl(217, 16%, 64%)' // #97A0AF
        },

        // Error
        error: {
          DEFAULT: 'hsl(355, 90%, 60%)', // #F43F5E
          '100': 'hsl(355, 100%, 95%)', // #FFE4E6
          '200': 'hsl(355, 96%, 90%)', // #FECDD3
          '300': 'hsl(355, 96%, 82%)', // #FDA4AF
          '400': 'hsl(355, 95%, 72%)', // #FB7185
          '500': 'hsl(355, 90%, 60%)', // #F43F5E
          '600': 'hsl(355, 78%, 50%)', // #E11D48
          '700': 'hsl(355, 83%, 41%)', // #BE123C
          '800': 'hsl(355, 80%, 35%)', // #9F1239
          '900': 'hsl(355, 75%, 30%)' // #881337
        },

        // Warning
        warning: {
          DEFAULT: 'hsl(35, 92%, 50%)', // #F59E0B
          '100': 'hsl(43, 96%, 90%)', // #FEF3C7
          '200': 'hsl(43, 96%, 77%)', // #FDE68A
          '300': 'hsl(43, 96%, 65%)', // #FCD34D
          '400': 'hsl(43, 96%, 56%)', // #FBBF24
          '500': 'hsl(35, 92%, 50%)', // #F59E0B
          '600': 'hsl(35, 92%, 43%)', // #D97706
          '700': 'hsl(32, 92%, 37%)', // #B45309
          '800': 'hsl(27, 81%, 31%)', // #92400E
          '900': 'hsl(27, 77%, 26%)' // #78350F
        },

        // Success
        success: {
          DEFAULT: 'hsl(142, 71%, 53%)', // #22C55E
          '100': 'hsl(142, 76%, 93%)', // #DCFCE7
          '200': 'hsl(142, 84%, 85%)', // #BBF7D0
          '300': 'hsl(142, 84%, 73%)', // #86EFAC
          '400': 'hsl(142, 71%, 58%)', // #4ADE80
          '500': 'hsl(142, 71%, 53%)', // #22C55E
          '600': 'hsl(142, 76%, 36%)', // #16A34A
          '700': 'hsl(142, 64%, 24%)', // #166534
          '800': 'hsl(142, 61%, 20%)', // #14532D
          '900': 'hsl(142, 61%, 17%)' // #114928
        },

        // Background
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
          foreground: 'hsl(var(--primary-foreground))',
          '5': 'hsl(228, 25%, 75%)', // #AFB6CD
          '100': 'hsl(228, 31%, 65%)', // #919BBB
          '200': 'hsl(228, 31%, 56%)', // #7380A9
          '300': 'hsl(228, 31%, 46%)', // #546495
          '400': 'hsl(228, 41%, 36%)', // #364983
          '500': 'hsl(228, 41%, 31%)', // #2E3E6F
          '600': 'hsl(228, 41%, 26%)', // #26335C
          '700': 'hsl(228, 41%, 20%)', // #1E2848
          '800': 'hsl(228, 41%, 15%)', // #161D34
          '900': 'hsl(228, 41%, 9%)' // #0D1221
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          '100': 'hsl(35, 98%, 82%)', // #FEDAA5
          '200': 'hsl(35, 98%, 77%)', // #FDD18D
          '300': 'hsl(35, 97%, 72%)', // #FCC673
          '400': 'hsl(35, 97%, 67%)', // #FCBC5B
          '500': 'hsl(35, 57%, 57%)', // #D6A04D
          '600': 'hsl(35, 47%, 47%)', // #B08440
          '700': 'hsl(35, 47%, 37%)', // #8B6732
          '800': 'hsl(35, 47%, 27%)', // #654B24
          '900': 'hsl(35, 47%, 17%)' // #3F2F17
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
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config;
