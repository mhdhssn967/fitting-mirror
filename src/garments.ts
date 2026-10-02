// Demo catalogue. Change names, prices (in ₹) and prompts here.
export type Garment = { id: string; name: string; price: number; image: string; prompt: string };

export const garments: Garment[] = [
  { id: "outfit-1", name: "Outfit 1", price: 1999, image: "/outfits/Screenshot 2026-10-01 140558.png",
    prompt: "Substitute the current outfit with the clothing shown in the reference image" },
  { id: "outfit-2", name: "Outfit 2", price: 2199, image: "/outfits/Screenshot 2026-10-01 140635.png",
    prompt: "Substitute the current outfit with the clothing shown in the reference image" },
  { id: "outfit-3", name: "Outfit 3", price: 2499, image: "/outfits/Screenshot 2026-10-01 140754.png",
    prompt: "Substitute the current outfit with the clothing shown in the reference image" },
  { id: "outfit-4", name: "Outfit 4", price: 2999, image: "/outfits/Screenshot 2026-10-01 140832.png",
    prompt: "Substitute the current outfit with the clothing shown in the reference image" },
  { id: "outfit-5", name: "Outfit 5", price: 3499, image: "/outfits/Screenshot 2026-10-01 140848.png",
    prompt: "Substitute the current outfit with the clothing shown in the reference image" },
  { id: "outfit-6", name: "Outfit 6", price: 3999, image: "/outfits/Screenshot 2026-10-01 141018.png",
    prompt: "Substitute the current outfit with the clothing shown in the reference image" },
  { id: "outfit-7", name: "Outfit 7", price: 4499, image: "/outfits/Screenshot 2026-10-01 141111.png",
    prompt: "Substitute the current outfit with the clothing shown in the reference image" },
  { id: "outfit-8", name: "Outfit 8", price: 4999, image: "/outfits/image.png",
    prompt: "Substitute the current outfit with the clothing shown in the reference image" },
];

export const formatPrice = (p: number) => `₹${p.toLocaleString("en-IN")}`;
