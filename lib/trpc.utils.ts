import { AppRouter } from '@/server';
import { createTRPCReact } from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export type RouterOutputs = inferRouterOutputs<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCReact<AppRouter>({
  abortOnUnmount: true,
});
