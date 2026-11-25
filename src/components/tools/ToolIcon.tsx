import {
  BarChart3,
  Calculator,
  Code2,
  DollarSign,
  FileText,
  Globe,
  Image as ImageIcon,
  Mail,
  Megaphone,
  Search,
  Share2,
  Target,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Keys match pp_tool_icon_options() in the WordPress plugin.
const ICONS: Record<string, LucideIcon> = {
  calculator: Calculator,
  megaphone: Megaphone,
  target: Target,
  "trending-up": TrendingUp,
  dollar: DollarSign,
  search: Search,
  share: Share2,
  mail: Mail,
  "bar-chart": BarChart3,
  users: Users,
  globe: Globe,
  zap: Zap,
  image: ImageIcon,
  code: Code2,
  "file-text": FileText,
};

export default function ToolIcon({
  name,
  size = 22,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Calculator;
  return <Icon size={size} className={className} aria-hidden />;
}
