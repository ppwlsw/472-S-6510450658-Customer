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
  "/register": {};
  "/login": {};
  "/homepage": {};
  "/map": {};
};