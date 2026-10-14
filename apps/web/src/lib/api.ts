import "server-only";

import { type Contract, contract } from "@notes/contracts";
import { createORPCClient, ORPCError } from "@orpc/client";
import type { ContractRouterClient } from "@orpc/contract";
import type { JsonifiedClient } from "@orpc/openapi-client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/env";

const link = new OpenAPILink(contract, {
  url: () => {
    const { API_URL: apiUrl } = getEnv();

    return apiUrl;
  },
  headers: async () => {
    const cookieStore = await cookies();
    const headers = { cookie: cookieStore.toString() };

    return headers;
  },
  fetch: (request, init) => fetch(request, { ...init, cache: "no-store" }),
});

export const apiClient: JsonifiedClient<ContractRouterClient<Contract>> = createORPCClient(link);

export const hasStatus = ({ error, status }: { error: unknown; status: number }) =>
  error instanceof ORPCError && error.status === status;
