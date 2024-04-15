import { prisma } from "../config/db";
import crypto from "crypto";
import { BadRequestException, NotFoundException } from "../config/errors";

export async function getUsers() {
  return prisma.user.findMany();
}

export async function getUser(id: number) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  return user;
}

export async function signin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const hash = crypto
    .pbkdf2Sync(password, "salt", 1000, 64, `sha512`)
    .toString(`hex`);
  if (hash !== user.password) {
    throw new BadRequestException("Invalid password");
  }

  return user;
}

export async function signup(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    throw new BadRequestException("User already exists");
  }

  const hash = crypto
    .pbkdf2Sync(password, "salt", 1000, 64, `sha512`)
    .toString(`hex`);

  return prisma.user.create({
    data: {
      email,
      password: hash,
    },
  });
}
