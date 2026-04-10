import AuthService from "../../src/services/AuthService.js";
import User from "../../src/models/User.js";
import bcrypt from "bcryptjs";

jest.mock("../../src/models/User");
jest.mock("bcryptjs");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should successfully register a new user", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
      };

      User.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      User.create.mockResolvedValue(mockUser);
      User.updateRefreshToken.mockResolvedValue();

      const result = await AuthService.register(
        "test@example.com",
        "password123",
        "John",
        "Doe",
      );

      expect(result.user.email).toBe("test@example.com");
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(User.create).toHaveBeenCalledWith(
        "test@example.com",
        "hashedPassword",
        "John",
        "Doe",
      );
    });

    it("should throw error if email already exists", async () => {
      User.findByEmail.mockResolvedValue({ id: 1, email: "test@example.com" });

      await expect(
        AuthService.register("test@example.com", "password123", "John", "Doe"),
      ).rejects.toThrow();
    });
  });

  describe("login", () => {
    it("should successfully login user with correct credentials", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        first_name: "John",
        last_name: "Doe",
      };

      User.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      User.updateRefreshToken.mockResolvedValue();

      const result = await AuthService.login("test@example.com", "password123");

      expect(result.user.email).toBe("test@example.com");
      expect(result.tokens.accessToken).toBeDefined();
    });

    it("should throw error with invalid credentials", async () => {
      User.findByEmail.mockResolvedValue(null);

      await expect(
        AuthService.login("test@example.com", "password123"),
      ).rejects.toThrow();
    });
  });
});
