import { oc } from "@orpc/contract";

export const accountContract = {
  delete: oc
    .route({
      method: "DELETE",
      path: "/account",
      successStatus: 204,
      summary: "Delete the user's account and all of their notes",
    })
    .errors({ NOT_FOUND: { message: "Account not found" } }),
};
