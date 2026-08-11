/**
 * lib/cache.ts
 *
 * React cache() wrappers for public read actions.
 * These deduplicate identical DB calls within the same server request.
 * For example, if both the homepage and a component call getAllProjects()
 * in the same render, only ONE DB round-trip is made.
 *
 * ISR revalidation (export const revalidate) is handled at the page level.
 */

import { cache } from "react";
import { getAllProjects } from "@/lib/actions/project.actions";
import { getAllResources } from "@/lib/actions/resource.actions";
import { getVerifiedReviews } from "@/lib/actions/review.actions";
import { getLatestBlogPosts } from "@/lib/actions/blog.actions";

/** Cached for the duration of a single server request */
export const cachedGetAllProjects = cache(getAllProjects);

/** Cached for the duration of a single server request */
export const cachedGetAllResources = cache(getAllResources);

/** Cached for the duration of a single server request */
export const cachedGetVerifiedReviews = cache(getVerifiedReviews);

/**
 * Cached latest blog posts for homepage.
 * Pass limit as argument — cache keys are per unique argument set.
 */
export const cachedGetLatestBlogPosts = cache(getLatestBlogPosts);
