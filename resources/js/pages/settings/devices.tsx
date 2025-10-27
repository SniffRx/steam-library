import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Smartphone, Laptop, TvMinimal } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Devices',
        href: '/settings/devices',
    },
];

function getDeviceIcon(userAgent: string) {
    if (/iphone|ipad|ipod/i.test(userAgent)) return <Smartphone className="h-6 w-6 text-white" />;
    if (/android/i.test(userAgent)) return <Smartphone className="h-6 w-6 text-white" />;
    if (/windows/i.test(userAgent)) return <TvMinimal className="h-6 w-6 text-white" />;
    if (/macintosh|mac os/i.test(userAgent)) return <Laptop className="h-6 w-6 text-white" />;
    return <TvMinimal className="h-6 w-6 text-white" />; // дефолтная иконка
}

export default function Devices() {
    const { props } = usePage<{ sessions: Array<any>; current_session_id: string }>();
    const sessions = props.sessions || [];
    const currentSessionId = props.current_session_id || '';

    const [status, setStatus] = useState('');
    const { post, processing, setData, errors } = useForm({ password: '' });

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
            onSuccess: () => {
                setStatus('Устройство успешно отключено!');
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Devices" />
            <SettingsLayout>
                <div className="space-y-8 max-w-3xl">
                    <h1 className="mb-4 text-2xl font-semibold text-white">Управление устройствами</h1>
                    <p className="text-gray-300">
                        Вы можете разлогиниться со всех устройств, подтвердив пароль.
                    </p>

                    <section className="mt-8">
                        <h2 className="mb-4 text-lg font-semibold text-white">Активные устройства</h2>
                        <ul className="divide-y divide-gray-600">
                            {sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <li
                                        key={session.id}
                                        className={`flex justify-between items-center p-4 border rounded-lg mb-3 backdrop-blur-sm bg-white/10
                                            ${
                                            session.id === currentSessionId
                                                ? 'border-black bg-black text-white'
                                                : 'border-gray-600 text-gray-300'
                                        }
                                        `}
                                    >
                                        <div className="flex items-center space-x-4">
                                            {getDeviceIcon(session.user_agent)}
                                            <div>
                                                <div className="font-semibold truncate max-w-xs">{session.user_agent}</div>
                                                <div className="text-sm">{session.ip_address}</div>
                                                <div className="text-xs text-gray-400">{session.last_activity}</div>
                                            </div>
                                        </div>

                                        {session.id === currentSessionId ? (
                                            <div className="italic text-sm text-white">Текущая сессия</div>
                                        ) : (
                                            <button
                                                onClick={() => logoutDevice(session.id)}
                                                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 transition"
                                            >
                                                Отключить
                                            </button>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li className="text-center py-6 text-gray-500">Нет активных устройств</li>
                            )}
                        </ul>
                    </section>

                    <form
                        onSubmit={logoutOtherDevices}
                        className="mt-6 flex max-w-md flex-col gap-4 bg-white/10 backdrop-blur-md rounded-lg p-6 border border-gray-600 shadow-lg"
                    >
                        <input
                            type="password"
                            required
                            placeholder="Подтвердите пароль"
                            onChange={(e) => setData('password', e.target.value)}
                            className="rounded border border-gray-500 bg-gray-900 bg-opacity-30 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {errors.password && <p className="text-red-500">{errors.password}</p>}
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-black py-2 text-white hover:bg-gray-900 transition"
                        >
                            {processing ? 'Подождите...' : 'Выйти со всех устройств'}
                        </button>
                        {status && <p className="mt-2 text-green-500">{status}</p>}
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
