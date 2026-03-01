import {
  adminClient,
  lastLoginMethodClient,
  organizationClient,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import {
  ac,
  cashier,
  customer,
  finance,
  manager,
  operator,
  owner,
  salesperson,
  shipping,
  superAdmin,
  user,
} from "./permissions";

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: {
        owner,
        manager,
        salesperson,
        operator,
        cashier,
        finance,
        shipping,
        customer,
      },
    }),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/2fa";
      },
    }),
    adminClient({
      ac,
      roles: {
        admin: superAdmin,
        user,
      },
    }),
    lastLoginMethodClient(),
  ],
});
