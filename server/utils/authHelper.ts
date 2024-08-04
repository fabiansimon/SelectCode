import { Context } from '../trpc';

export function authUser(ctx?: Object): string {
  if (!ctx) throw new Error('Unauthorized');
  const context = ctx as Context;
  if (!context) throw new Error('Unauthorized');
  return context.userId;
}
