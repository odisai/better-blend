import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

/**
 * Session Router
 * Handles blend session creation, joining, and retrieval
 */
export const sessionRouter = createTRPCRouter({
  /**
   * Create a new blend session
   * Returns a unique code that can be shared with a partner
   */
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const code = `${nanoid(6).toUpperCase()}`;

    // Create session with 24-hour expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const session = await ctx.db.blendSession.create({
      data: {
        code,
        creatorId: userId,
        expiresAt,
        status: "PENDING",
      },
    });

    return {
      id: session.id,
      code: session.code,
      shareUrl: `/join/${session.code}`,
      expiresAt: session.expiresAt,
    };
  }),

  /**
   * Join an existing blend session by code
   * Validates the code and updates the session with partner info
   */
  join: protectedProcedure
    .input(z.object({ code: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { code } = input;

      // Find session by code
      const session = await ctx.db.blendSession.findUnique({
        where: { code },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
          partner: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found. Please check the code and try again.",
        });
      }

      // Check if session has expired
      if (new Date() > session.expiresAt) {
        await ctx.db.blendSession.update({
          where: { id: session.id },
          data: { status: "EXPIRED" },
        });
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This session has expired. Please create a new one.",
        });
      }

      // Check if user is trying to join their own session
      if (session.creatorId === userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot join your own blend session.",
        });
      }

      // Check if session already has a partner
      if (session.partnerId) {
        if (session.partnerId === userId) {
          // User is already the partner, return existing session
          return {
            id: session.id,
            code: session.code,
            status: session.status,
            creator: session.creator,
            partner: session.partner,
            expiresAt: session.expiresAt,
          };
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This session already has a partner.",
        });
      }

      // Update session with partner
      const updatedSession = await ctx.db.blendSession.update({
        where: { id: session.id },
        data: {
          partnerId: userId,
          status: "ACTIVE",
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
          partner: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      });

      return {
        id: updatedSession.id,
        code: updatedSession.code,
        status: updatedSession.status,
        creator: updatedSession.creator,
        partner: updatedSession.partner,
        expiresAt: updatedSession.expiresAt,
      };
    }),

  /**
   * Get session details by ID or code
   */
  get: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        code: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!input.id && !input.code) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either id or code must be provided",
        });
      }

      const session = await ctx.db.blendSession.findFirst({
        where: {
          OR: [{ id: input.id }, { code: input.code }],
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
          partner: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      // Check if user is authorized to view this session
      if (session.creatorId !== userId && session.partnerId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this session",
        });
      }

      // Check expiration
      if (new Date() > session.expiresAt && session.status !== "EXPIRED") {
        await ctx.db.blendSession.update({
          where: { id: session.id },
          data: { status: "EXPIRED" },
        });
        session.status = "EXPIRED";
      }

      return {
        id: session.id,
        code: session.code,
        status: session.status,
        creator: session.creator,
        partner: session.partner,
        expiresAt: session.expiresAt,
        ratio: session.ratio,
        timeRange: session.timeRange,
        playlistLength: session.playlistLength,
        playlistIdCreator: session.playlistIdCreator,
        playlistIdPartner: session.playlistIdPartner,
        playlistUrlCreator: session.playlistUrlCreator,
        playlistUrlPartner: session.playlistUrlPartner,
        compatibilityScore: session.compatibilityScore,
        sharedArtists: session.sharedArtists,
        insights: session.insights,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };
    }),

  /**
   * Update session configuration (ratio, timeRange, playlistLength)
   */
  updateConfig: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        ratio: z.number().min(0.3).max(0.7).optional(),
        timeRange: z
          .enum(["short_term", "medium_term", "long_term"])
          .optional(),
        playlistLength: z.number().min(25).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { sessionId, ...updates } = input;

      // Find session and verify user has access
      const session = await ctx.db.blendSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.creatorId !== userId && session.partnerId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this session",
        });
      }

      // Update session configuration
      const updatedSession = await ctx.db.blendSession.update({
        where: { id: sessionId },
        data: updates,
      });

      return {
        id: updatedSession.id,
        ratio: updatedSession.ratio,
        timeRange: updatedSession.timeRange,
        playlistLength: updatedSession.playlistLength,
      };
    }),
});
