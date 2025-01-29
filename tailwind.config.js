module.exports = {
  // ... other config
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dash: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        dash: 'dash 1.5s ease-out forwards',
        slideUp: 'slideUp 0.7s ease-out',
        ripple: 'ripple 1s ease-out infinite'
      }
    }
  }
} 