export interface SearchQueue {
    id: number;
    name: string;
    queue_counter: number;
    is_available: boolean;
  }
  
export interface SearchShop {
    id: number;
    name: string;
    address: string;
    image_url: string;
    phone: string;
    description: string;
    is_open: boolean;
    latitude: string;
    longitude: string;
    queues: SearchQueue[];
  }
  
export interface Pagination {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  }
  
export interface SearchShopsResponse {
    shops: SearchShop[];
    pagination: Pagination;
}
  