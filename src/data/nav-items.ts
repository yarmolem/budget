import { PieChart, type LucideProps, List, Euro, Tag } from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  description?: string;
  icon?: (props: LucideProps) => React.ReactNode;
}

export const items: NavItem[] = [
  {
    href: "/",
    icon: PieChart,
    title: "dashboard",
  },
  {
    icon: List,
    href: "/categories",
    title: "categories",
  },
  {
    icon: Euro,
    href: "/transactions",
    title: "transactions",
  },
  {
    icon: Tag,
    href: "/tags",
    title: "tags",
  },
];
