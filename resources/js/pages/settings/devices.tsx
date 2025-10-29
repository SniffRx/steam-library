import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Smartphone, Laptop, Monitor, Shield, LogOut } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Devices', href: '/settings/devices' }
];

function getDeviceIcon(userAgent: string) {
    if (/iphone|ipad|ipod/i.test(userAgent)) return <Smartphone className="w-5 h-5" />;
    if (/android/i.test(userAgent)) return <Smartphone className="w-5 h-5" />;
    if (/windows/i.test(userAgent)) return <Monitor className="w-5 h-5" />;
    if (/macintosh|mac os/i.test(userAgent)) return <Laptop className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
}

interface Session {
    id: string;
    user_agent: string;
    ip_address: string;
    last_activity: string;
}

interface DevicesPageProps {
    sessions: Session[];
    current_session_id: string;
}

export default function Devices() {
    const { sessions = [], current_session_id: currentSessionId = '' } = usePage<DevicesPageProps>().props;

    const [status, setStatus] = useState('');
    const { post, processing, setData, errors, data } = useForm({ password: '' });

    function logoutOtherDevices(e: React.FormEvent) {
        e.preventDefault();
        post(route('logout.other.devices'), {
            onSuccess: () => {
                setStatus('Вы успешно вышли из всех остальных устройств!');
                setData('password', '');
            },
        });
    }

    function logoutDevice(sessionId: string) {
        post(route('logout.device', { sessionId }), {
            onSuccess: () => setStatus('Устройство успешно отключено!')
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Devices - Steam Library" />
            <SettingsLayout>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 max-w-3xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                            <Shield className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Управление устройствами</h1>
                            <p className="text-slate-400 text-sm">Просмотр и управление активными сеансами</p>
                        </div>
                    </div>

                    <div className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-slate-400" />
                            Активные устройства
                        </h2>

                        <div className="space-y-3">
                            {sessions.length > 0 ? (
                                sessions.map((session, index) => (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`flex justify-between items-center p-4 rounded-xl border transition-all ${
                                            session.id === currentSessionId
                                                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
                                                : 'bg-slate-900/40 border-white/5 hover:border-blue-400/30'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className={`p-2.5 rounded-lg ${
                                                session.id === currentSessionId
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-slate-700/50 text-slate-400'
                                            }`}>
                                                {getDeviceIcon(session.user_agent)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-white truncate">{session.user_agent}</div>
                                                <div className="text-sm text-slate-400">{session.ip_address}</div>
                                                <div className="text-xs text-slate-500 mt-1">{session.last_activity}</div>
                                            </div>
                                        </div>

                                        {session.id === currentSessionId ? (
                                            <div className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-medium">
                                                Текущая сессия
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => logoutDevice(session.id)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium transition-all"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Отключить
                                            </motion.button>
                                        )}
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <Monitor className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                                    <p>Нет активных устройств</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={logoutOtherDevices} className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Выйти со всех устройств</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Введите пароль для подтверждения выхода со всех остальных устройств
                        </p>

                        <div className="space-y-4">
                            <input
                                type="password"
                                required
                                value={data.password}
                                placeholder="Подтвердите пароль"
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                            />
                            {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                            >
                                {processing ? 'Подождите...' : 'Выйти со всех устройств'}
                            </motion.button>

                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm"
                                >
                                    {status}
                                </motion.div>
                            )}
                        </div>
                    </form>
                </motion.div>
            </SettingsLayout>
        </AppLayout>
    );
}
