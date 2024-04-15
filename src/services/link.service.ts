import { Router } from "express";
import { prisma } from "../config/db";
import { generateRandomSixCharactersString } from "../utils/generateRandomSixCharactersString";
import { BadRequestException } from "../config/errors";

const router = Router();

export async function getByOriginalUrl(originalUrl: string) {
  return prisma.link.findUnique({ where: { originalUrl } });
}

export async function getByShortUrlAndUpdateClickedAmount(shortUrl: string) {
  const link = await getLinkByShortUrl(shortUrl);
  if (link) {
    await prisma.link.update({
      where: { shortUrl },
      data: { clickedAmount: link.clickedAmount + 1 },
    });
    return link;
  }
  throw new BadRequestException("This url does not exist");
}

export async function create(originalUrl: string, userId?: number) {
  if (await getByOriginalUrl(originalUrl)) {
    throw new BadRequestException("This url already exists");
  }

  let shortUrl = generateRandomSixCharactersString();
  while (await getLinkByShortUrl(shortUrl)) {
    shortUrl = generateRandomSixCharactersString();
  }

  return prisma.link.create({
    data: {
      originalUrl,
      shortUrl,
      userId,
    },
  });
}

export async function updateExcluded(
  id: number,
  userId: number,
  excluded: boolean
) {
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) {
    throw new BadRequestException("This link does not exist");
  }

  if (link.userId !== userId) {
    throw new BadRequestException("You are not the owner of this link");
  }

  await prisma.link.update({
    where: { id },
    data: { excluded },
  });
}

export async function updateExcludedAdmin(id: number, excluded: boolean) {
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) {
    throw new BadRequestException("This link does not exist");
  }

  await prisma.link.update({
    where: { id },
    data: { excluded },
  });
}

export async function updateOriginalUrl(
  id: number,
  originalUrl: string,
  userId: number
) {
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) {
    throw new BadRequestException("This link does not exist");
  }

  if (link.userId !== userId) {
    throw new BadRequestException("You are not the owner of this link");
  }

  return prisma.link.update({
    where: { id },
    data: { originalUrl },
  });
}

async function getLinkByShortUrl(shortUrl: string) {
  return prisma.link.findUnique({ where: { shortUrl } });
}

export async function getValidLinks() {
  return prisma.link.findMany({ where: { excluded: false } });
}

export async function getLinksByUser(userId: number) {
  return prisma.link.findMany({ where: { userId } });
}

export default router;
