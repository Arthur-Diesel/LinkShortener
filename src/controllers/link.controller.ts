import { Request, Response } from "express";
import {
  getValidLinks,
  updateExcluded,
  create,
  getLinksByUser,
  updateExcludedAdmin,
  getByOriginalUrl,
  getByShortUrlAndUpdateClickedAmount,
  updateOriginalUrl,
} from "../services/link.service";
import { ApiError } from "../config/errors";
import { formatExcluded } from "../utils/formatExcluded";

export async function getValidLinksController(_: Request, res: Response) {
  const links = await getValidLinks();
  const formattedLinks = links.map((link) => {
    return {
      id: link.id,
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
      clickedAmount: link.clickedAmount,
    };
  });

  return res.status(200).json({ data: { formattedLinks } });
}

// checkUserAuthenticatedMiddleware
export async function getMyLinksController(req: Request, res: Response) {
  const userId = req.user!.id;
  const links = await getLinksByUser(userId);
  return res.status(200).json({ data: { links } });
}

// appendUserToRequestMiddleware
export async function createLinkController(req: Request, res: Response) {
  try {
    const originalUrl = req.body.originalUrl;
    if (!originalUrl) {
      return res.status(400).json({ message: "originalUrl is required" });
    }

    const link = await create(originalUrl, req.user!.id);

    return res.status(201).json({ data: { link } });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function getShortUrlController(req: Request, res: Response) {
  const shortUrl = req.params.shortUrl;
  const link = await getByShortUrlAndUpdateClickedAmount(shortUrl);
  return res.redirect(link.originalUrl);
}

//checkUserAuthenticatedMiddleware,
// checkUserAdminMiddleware,
export async function updateExcludedAdminController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const excluded = req.body.excluded;

    if (!excluded) {
      return res.status(400).json({ message: "excluded is required" });
    }

    const formattedId: number = parseInt(id);
    const excludedFormatted = formatExcluded(excluded);

    if (!excludedFormatted) {
      return res
        .status(400)
        .json({ message: "excluded is required and should be an boolean" });
    }

    await updateExcludedAdmin(formattedId, excludedFormatted);

    return res.status(200).json();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}

// checkUserAuthenticatedMiddleware,
export async function updateOriginalUrlController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const userId = req.user!.id;
    const originalUrl = req.body.originalUrl;

    if (!originalUrl) {
      return res.status(400).json({ message: "originalUrl is required" });
    }

    const formattedId = parseInt(id);

    const link = await updateOriginalUrl(formattedId, originalUrl, userId);

    return res.status(200).json({ data: { link } });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function updateExcludedController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const excluded = req.body.excluded;

    if (!excluded) {
      return res.status(400).json({ message: "excluded is required" });
    }

    const formattedId = parseInt(id);
    const excludedFormatted = formatExcluded(excluded);

    if (!excludedFormatted) {
      return res
        .status(400)
        .json({ message: "excluded is required and should be an boolean" });
    }

    const link = await updateExcluded(
      formattedId,
      req.user!.id,
      excludedFormatted
    );

    return res.status(200).json({ data: { link } });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}