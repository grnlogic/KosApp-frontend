export type owner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
};

export const owner: owner[] = [
  {
    id: "2",
    name: "Ibu Kost",
    email: "ibukost@gmail.com",
    phone: "08234567890",
    address: "Jl. Merak No. 15, Semarang",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
  {
    id: "3",
    name: "Putri",
    email: "putri@gmail.com",
    phone: "08345678901",
    address: "Jl. Merak No. 15, Semarang",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    id: "4",
    name: "Putra",
    email: "putra@gmail.com",
    phone: "08456789012",
    address: "Jl. Merak No. 15, Semarang",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
];

export default owner;
