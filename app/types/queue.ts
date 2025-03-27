export interface QueueResponse {
  shop_name: string;
  queue_name: string;
  queue_number: string;
  shop_description: string;
  queue_tag: string;
  shop_address: string;
}

export interface QueueInformation {
  data: QueueResponse;
}

export interface QueueStatus {
  position: number;
}

export interface QueueReserved {
  queue_id: number;
  shop_name: string;
  created_at: string;
  shop_image_url: string;
}

export interface QueueReserveds {
  data: QueueReserved[]
}

export interface Queue {
  id: number;
  name: string;
  description: string;
  queue_image_url: string;
  queue_counter: number;
  is_available: boolean;
  tag: string;
}

export interface Queues {
  data: Queue[];
}

export interface QueueWaiting {
  queue_id: number;
  shop_name: string;
  status: string;
  shop_image_url: string;
}

export interface QueueWaitings {
  data: QueueWaiting[]
}
