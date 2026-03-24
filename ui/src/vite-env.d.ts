/// <reference types="vite/client" />

declare module "store/dist/store.modern" {
  const store: import("store").StoreJsAPI;
  export default store;
}