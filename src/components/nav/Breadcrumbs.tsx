"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn(
        "flex items-center gap-2 text-sm text-gray-400",
        className,
      )}
      aria-label="Breadcrumb"
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 transition-colors hover:text-white"
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-gray-500" />
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

