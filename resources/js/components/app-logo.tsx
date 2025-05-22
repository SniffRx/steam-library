import AppLogoIcon from './app-logo-icon';
import { XIcon } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div
                className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-2 fill-current text-white dark:text-black" />
                <XIcon className="size-2 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Steam Library</span>
            </div>
        </>
    );
}
