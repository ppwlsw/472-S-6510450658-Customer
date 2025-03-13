import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/successful-register": {};
  "/merchant/store-management": {};
  "/merchant/dashboard": {};
  "/merchant/queue": {};
  "/scan": {};
  "/shop": {};
  "/forget-password": {};
  "/reset-password": {};
  "/profile-edit": {};
  "/register": {};
  "/login": {};
  "/homepage": {};
  "/map": {};
};