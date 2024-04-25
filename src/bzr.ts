import { BazaarApp, type BazaarOptions } from "@bzr/bazaar";
import type { AppUser } from "./types";

const options: BazaarOptions = {
  appId: import.meta.env.VITE_BAZAAR_APP_ID,
  loginRedirectUri: import.meta.env.VITE_BAZAAR_REDIRECT_URI,
  onApiConnectError: async (bzr) => bzr.logOut(),
};

export const bzr = new BazaarApp(options);

export const usersCollection = bzr.collection<AppUser>("users");
