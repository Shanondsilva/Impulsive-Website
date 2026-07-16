import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          impulsiveApp: path.resolve(__dirname, 'impulsive-app/index.html'),
          howImpulsiveWorks: path.resolve(__dirname, 'how-impulsive-works/index.html'),
          privateBehaviourChangeSupport: path.resolve(__dirname, 'private-behaviour-change-support/index.html'),
          focusMode: path.resolve(__dirname, 'focus-mode/index.html'),
          deleteAccount: path.resolve(__dirname, 'delete-account/index.html'),
          deleteAccountConfirm: path.resolve(__dirname, 'delete-account/confirm/index.html'),
        },
      },
    },
  };
});
