import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface ErrorProps {
    status?: number;
    message?: string;
    action?: {
        url: string;
        text: string;
    };
}

export default function Error({ status = 500, message, action }: ErrorProps) {
    const title = {
        404: 'Страница не найдена',
        403: 'Доступ запрещён',
        500: 'Ошибка сервера',
        503: 'Сервис недоступен',
    }[status] || 'Произошла ошибка';

    const description = {
        404: 'К сожалению, запрошенная страница не существует.',
        403: 'У вас нет доступа к этой странице.',
        500: 'Что-то пошло не так на нашей стороне.',
        503: 'Сервис временно недоступен. Попробуйте позже.',
    }[status] || message || 'Произошла неожиданная ошибка.';

    return (
        <AppLayout>
            <Head title={`${status} - ${title}`} />

            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-red-500/10 blur-3xl"
                />
            </div>

            {/* Content */}
            <div className="flex min-h-screen items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md text-center"
                >
                    {/* Error Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="rounded-full bg-red-500/10 p-6">
                            <AlertCircle className="h-16 w-16 text-red-500" />
                        </div>
                    </motion.div>

                    {/* Error Code */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h1 className="mb-2 text-8xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                            {status}
                        </h1>
                        <h2 className="mb-4 text-2xl font-semibold text-white">
                            {title}
                        </h2>
                        <p className="mb-8 text-gray-400">
                            {description}
                        </p>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col gap-3 sm:flex-row sm:justify-center"
                    >
                        <a
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40"
                        >
                            <Home className="h-5 w-5" />
                            На главную
                        </a>

                        {action && (
                            <a
                                href={action.url}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
                            >
                                <RefreshCw className="h-5 w-5" />
                                {action.text}
                            </a>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </AppLayout>
    );
}
