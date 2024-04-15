import { Request, Response } from "express";
import {
  getValidLinks,
  updateExcluded,
  create,
  getLinksByUser,
  updateExcludedAdmin,
  getByShortUrlAndUpdateClickedAmount,
  updateOriginalUrl,
} from "../services/link.service";
import { ApiError, BadRequestException } from "../config/errors";
import { debugApi } from "../config/constants";

export async function getValidLinksController(_: Request, res: Response) {
  debugApi("Nova requisição /api/links (GET) - getValidLinksController");

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

  debugApi("Retornando sucesso! - getValidLinksController");
  return res.status(200).json({ data: { formattedLinks } });
}

export async function getMyLinksController(req: Request, res: Response) {
  debugApi("Nova requisição /api/myLinks (GET) - getMyLinksController");

  const userId = req.user!.id;
  const links = await getLinksByUser(userId);

  debugApi("Retornando sucesso! - getMyLinksController");
  return res.status(200).json({ data: { links } });
}

export async function createLinkController(req: Request, res: Response) {
  debugApi("Nova requisição /api/links (POST) - createLinkController");

  try {
    const originalUrl = req.body.originalUrl;
    if (!originalUrl) {
      return res.status(400).json({ message: "originalUrl is required" });
    }

    const userId = req.user ? req.user!.id : undefined;

    const link = await create(originalUrl, userId);

    debugApi("Retornando sucesso! - createLinkController");
    return res.status(201).json({ data: { link } });
  } catch (error) {
    debugApi("Retornando falha! - createLinkController");
    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function getShortUrlController(req: Request, res: Response) {
  debugApi(
    "Nova requisição /api/redirect/:shortUrl (GET) - getShortUrlController"
  );
  try {
    const shortUrl = req.params.shortUrl;
    const link = await getByShortUrlAndUpdateClickedAmount(shortUrl);

    debugApi("Retornando sucesso! - getShortUrlController");
    return res.redirect(link.originalUrl);
  } catch (error) {
    debugApi("Retornando falha! - getShortUrlController");

    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function updateExcludedAdminController(
  req: Request,
  res: Response
) {
  debugApi(
    "Nova requisição /api/adminExcludeUpdate/:id (PATCH) - updateExcludedAdminController"
  );

  try {
    const id = req.params.id;
    const excluded = req.body.excluded;

    if (excluded == undefined) {
      return res.status(400).json({ message: "excluded is required" });
    }

    const formattedId: number = parseInt(id);

    if (!formattedId) {
      throw new BadRequestException("id is required and should be a number");
    }

    if (typeof excluded !== "boolean") {
      throw new BadRequestException(
        "excluded is required and should be an boolean"
      );
    }

    await updateExcludedAdmin(formattedId, excluded);

    debugApi("Retornando sucesso! - updateExcludedAdminController");
    return res.status(200).json();
  } catch (error) {
    debugApi("Retornando falha! - updateExcludedAdminController");

    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function updateOriginalUrlController(req: Request, res: Response) {
  debugApi(
    "Nova requisição /api/originalUrl/:id (PATCH) - updateOriginalUrlController"
  );

  try {
    const id = req.params.id;
    const userId = req.user!.id;
    const originalUrl = req.body.originalUrl;

    if (!originalUrl) {
      throw new BadRequestException("originalUrl is required");
    }

    const formattedId = parseInt(id);

    const link = await updateOriginalUrl(formattedId, originalUrl, userId);

    debugApi("Retornando sucesso! - updateOriginalUrlController");
    return res.status(200).json({ data: { link } });
  } catch (error) {
    debugApi("Retornando falha! - updateOriginalUrlController");

    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function updateExcludedController(req: Request, res: Response) {
  debugApi(
    "Nova requisição /api/excludeUpdate/:id (PATCH) - updateExcludedController"
  );

  try {
    const id = req.params.id;
    const excluded = req.body.excluded;

    if (excluded == undefined) {
      return res.status(400).json({ message: "excluded is required" });
    }

    const formattedId = parseInt(id);

    if (!formattedId) {
      throw new BadRequestException("id is required and should be a number");
    }

    if (typeof excluded !== "boolean") {
      throw new BadRequestException(
        "excluded is required and should be an boolean"
      );
    }

    const link = await updateExcluded(formattedId, req.user!.id, excluded);

    debugApi("Retornando sucesso! - updateExcludedController");
    return res.status(200).json({ data: { link } });
  } catch (error) {
    debugApi("Retornando falha! - updateExcludedController");

    if (error instanceof ApiError) {
      return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}
