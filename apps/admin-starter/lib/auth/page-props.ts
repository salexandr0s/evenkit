export interface AuthRouteProps { searchParams: Promise<Record<string, string | string[] | undefined>> }
export function firstParam(value: string | string[] | undefined): string | undefined { return typeof value === "string" ? value : undefined; }
