// components/Breadcrumb.tsx
"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb() {
  const pathname = usePathname(); // e.g. /category/electronics/laptop/asus-rog-strix
  const segments = pathname.split("/").filter(Boolean); // remove empty strings

  const buildHref = (segment:string, index: number) => {
    if (segment === "category") return "/";
    return "/" + segments.slice(0, index + 1).join("/");
  };

  return (
    <nav className="text-sm text-gray-600 px-5 py-2">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="text-black hover:underline">Home</Link>
        </li>
        {segments.map((segment, index) => (
          <li key={index} className="flex items-center gap-1">
            <span className="text-gray-400">|</span>
            <Link href={buildHref(segment, index)} className="text-black hover:underline capitalize">
              {decodeURIComponent(segment.replaceAll("-", " "))}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
