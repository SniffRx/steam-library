import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { LogOut, Settings, User as UserIcon, Gamepad2 } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    return (
        <div className="w-64">
            {/* User Info Header */}
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-white/5">
                    <UserInfo user={user} showEmail={true} showProfileButton={false} />
                </div>
            </DropdownMenuLabel>

            {/* Steam Profile Link */}
            {user.steamID && (
                <>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link
                                className="flex items-center w-full px-3 py-2 text-sm cursor-pointer hover:bg-white/5 transition-colors rounded-lg mx-1 my-1"
                                href={`/steam/user/${user.steamID}`}
                                onClick={cleanup}
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <div className="p-1.5 rounded-lg bg-blue-500/10">
                                        <Gamepad2 className="w-4 h-4 text-blue-400" />
                                    </div>
                                    <span className="text-white font-medium">Steam профиль</span>
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </>
            )}

            <DropdownMenuSeparator className="bg-white/5" />

            {/* Settings & Profile */}
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="flex items-center w-full px-3 py-2 text-sm cursor-pointer hover:bg-white/5 transition-colors rounded-lg mx-1 my-1"
                        href={route('profile.edit')}
                        as="button"
                        prefetch
                        onClick={cleanup}
                    >
                        <div className="flex items-center gap-2 w-full">
                            <div className="p-1.5 rounded-lg bg-purple-500/10">
                                <Settings className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="text-slate-300">Настройки</span>
                        </div>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-white/5" />

            {/* Logout */}
            <DropdownMenuItem asChild>
                <Link
                    className="flex items-center w-full px-3 py-2 text-sm cursor-pointer hover:bg-red-500/10 transition-colors rounded-lg mx-1 my-1 group"
                    method="post"
                    href={route('logout')}
                    as="button"
                    onClick={cleanup}
                >
                    <div className="flex items-center gap-2 w-full">
                        <div className="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                            <LogOut className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="text-red-400 font-medium">Выйти</span>
                    </div>
                </Link>
            </DropdownMenuItem>

            {/* Footer Info */}
            <div className="px-3 py-2 mt-1 border-t border-white/5">
                <p className="text-xs text-slate-500 text-center">
                    Steam Library v1.0
                </p>
            </div>
        </div>
    );
}
