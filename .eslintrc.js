module.exports = {
  extends: [
    'next/core-web-vitals', // Configuración de ESLint recomendada para Next.js
    'plugin:jsx-a11y/recommended' // Agrega las reglas recomendadas para accesibilidad
  ],
  plugins: ['jsx-a11y'], // Activa el plugin de accesibilidad
  rules: {
    // Aquí puedes agregar reglas personalizadas de accesibilidad si lo deseas
    'jsx-a11y/alt-text': ['warn', { elements: ['img', 'area', 'input[type="image"]'] }],
    'jsx-a11y/anchor-is-valid': 'warn',
  },
};
