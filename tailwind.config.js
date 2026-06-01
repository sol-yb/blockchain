module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        night: '#0B0F1A',
        twilight: '#1B1F3F',
        neon: '#C14FFF',
        violet: '#8B5CF6',
        glass: 'rgba(255,255,255,0.08)'
      },
      boxShadow: {
        soft: '0 20px 40px rgba(0,0,0,0.18)',
        glow: '0 0 30px rgba(193,79,255,0.2)'
      }
    }
  },
  plugins: []
};
