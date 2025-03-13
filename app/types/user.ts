export interface User {
  data: UserResponse
}

export interface UserResponse {
  name: string;
  email: string;
  user_image_url: string;
  phone: string;
}
