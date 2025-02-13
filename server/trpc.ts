import { initTRPC } from '@trpc/server';
import { NextRequest } from "next/server";

export interface IContext {
  req?: NextRequest;
  resHeaders?: Headers;
}

const t = initTRPC.context<IContext>().create();

export const { router } = t;
export const publicProcedure = t.procedure;
