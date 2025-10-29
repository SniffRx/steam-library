import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password')
        });
    };

    return (
        <>
            <Head title="Вход в Steam Library" />
            <div className="min-h-screen bg-[#0e1217] relative overflow-hidden flex items-center justify-center p-6">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl"></div>
                </div>

                {/* Back to home */}
                <Link
                    href={route('home')}
                    className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-300"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    На главную
                </Link>

                <div className="w-full max-w-md relative z-10">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <Link href={route('home')} className="inline-flex items-center gap-3 group">
                            <svg className="w-12 h-12 text-blue-400 group-hover:text-blue-300 transition-colors" viewBox="0 0 32 32" fill="currentColor">
                                <path d="M2.57 20.027C4.3 25.796 9.654 30 15.99 30c7.737 0 14-6.268 14-14 0-7.732-6.263-14-14-14C8.566 2 2.492 7.772 2.012 15.07c0 2.097 0 2.972.558 4.957z" />
                                <path d="M15.27 12.563l-3.428 4.976c-.808-.037-1.622.192-2.297.636L2.018 15.078S1.844 17.942 2.57 20.076l5.321 2.195c.267 1.193 1.086 2.24 2.295 2.743 1.977.826 4.257-.114 5.08-2.09.214-.517.314-1.06.3-1.6l5.025-3.501c3.935 0 6.321-2.391 6.321-5.328 0-2.937-2.386-5.326-6.321-5.326-2.835 0-5.479 2.474-5.32 5.396zm-.824 9.015c-.636 1.528-2.393 2.252-3.92 1.617-.704-.293-1.236-.83-1.543-1.47l1.732.717c1.126.469 2.418-.064 2.886-1.189.47-1.126-.062-2.419-1.187-2.887l-1.79-.659c.691-.262 1.476-.271 2.21.034.74.307 1.314.887 1.618 1.627.304.74.303 1.557-.005 2.295zm6.168-6.535c-1.954 0-3.545-1.592-3.545-3.55 0-1.956 1.591-3.548 3.545-3.548 1.955 0 3.546 1.592 3.546 3.548 0 1.958-1.591 3.55-3.546 3.55zm-2.656-3.555c0-1.472 1.193-2.666 2.662-2.666 1.471 0 2.664 1.194 2.664 2.666 0 1.473-1.193 2.666-2.664 2.666-1.469 0-2.662-1.193-2.662-2.666z" fill="white" />
                            </svg>
                            <span className="text-3xl font-bold font-['Instrument_Sans'] group-hover:text-blue-300 transition-colors">Steam Library</span>
                        </Link>
                        <p className="text-slate-400 mt-2">Войдите в свой аккаунт</p>
                    </div>

                    {/* Status message */}
                    {status && (
                        <div className="mb-6 rounded-xl bg-green-500/10 backdrop-blur-md p-4 border border-green-500/20 text-center text-sm font-medium text-green-400">
                            {status}
                        </div>
                    )}

                    {/* Main form card */}
                    <div className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 shadow-2xl">
                        {/* Steam Login - Primary */}
                        <button
                            type="button"
                            disabled={processing}
                            onClick={() => (window.location.href = route('auth.steam'))}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 flex justify-center items-center gap-3 group"
                        >
                            {processing ? (
                                <LoaderCircle className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 32 32" fill="currentColor">
                                        <path d="M2.57 20.027C4.3 25.796 9.654 30 15.99 30c7.737 0 14-6.268 14-14 0-7.732-6.263-14-14-14C8.566 2 2.492 7.772 2.012 15.07c0 2.097 0 2.972.558 4.957z" />
                                        <path d="M15.27 12.563l-3.428 4.976c-.808-.037-1.622.192-2.297.636L2.018 15.078S1.844 17.942 2.57 20.076l5.321 2.195c.267 1.193 1.086 2.24 2.295 2.743 1.977.826 4.257-.114 5.08-2.09.214-.517.314-1.06.3-1.6l5.025-3.501c3.935 0 6.321-2.391 6.321-5.328 0-2.937-2.386-5.326-6.321-5.326-2.835 0-5.479 2.474-5.32 5.396zm-.824 9.015c-.636 1.528-2.393 2.252-3.92 1.617-.704-.293-1.236-.83-1.543-1.47l1.732.717c1.126.469 2.418-.064 2.886-1.189.47-1.126-.062-2.419-1.187-2.887l-1.79-.659c.691-.262 1.476-.271 2.21.034.74.307 1.314.887 1.618 1.627.304.74.303 1.557-.005 2.295zm6.168-6.535c-1.954 0-3.545-1.592-3.545-3.55 0-1.956 1.591-3.548 3.545-3.548 1.955 0 3.546 1.592 3.546 3.548 0 1.958-1.591 3.55-3.546 3.55zm-2.656-3.555c0-1.472 1.193-2.666 2.662-2.666 1.471 0 2.664 1.194 2.664 2.666 0 1.473-1.193 2.666-2.664 2.666-1.469 0-2.662-1.193-2.662-2.666z" fill="white" />
                                    </svg>
                                    Войти через Steam
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className="text-sm text-slate-500">или используйте email</span>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>

                        {/* Email/Password form */}
                        <form onSubmit={submit} className="space-y-5">
                            {/* Email field */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-300 block">
                                    Email адрес
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="email@example.com"
                                    className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border ${
                                        errors.email ? 'border-red-500/50' : 'border-white/5'
                                    } placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all`}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-400 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-medium text-slate-300 block">
                                        Пароль
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            tabIndex={5}
                                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            Забыли пароль?
                                        </Link>
                                    )}
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-3 rounded-xl bg-slate-900/50 border ${
                                        errors.password ? 'border-red-500/50' : 'border-white/5'
                                    } placeholder-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all`}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-400 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                    className="w-4 h-4 rounded border-white/10 bg-slate-900/50 text-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 cursor-pointer"
                                />
                                <label htmlFor="remember" className="ml-3 text-sm text-slate-300 cursor-pointer select-none">
                                    Запомнить меня
                                </label>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={processing}
                                tabIndex={4}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
                                Войти с Email
                            </button>
                        </form>

                        {/* Sign up link */}
                        {/*<div className="mt-6 text-center">*/}
                        {/*    <p className="text-sm text-slate-400">*/}
                        {/*        Нет аккаунта?{' '}*/}
                        {/*        <Link*/}
                        {/*            href={route('register')}*/}
                        {/*            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"*/}
                        {/*        >*/}
                        {/*            Зарегистрироваться*/}
                        {/*        </Link>*/}
                        {/*    </p>*/}
                        {/*</div>*/}
                    </div>

                    {/* Security notice */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Защищенное соединение. Мы используем только публичные данные Steam API.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
