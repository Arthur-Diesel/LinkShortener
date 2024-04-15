import debug from "debug";

export const debugApi = debug("api");
export const jwtSecret: string = String(process.env.JWT_SECRET) || "jwtSecret";
