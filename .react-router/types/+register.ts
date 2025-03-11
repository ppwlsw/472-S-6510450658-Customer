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
  "/queue/:queueId": {
    "queueId": string;
  };
  "/profile": {};
  "/scan": {};
  "/shop": {};
  "/profile-edit": {};
  "/register": {};
  "/login": {};
  "/homepage": {};
  "/map": {};
};