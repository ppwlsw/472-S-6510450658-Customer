import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/merchant/store-management": {};
  "/merchant/dashboard": {};
  "/merchant/queue": {};
  "/queue/:queueId": {
    "queueId": string;
  };
  "/profile": {};
  "/scan": {};
  "/shop": {};
  "/forget-password": {};
  "/reset-password": {};
  "/profile-edit": {};
  "/register": {};
  "/login": {};
  "/copy": {};
  "/homepage": {};
  "/map": {};
};