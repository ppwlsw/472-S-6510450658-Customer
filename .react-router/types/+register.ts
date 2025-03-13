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
  "/shop/:shopID": {
    "shopID": string;
  };
  "/profile": {};
  "/scan": {};
  "/forget-password": {};
  "/reset-password": {};
  "/profile-edit": {};
  "/register": {};
  "/login": {};
  "/homepage": {};
  "/map": {};
};