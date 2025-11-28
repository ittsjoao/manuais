import { createTRPCRouter } from "./init";
import { manuaisRouter } from "../api/manuais";
import { departamentosRouter } from "../api/departamentos";

export const trpcRouter = createTRPCRouter({
  departamentos: departamentosRouter,
  manuais: manuaisRouter,
});
export type TRPCRouter = typeof trpcRouter;
