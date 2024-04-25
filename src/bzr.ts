import { BazaarApp, type BazaarOptions } from "@bzr/bazaar";
import type { AppUser } from "./types";

const options: BazaarOptions = {
  appId: "test",
  loginRedirectUri: "http://localhost:5173",
  onApiConnectError: async (bzr) => bzr.logOut(),
};

export const bzr = new BazaarApp(options);

export const usersCollection = bzr.collection<AppUser>("users");
