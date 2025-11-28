import { z } from "zod";
import { prisma } from "@/prisma";
import { createTRPCRouter, publicProcedure } from "../trpc/init";

export const departamentosRouter = createTRPCRouter({
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
});
