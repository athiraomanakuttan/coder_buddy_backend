// src/session.d.ts or src/types/session.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    OTP?: number;  
  }
}
