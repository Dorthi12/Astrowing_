import User from "../../src/models/User.js";
import db from "../../src/config/database.js";

jest.mock("../../src/config/database");

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findByEmail", () => {
    it("should return user when found", async () => {
      const mockUser = { id: 1, email: "test@example.com", password: "hash" };
      db.query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.findByEmail("test@example.com");

      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = $1",
        ["test@example.com"],
      );
    });

    it("should return undefined when user not found", async () => {
      db.query.mockResolvedValue({ rows: [] });

      const result = await User.findByEmail("notfound@example.com");

      expect(result).toBeUndefined();
    });
  });

  describe("findById", () => {
    it("should return user by id", async () => {
      const mockUser = { id: 1, email: "test@example.com", first_name: "John" };
      db.query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.findById(1);

      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should create new user", async () => {
      const mockUser = {
        id: 1,
        email: "test@example.com",
        first_name: "John",
        last_name: "Doe",
      };
      db.query.mockResolvedValue({ rows: [mockUser] });

      const result = await User.create(
        "test@example.com",
        "hashedPassword",
        "John",
        "Doe",
      );

      expect(result).toEqual(mockUser);
      expect(db.query).toHaveBeenCalled();
    });
  });
});
