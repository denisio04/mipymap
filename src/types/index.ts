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
  delivery: boolean;
  phone: string | null;
  openingTime: string | null;
  closingTime: string | null;
  province: string;
  municipality: string;
  image: string | null;
  products: { id: string; name: string; price: number }[];
}

export interface SearchResult {
  productId: string;
  productName: string;
  price: number;
  mipymeId: string;
  mipymeName: string;
  acceptsTransfer: boolean;
  delivery: boolean;
  phone: string | null;
  openingTime: string | null;
  closingTime: string | null;
  mipymeImage: string | null;
  mipymeLat: number;
  mipymeLng: number;
}
