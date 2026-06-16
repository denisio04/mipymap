export interface SessionUser {
  id: string;
  username: string;
  role: 'ADMIN' | 'MIPYME';
}

export interface MipymeWithProducts {
  id: string;
  name: string;
  lat: number;
  lng: number;
  acceptsTransfer: boolean;
  province: string;
  municipality: string;
  image: string | null;
  products: { id: string; name: string; quantity: number; price: number }[];
}

export interface SearchResult {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  mipymeId: string;
  mipymeName: string;
  acceptsTransfer: boolean;
  mipymeImage: string | null;
  mipymeLat: number;
  mipymeLng: number;
}
