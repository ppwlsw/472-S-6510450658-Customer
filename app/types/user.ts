export interface User {
  data: UserResponse
}

export interface UserResponse {
  name: string;
  email: string;
  image_url: string;
  phone: string;
}
