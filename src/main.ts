/**
 * Vue Application Entry Point
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

export const app = createApp(App);

app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err, info);
  document.body.innerHTML = `<div style="padding:30px;color:red;font-family:monospace;background:#fff;border:2px solid red;margin:20px;border-radius:8px"><h2>❌ Vue Runtime Error</h2><pre>${err instanceof Error ? err.stack : String(err)}\n\nInfo: ${info}</pre></div>`;
};

try {
  app.use(store);
  app.use(router);

  // Mount when router is ready  
  router.isReady().then(() => {
    app.mount('#app');
    console.log('%c✅ App mounted successfully!', 'color: green; font-size: 14px; font-weight: bold;');
  }).catch(error => {
    console.error('%c❌ Router error:', 'color: red; font-size: 14px', error);
    document.body.innerHTML = `
      <div style="padding: 40px; color: red; font-family: sans-serif; background: #ffe0e0; border: 2px solid red; border-radius: 8px; margin: 20px;">
        <h2>❌ Router Initialization Error</h2>
        <pre style="overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">${error instanceof Error ? error.message + '\n' + error.stack : String(error)}</pre>
      </div>
    `;
  });
} catch (error) {
  console.error('%c❌ Failed to initialize app:', 'color: red; font-size: 14px', error);
  document.body.innerHTML = `
    <div style="padding: 40px; color: red; font-family: sans-serif; background: #ffe0e0; border: 2px solid red; border-radius: 8px; margin: 20px;">
      <h2>❌ Initialization Error</h2>
      <pre style="overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">${error instanceof Error ? error.message + '\n' + error.stack : String(error)}</pre>
    </div>
  `;
}
