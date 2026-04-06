import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  BookOpen,
  ShoppingCart,
  Tag,
  Mail,
  Shield,
  Package,
  ClipboardList,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "StoryBuilders", url: "/admin/storybuilders", icon: ClipboardList },
  { title: "Resources", url: "/admin/resources", icon: FileText },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Waitlist", url: "/admin/waitlist", icon: ClipboardList },
  { title: "Resource Requests", url: "/admin/resource-requests", icon: MessageSquare },
  { title: "Referrals", url: "/admin/referrals", icon: UserPlus },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Blog", url: "/admin/blog", icon: BookOpen },
  { title: "Purchases", url: "/admin/purchases", icon: ShoppingCart },
  { title: "Discounts", url: "/admin/discounts", icon: Tag },
  { title: "Emails", url: "/admin/emails", icon: Mail },
  { title: "Audit Log", url: "/admin/audit", icon: Shield },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider">
            Admin Panel
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
