import debug from "debug";

export const debugApi = debug("link-shortener:api");
export const jwtSecret: string = String(process.env.JWT_SECRET) || "jwtSecret";
