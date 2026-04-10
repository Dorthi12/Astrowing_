import request from "supertest";
import app from "../../src/app.js";

describe("Authentication API", () => {
  const testUser = {
    email: "testuser@example.com",
    password: "securePassword123",
    firstName: "Test",
    lastName: "User",
  };

  let accessToken;
  let refreshToken;

  describe("POST /api/auth/register", () => {
    it("should register new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(201);

      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.tokens.accessToken).toBeDefined();
      expect(response.body.tokens.refreshToken).toBeDefined();

      accessToken = response.body.tokens.accessToken;
      refreshToken = response.body.tokens.refreshToken;
    });

    it("should fail with invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          ...testUser,
          email: "invalidemail",
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it("should fail with short password", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          ...testUser,
          password: "short",
        })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.tokens.accessToken).toBeDefined();
    });

    it("should fail with incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "wrongPassword",
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });

    it("should fail with non-existent user", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "anyPassword123",
        })
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("Protected endpoints", () => {
    it("should fail without token", async () => {
      const response = await request(app).get("/api/users/profile").expect(401);

      expect(response.body.error).toBeDefined();
    });

    it("should fail with invalid token", async () => {
      const response = await request(app)
        .get("/api/users/profile")
        .set("Authorization", "Bearer invalidToken")
        .expect(401);

      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /health", () => {
    it("should return server status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body.status).toBeDefined();
    });
  });
});
