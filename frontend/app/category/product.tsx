import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ProductProps {
  slug: string;
  category: string;
  image: string
}

const Productcard : React.FC<ProductProps>= ({slug, category, image }) => {
  return (
    <div className="flex flex-col gap-y-5">
      <Link
        href={`/category/${category}/${slug}`}
        className="w-[291.33px] h-[330.36px] border ml-15 flex items-center justify-center p-5"
      >
        <Image
          src={image}
          alt="controller"
          width={1000}
          height={1000}
          className="object-cover"
        ></Image>
      </Link>
    </div>
  );
};

export default Productcard;
