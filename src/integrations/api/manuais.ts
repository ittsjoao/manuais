import { z } from "zod";
import { prisma } from "@/prisma";
import { createTRPCRouter, publicProcedure } from "../trpc/init";

export const manuaisRouter = createTRPCRouter({
  // Obter um manual específico pelo ID
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.manual.findUnique({
        where: { id: input.id },
        include: {
          programas: {
            include: {
              programa: true,
            },
          },
        },
      });
    }),
  //Lista todos manuais
  getAll: publicProcedure.query(async () => {
    return await prisma.manual.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        programas: {
          include: {
            programa: true,
          },
        },
      },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        titulo: z.string().min(2).max(100),
        conteudo: z.string().min(2),
        tags: z.array(z.string()).optional().default([]),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.manual.create({
        data: {
          titulo: input.titulo,
          conteudo: input.conteudo,
          tags: input.tags,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        titulo: z.string().min(1).optional(),
        conteudo: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.manual.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.manual.delete({
        where: { id: input.id },
      });
    }),
});
