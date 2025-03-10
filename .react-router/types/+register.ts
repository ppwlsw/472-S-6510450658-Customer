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
  "/profile-edit": {};
  "/QueueStatus": {};
  "/register": {};
  "/login": {};
  "/homepage": {};
  "/map": {};
  "/test": {};
};