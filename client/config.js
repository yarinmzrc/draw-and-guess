export const config = {
  development: {
    url: "http://127.0.0.1:5020/",
  },
  production: {
    url: import.meta.env.VITE_PRODUCTION_URL,
  },
};
