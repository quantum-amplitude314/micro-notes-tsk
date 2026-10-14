import { oc } from "@orpc/contract";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

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
