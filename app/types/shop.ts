interface Shop {
    id: number;
    name: string;
    email: string;
    is_verified: boolean;
    address: string;
    phone: string;
    description: string;
    image_url?:string
    image_uri?: string;
    is_open: boolean;
    latitude: number;
    longitude: number;
}

interface Shops{
    data: Shop[]
}