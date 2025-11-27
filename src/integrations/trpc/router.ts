import { z } from "zod";
import { prisma } from "@/prisma";
import { createTRPCRouter, publicProcedure } from "./init";
import type { TRPCRouterRecord } from "@trpc/server";

const departamentosRouter = {
  list: publicProcedure.query(async () => {
    return await prisma.departamento.findMany({
      orderBy: {
        ordem: "asc",
      },
      include: {
        programas: {
          orderBy: {
            ordem: "asc",
          },
          include: {
            manuais: {
              include: {
                manual: true,
              },
              orderBy: {
                ordem: "asc",
              },
            },
          },
        },
      },
    });
  }),

  // Obter um departamento específico com todos os seus programas e manuais
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await prisma.departamento.findUnique({
        where: { id: input.id },
        include: {
          programas: {
            orderBy: {
              ordem: "asc",
            },
            include: {
              manuais: {
                include: {
                  manual: true,
                },
                orderBy: {
                  ordem: "asc",
                },
              },
            },
          },
        },
      });
    }),

  // Obter um departamento pelo slug com todos os seus programas e manuais
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return await prisma.departamento.findUnique({
        where: { slug: input.slug },
        include: {
          programas: {
            orderBy: {
              ordem: "asc",
            },
            include: {
              manuais: {
                include: {
                  manual: true,
                },
                orderBy: {
                  ordem: "asc",
                },
              },
            },
          },
        },
      });
    }),
} satisfies TRPCRouterRecord;

const manuaisRouter = {
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

  // Listar todos os manuais
  list: publicProcedure.query(async () => {
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

  // Obter departamento completo pelo slug (usado na página de manuais)
  getDepartamentoCompleto: publicProcedure
    .input(z.object({ departamentoSlug: z.string() }))
    .query(async ({ input }) => {
      // Buscar o departamento pelo slug
      const departamento = await prisma.departamento.findUnique({
        where: { slug: input.departamentoSlug },
        include: {
          programas: {
            orderBy: {
              ordem: "asc",
            },
            include: {
              manuais: {
                include: {
                  manual: true,
                },
                orderBy: {
                  ordem: "asc",
                },
              },
            },
          },
        },
      });

      if (!departamento) {
        throw new Error("Departamento não encontrado");
      }

      return departamento;
    }),

  // Criar um novo manual
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

  // Atualizar um manual existente
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

  // Excluir um manual
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await prisma.manual.delete({
        where: { id: input.id },
      });
    }),
} satisfies TRPCRouterRecord;

export const trpcRouter = createTRPCRouter({
  departamentos: departamentosRouter,
  manuais: manuaisRouter,
});
export type TRPCRouter = typeof trpcRouter;
