import { describe, it, expect } from "bun:test";
import { userService } from "../../../lib/userService";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

describe("generateToken", () => {
  it("should return a valid token", () => {
    const token = userService.generateToken("user-123");
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    expect(decoded.userId).toBe("user-123");
  });

  it("should expire in 7 days", () => {
    const token = userService.generateToken("user-123");
    const decoded = jwt.decode(token) as any;

    const sevenDays = 7 * 24 * 60 * 60;
    const diff = decoded.exp - decoded.iat;

    expect(diff).toBe(sevenDays);
  });
});
describe("verifyToken", () => {
  it("should return the payload for a valid token", () => {
    const token = userService.generateToken("user-123");
    const result = userService.verifyToken(token);

    expect(result?.userId).toBe("user-123");
  });

  it("should return null for a tampered token", () => {
    const result = userService.verifyToken("invalid.token.here");

    expect(result).toBeNull();
  });

  it("should return null for an expired token", () => {
    const expired = jwt.sign({ userId: "user-123" }, JWT_SECRET, {
      expiresIn: "0s",
    });
    const result = userService.verifyToken(expired);

    expect(result).toBeNull();
  });
});
