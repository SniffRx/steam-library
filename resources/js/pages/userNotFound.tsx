import { Auth, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User',
        href: '/user'
    }
]

export default function UserNotFound () {
    const { auth, steamID } = usePage<{
        auth: Auth;
        steamID: steamID;
    }>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex flex-col items-center justify-center p-6 text-white">
                <Head title="Пользователь не найден" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full bg-[#1B2838]/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#66C0F4]/20 text-center"
                >
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-5xl mb-4"
                    >
                        😢
                    </motion.div>

                    <h1 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#66C0F4] to-[#4FABDD]">
                        Пользователь не подключил свой профиль
                    </h1>

                    <p className="text-[#C7D5E0] mb-6">
                        Похоже, этот игрок ещё не зарегистрировался в нашей системе.
                        Пригласите его присоединиться, чтобы отслеживать игровой прогресс вместе!
                    </p>

                    <div className="space-y-4">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`http://steamcommunity.com/profiles/${steamID}`, '_blank');
                                }}
                                //href={`http://steamcommunity.com/${steamID}`}
                                className="inline-block w-full bg-[#66C0F4] hover:bg-[#4FABDD] text-[#1B2838] font-medium py-3 px-6 rounded-lg transition-all"
                                //target="_blank"
                            >
                                Пригласить друга
                            </button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={`/steam/user/${auth.user.steamID}`}
                                className="inline-block w-full bg-transparent hover:bg-[#1B2838]/50 text-[#66C0F4] font-medium py-3 px-6 rounded-lg border border-[#66C0F4]/30 transition-all"
                            >
                                На главную
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 text-[#C7D5E0]/70 text-sm"
                >
                    SteamLibrary — платформа для отслеживания игровых достижений
                </motion.p>
            </div>
        </AppLayout>
    )
}
