import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-base font-medium sm:text-lg">YourMoney</h1>
      </div>
    </header>
  );
}
