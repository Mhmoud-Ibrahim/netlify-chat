/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // أضف هنا أي متغيرات بيئة أخرى تستخدمها
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
