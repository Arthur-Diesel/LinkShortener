import { BadRequestException, NotFoundException } from "../config/errors";
import { getUsers, getUser, signin, signup } from "./user.service";
import { describe, it, expect } from "@jest/globals";
import { prismaMock } from "../config/mockDb";
import { User } from "@prisma/client";

describe("User Service", () => {
  const mockUser: User = {
    id: 1,
    email: "asdf@asdf.com",
    password: "asdf",
    createdAt: new Date(),
    updatedAt: new Date(),
    admin: false,
  };

  const mockUserWithHashedPassword: User = {
    ...mockUser,
    password:
      "0c5e07a7aefd7d06a90d3394b54841dba71ce4821ab6433bbc519e56532203ded4c3df2b70ed151c8f668aef6283a7e27ae84b0fb902a346b142f0e85e882d94",
  };

  it("should get all users", async () => {
    prismaMock.user.findMany.mockResolvedValue([mockUser]);

    const users = await getUsers();
    expect(users).toStrictEqual([mockUser]);
  });

  it("should get one user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);

    const user = await getUser(1);
    expect(user).toStrictEqual(mockUser);
  });

  it("should not found one user", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    expect(async () => await getUser(1)).rejects.toThrowError(
      NotFoundException
    );
  });

  it("should signup successful", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue(mockUserWithHashedPassword);

    const user = await signup(mockUser.email, mockUser.password);
    expect(user).toStrictEqual(mockUserWithHashedPassword);
  });

  it("should fail to signup with an 'User already exists' error", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
    expect(
      async () => await signup(mockUser.email, mockUser.password)
    ).rejects.toThrowError(BadRequestException);
  });

  it("should signin successful", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUserWithHashedPassword);

    const user = await signin(mockUser.email, mockUser.password);
    expect(user).toStrictEqual(mockUserWithHashedPassword);
  });

  it("should fail to signin with an 'User not found' error", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    expect(
      async () => await signin(mockUser.email, mockUser.password)
    ).rejects.toThrowError(NotFoundException);
  });

  it("should fail to signin with an 'Invalid password' error", async () => {
    prismaMock.user.findUnique.mockResolvedValue(mockUserWithHashedPassword);
    expect(
      async () => await signin(mockUser.email, "wrong password")
    ).rejects.toThrowError(BadRequestException);
  });
});
