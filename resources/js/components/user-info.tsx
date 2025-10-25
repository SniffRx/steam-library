import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';
import { router } from '@inertiajs/react';
import { UsersIcon } from 'lucide-react';

interface UserInfoProps {
    user: User;
    showEmail?: boolean;
    showProfileButton?: boolean; // Новый флаг
}

export function UserInfo({ user, showEmail = false, showProfileButton = false }: UserInfoProps) {
    const getInitials = useInitials();

    const goToProfile = () => {
        router.visit(`/steam/user/${encodeURIComponent(user.steamID)}`);
    };

    return (
        <div className="flex items-center justify-between gap-4">
            <Avatar className="h-8 w-8 overflow-hidden rounded-full flex-shrink-0">
                <AvatarImage className="cursor-pointer" src={user.avatar} alt={user.name} role="button"
                             tabIndex={0}
                             onClick={goToProfile}
                             onKeyDown={(e) => {
                                 if (e.key === 'Enter' || e.key === ' ') goToProfile();
                             }}/>
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white"
                                role="button"
                                tabIndex={0}
                                onClick={goToProfile}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') goToProfile();
                                }}>
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>

            <div className="flex flex-col flex-grow min-w-0">
                <span className="truncate font-medium text-sm">{user.name}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground select-text">
                        {user.steamID}
                    </span>
                )}
            </div>

            {showProfileButton && (
                <span
                    role="button"
                    tabIndex={0}
                    onClick={goToProfile}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') goToProfile();
                    }}
                    className="cursor-pointer rounded-md bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white select-none hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    aria-label="Перейти в профиль пользователя"
                >
                    <UsersIcon className="h-4 w-4" />
                </span>
            )}
        </div>
    );
}
