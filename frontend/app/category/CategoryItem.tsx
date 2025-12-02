import Image from "next/image";
import { CategoryWithImage } from "@/types/category";


interface CategoryItemProps {
  name: string;
  imageSrc: string;
}

export function CategoryItem({ name, imageSrc }: CategoryItemProps) {
  return (
    <div className="flex flex-col items-center cursor-pointer">
      <Image
        src={imageSrc}
        alt={name}
        width={45}
        height={40}
        className="object-contain bg-[#3C215F] rounded-[7px] p-1 hover:transform hover:scale-110 transition-transform duration-300 ease-in-out"
      />
      <div className="shadow-[0_4px_4px_rgba(0,0,0,0.25)">
        <span className="mt-1 text-center text-[10px] border-1 border-black rounded-[17px] px-2 font-semibold">
          {name.toUpperCase()}
        </span>
      </div>
      
    </div>
  );
}
