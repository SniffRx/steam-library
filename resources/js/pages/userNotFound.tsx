import { Auth, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User',
        href: '/user',
    },
];

export default function UserNotFound() {
    const { auth, steamID } = usePage<{
        auth: Auth;
        steamID: string;
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen  from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-6 text-white">
                <Head title="Пользователь не найден" />

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:shadow-white/5 max-w-md w-full text-center flex flex-col items-center"
                >
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-6xl mb-6 select-none"
                        aria-hidden="true"
                    >
                        😢
                    </motion.div>


                    <h1 className="text-3xl font-extrabold mb-4 bg-gradient-to-r text-gray-100 from-white via-gray-200 to-gray-400 bg-clip-text font-bold text-transparent">
                        Пользователь не подключил свой профиль
                    </h1>

                    <p className="text-gray-300 mb-8 max-w-[360px]">
                        Похоже, этот игрок ещё не зарегистрировался в нашей системе. Пригласите его присоединиться, чтобы отслеживать игровой прогресс вместе!
                    </p>

                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(`http://steamcommunity.com/profiles/${steamID}`, '_blank', 'noopener noreferrer');
                            }}
                            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white-100 font-semibold py-3 px-6 shadow-lg shadow-cyan-600/40 transition hover:from-cyan-600 hover:to-blue-700"
                            aria-label="Пригласить друга"
                        >
                            Пригласить друга
                        </motion.button>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href={`/steam/user/${auth.user.steamID}`}
                                className="block w-full rounded-xl border border-white/30 bg-white/10 text-gray-100 from-white via-gray-200 to-gray-400 bg-clip-text font-semibold py-3 px-6 text-center shadow-sm backdrop-blur-md transition hover:bg-white/20"
                            >
                                Вернуться в профиль
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10 text-gray-400 text-center text-sm select-none"
                >
                    SteamLibrary — платформа для отслеживания игровых достижений
                </motion.p>
            </div>
        </AppLayout>
    );
}
