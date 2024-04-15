import { BadRequestException } from "../config/errors";
import { describe, it, expect } from "@jest/globals";
import { prismaMock } from "../config/mockDb";
import { User, Link } from "@prisma/client";
import {
  getByShortUrlAndUpdateClickedAmount,
  create,
  updateExcluded,
  updateExcludedAdmin,
  updateOriginalUrl,
  getValidLinks,
  getLinksByUser,
} from "./link.service";

describe("Link Service", () => {
  const mockUser: User = {
    id: 1,
    email: "asdf@asdf.com",
    password: "asdf",
    createdAt: new Date(),
    updatedAt: new Date(),
    admin: false,
  };

  const mockAdminUser = {
    ...mockUser,
    admin: true,
  };

  const mockLink: Link = {
    id: 1,
    originalUrl: "https://google.com",
    shortUrl: "abc123",
    createdAt: new Date(),
    updatedAt: new Date(),
    clickedAmount: 0,
    userId: null,
    excluded: false,
    excludedAt: null,
  };

  const mockLinkWithUserId: Link = {
    ...mockLink,
    userId: mockUser.id,
  };

  const mockLinkExcluded: Link = {
    ...mockLink,
    excluded: true,
    excludedAt: new Date(),
  };

  it("should get all valid links", async () => {
    prismaMock.link.findMany.mockResolvedValue([mockLink]);

    const links = await getValidLinks();
    expect(links).toStrictEqual([mockLink]);
  });

  it("should get all links by user", async () => {
    prismaMock.link.findMany.mockResolvedValue([mockLink]);

    const links = await getLinksByUser(mockUser.id);
    expect(links).toStrictEqual([mockLink]);
  });

  it("should create a link with userId", async () => {
    prismaMock.link.create.mockResolvedValue(mockLinkWithUserId);

    const link = await create(mockLink.originalUrl, mockUser.id);
    expect(link).toStrictEqual(mockLinkWithUserId);
  });

  it("should create a link without userId", async () => {
    prismaMock.link.create.mockResolvedValue(mockLink);

    const link = await create(mockLink.originalUrl);
    expect(link).toStrictEqual(mockLink);
  });

  it("should update excluded", async () => {
    prismaMock.link.findUnique.mockResolvedValue(mockLinkWithUserId);
    prismaMock.link.update.mockResolvedValue(mockLinkExcluded);

    expect(
      async () => await updateExcluded(mockLink.id, mockUser.id, true)
    ).not.toThrowError();
  });

  it("should not update excluded if user is not the owner", async () => {
    prismaMock.link.findUnique.mockResolvedValue(mockLinkWithUserId);

    await expect(updateExcluded(mockLink.id, 2, true)).rejects.toThrowError(
      BadRequestException
    );
  });

  it("should not update excluded if link does not exist", async () => {
    prismaMock.link.findUnique.mockResolvedValue(null);

    await expect(
      updateExcluded(mockLink.id, mockUser.id, true)
    ).rejects.toThrowError(BadRequestException);
  });

  it("should update excluded by admin", async () => {
    prismaMock.link.findUnique.mockResolvedValue(mockLink);
    prismaMock.link.update.mockResolvedValue(mockLinkExcluded);

    expect(
      async () => await updateExcludedAdmin(mockLink.id, true)
    ).not.toThrowError();
  });

  it("should not update excluded by admin if link does not exist", async () => {
    prismaMock.link.findUnique.mockResolvedValue(null);

    await expect(updateExcludedAdmin(mockLink.id, true)).rejects.toThrowError(
      BadRequestException
    );
  });

  it("should update original url", async () => {
    prismaMock.link.findUnique.mockResolvedValue(mockLinkWithUserId);
    prismaMock.link.update.mockResolvedValue(mockLink);

    const link = await updateOriginalUrl(
      mockLink.id,
      "https://new.com",
      mockUser.id
    );
    expect(link).toStrictEqual(mockLink);
  });

  it("should not update original url if user is not the owner", async () => {
    prismaMock.link.findUnique.mockResolvedValue(mockLinkWithUserId);

    await expect(
      updateOriginalUrl(mockLink.id, "https://new.com", 2)
    ).rejects.toThrowError(BadRequestException);
  });

  it("should not update original url if link does not exist", async () => {
    prismaMock.link.findUnique.mockResolvedValue(null);

    await expect(
      updateOriginalUrl(mockLink.id, "https://new.com", mockUser.id)
    ).rejects.toThrowError(BadRequestException);
  });

  it("should get link by short url and update clicked amount", async () => {
    prismaMock.link.findUnique.mockResolvedValue(mockLink);
    prismaMock.link.update.mockResolvedValue({
      ...mockLink,
      clickedAmount: mockLink.clickedAmount + 1,
    });

    const link = await getByShortUrlAndUpdateClickedAmount("abc123");
    expect(link).toStrictEqual(link);
  });

  it("should not get link by short url if link does not exist", async () => {
    prismaMock.link.findUnique.mockResolvedValue(null);

    await expect(
      getByShortUrlAndUpdateClickedAmount("abc123")
    ).rejects.toThrowError(BadRequestException);
  });
});
