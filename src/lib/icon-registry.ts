import {
  Truck,
  ShieldCheck,
  RefreshCcw,
  MessageCircle,
  CreditCard,
  Star,
  Sparkles,
  Gift,
  Briefcase,
  Home,
  Tag,
  Crown,
  Heart,
  ShoppingBag,
  Award,
  Clock,
  Phone,
  Package,
  Zap,
  type LucideIcon,
} from "lucide-react";

/** Stable string keys → lucide icon component. Used to serialize icon choices in JSON. */
export const ICON_REGISTRY = {
  truck: Truck,
  shield: ShieldCheck,
  refresh: RefreshCcw,
  message: MessageCircle,
  card: CreditCard,
  star: Star,
  sparkles: Sparkles,
  gift: Gift,
  briefcase: Briefcase,
  home: Home,
  tag: Tag,
  crown: Crown,
  heart: Heart,
  bag: ShoppingBag,
  award: Award,
  clock: Clock,
  phone: Phone,
  package: Package,
  zap: Zap,
} as const satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICON_REGISTRY;

export const ICON_KEYS = Object.keys(ICON_REGISTRY) as IconKey[];

export function getIcon(key: string | undefined | null): LucideIcon {
  if (key && key in ICON_REGISTRY) return ICON_REGISTRY[key as IconKey];
  return Sparkles;
}
