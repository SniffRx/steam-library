import { type BreadcrumbItem, type SharedData } from '@/types';
import { Switch, Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, CheckCircle, Zap } from 'lucide-react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Profile settings', href: '/settings/profile' }
];

type ProfileForm = {
    name: string;
    email: string;
    auto_mark_completed: boolean;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        auto_mark_completed: auth.user.auto_mark_completed
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings - Steam Library" />

            <SettingsLayout>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                            <User className="w-6 h-6 text-blue-400" />
                        </div>
                        <HeadingSmall
                            title="Информация профиля"
                            description="Обновите данные вашего аккаунта"
                        />
                    </div>

                    <form onSubmit={submit} className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-300 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Имя
                            </Label>
                            <Input
                                id="name"
                                className="bg-slate-900/50 border-white/5 text-white placeholder-slate-500"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Полное имя"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email адрес
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                className="bg-slate-900/50 border-white/5 text-white placeholder-slate-500"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email адрес"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-3 p-4 rounded-xl bg-slate-900/40 border border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/10">
                                        <Zap className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <Label htmlFor="auto_complete_achievement" className="text-white font-medium cursor-pointer">
                                            Автоматическая пометка "Пройдено"
                                        </Label>
                                        <p className="text-sm text-slate-400">При получении всех достижений</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={data.auto_mark_completed}
                                    onChange={(value) => setData('auto_mark_completed', value)}
                                    className={`${
                                        data.auto_mark_completed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-700'
                                    } relative inline-flex h-7 w-12 items-center rounded-full transition-all shadow-lg`}
                                >
                                    <span
                                        className={`${
                                            data.auto_mark_completed ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md`}
                                    />
                                </Switch>
                            </div>
                            <InputError message={errors.auto_mark_completed} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                                <p className="text-sm text-yellow-400">
                                    Ваш email не подтвержден.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="underline hover:text-yellow-300 transition-colors"
                                    >
                                        Нажмите здесь, чтобы отправить письмо повторно.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm text-green-400">
                                        Письмо с подтверждением отправлено на ваш email.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4 pt-4">
                            <Button
                                disabled={processing}
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400"
                            >
                                Сохранить
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

                    <DeleteUser />
                </motion.div>
            </SettingsLayout>
        </AppLayout>
    );
}
