// Replace 192.168.1.100 with your machine's actual LAN IP (run `ipconfig` or `ifconfig`).
const DEV_URL = "http://192.168.1.100:8000";

// TODO: Replace with production URL when deploying.
const PROD_URL = "";

export const API_BASE_URL: string = __DEV__ ? DEV_URL : PROD_URL;
