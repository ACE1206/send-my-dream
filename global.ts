declare global {
    var GLOBAL_URL: string;
    var API_URL: string;
}

globalThis.GLOBAL_URL = "https://sendmydream.com";
globalThis.API_URL = `${GLOBAL_URL}/api`;

export {};
