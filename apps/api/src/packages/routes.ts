import { Router, type RequestHandler } from "express";
import type { PublicPackageRepository } from "./repository.js";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function parsePositiveInteger(
  rawValue: unknown,
  defaultValue: number,
  maximum?: number,
): number | null {
  if (rawValue === undefined) {
    return defaultValue;
  }
  if (typeof rawValue !== "string" || !/^[1-9]\d*$/.test(rawValue)) {
    return null;
  }
  const value = Number(rawValue);
  if (
    !Number.isSafeInteger(value) ||
    (maximum !== undefined && value > maximum)
  ) {
    return null;
  }
  return value;
}

export function createPublicPackageRouter(
  repository: PublicPackageRepository,
): Router {
  const router = Router();

  router.get("/", (request, response, next) => {
    const page = parsePositiveInteger(
      request.query.page,
      DEFAULT_PAGE,
    );
    const pageSize = parsePositiveInteger(
      request.query.page_size,
      DEFAULT_PAGE_SIZE,
      MAX_PAGE_SIZE,
    );
    const offset =
      page !== null && pageSize !== null ? (page - 1) * pageSize : Number.NaN;

    if (
      page === null ||
      pageSize === null ||
      !Number.isSafeInteger(offset)
    ) {
      response.status(400).json({
        error: {
          code: "INVALID_PAGINATION",
          message: "Page must be positive and page_size must be between 1 and 100",
        },
      });
      return;
    }

    void repository
      .listActive(page, pageSize)
      .then(({ items, totalItems }) => {
        response.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
        response.json({
          data: items,
          meta: {
            page,
            page_size: pageSize,
            total_items: totalItems,
            total_pages: Math.ceil(totalItems / pageSize),
          },
        });
      })
      .catch(next);
  });

  const getActivePackage: RequestHandler = (request, response, next) => {
    const slug = request.params.slug;
    if (
      typeof slug !== "string" ||
      slug.length > 200 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
    ) {
      response.status(404).json({
        error: { code: "NOT_FOUND", message: "Package not found" },
      });
      return;
    }

    void repository
      .findActiveBySlug(slug)
      .then((packageRecord) => {
        if (!packageRecord) {
          response.status(404).json({
            error: { code: "NOT_FOUND", message: "Package not found" },
          });
          return;
        }
        response.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
        response.json({ data: packageRecord });
      })
      .catch(next);
  };
  router.get("/:slug", getActivePackage);

  return router;
}
