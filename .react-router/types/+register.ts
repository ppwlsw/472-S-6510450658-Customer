import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/forget-password": {};
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
  "/reset-password": {};
  "/profile-edit": {};
  "/register": {};
  "/login": {};
  "/test": {};
  "/copy": {};
  "/homepage": {};
  "/map": {};
};