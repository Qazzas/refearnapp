import packageInfo from "../../../package.json"
console.log("DEBUG: Raw packageInfo version is:", packageInfo.version)
export const APP_VERSION = packageInfo.version
