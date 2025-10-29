import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-white/5 bg-[#1a1f29]/80 backdrop-blur-xl px-6 transition-all ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 shadow-lg">
            <div className="flex items-center gap-3 w-full">
                <SidebarTrigger className="-ml-1 hover:bg-white/10 transition-colors" />
                <div className="h-6 w-px bg-white/10" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
