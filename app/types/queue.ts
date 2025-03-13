export interface QueueResponse {
  shop_name: string;
  queue_name: string;
  queue_number: string;
  shop_description: string;
  queue_tag: string;
}

export interface QueueInformation {
  data: QueueResponse;
}

export interface QueueStatus {
  position: number;
}

export interface QueueReserved {
  shop_name: string;
  created_at: string;
  shop_image_url: string;
}

export interface QueueReserveds {
  data: QueueReserved[]
}
