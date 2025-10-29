import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Password settings', href: '/settings/password' }
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings - Steam Library" />

            <SettingsLayout>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
                            <Lock className="w-6 h-6 text-red-400" />
                        </div>
                        <HeadingSmall
                            title="Изменить пароль"
                            description="Используйте надежный пароль для защиты аккаунта"
                        />
                    </div>

                    <form onSubmit={updatePassword} className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="current_password" className="text-slate-300">Текущий пароль</Label>
                            <Input
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type="password"
                                className="bg-slate-900/50 border-white/5 text-white placeholder-slate-500"
                                autoComplete="current-password"
                                placeholder="Введите текущий пароль"
                            />
                            <InputError message={errors.current_password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">Новый пароль</Label>
                            <Input
                                id="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                type="password"
                                className="bg-slate-900/50 border-white/5 text-white placeholder-slate-500"
                                autoComplete="new-password"
                                placeholder="Введите новый пароль"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-slate-300">Подтвердите пароль</Label>
                            <Input
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                type="password"
                                className="bg-slate-900/50 border-white/5 text-white placeholder-slate-500"
                                autoComplete="new-password"
                                placeholder="Повторите новый пароль"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <Button
                                disabled={processing}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400"
                            >
                                Сохранить пароль
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="flex items-center gap-2 text-sm text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    Сохранено
                                </p>
                            </Transition>
                        </div>
                    </form>
                </motion.div>
            </SettingsLayout>
        </AppLayout>
    );
}
