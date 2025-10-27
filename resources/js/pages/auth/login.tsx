import { Head, useForm } from '@inertiajs/react';
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
            <Head title="Log in" />
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <form
                    onSubmit={submit}
                    className="w-full max-w-md p-8 bg-gradient-to-tr from-gray-900/70 via-gray-800/60 to-gray-900/70 rounded-2xl backdrop-blur-md border border-gray-700/50 shadow-lg flex flex-col gap-6"
                >
                    <h2 className="text-3xl font-semibold text-white text-center mb-6">Log in to your account</h2>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-2 text-gray-300 font-medium">
                                Email address
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
                                className={`px-3 py-2 rounded bg-gray-900/50 border ${
                                    errors.email ? 'border-red-600' : 'border-gray-600'
                                } placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500 select-text">{errors.email}</p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="text-gray-300 font-medium">
                                    Password
                                </label>
                                {/*{canResetPassword && (*/}
                                {/*    <a*/}
                                {/*        href={route('password.request')}*/}
                                {/*        tabIndex={5}*/}
                                {/*        className="text-sm text-indigo-400 hover:text-indigo-600 transition select-none"*/}
                                {/*    >*/}
                                {/*        Forgot password?*/}
                                {/*    </a>*/}
                                {/*)}*/}
                            </div>
                            <input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                className={`px-3 py-2 rounded bg-gray-900/50 border ${
                                    errors.password ? 'border-red-600' : 'border-gray-600'
                                } placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500 select-text">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={() => setData('remember', !data.remember)}
                                tabIndex={3}
                                className="w-4 h-4 rounded border-gray-600 checked:bg-indigo-600 checked:border-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="remember" className="text-gray-300 select-none cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            tabIndex={4}
                            className="mt-4 w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded shadow-md hover:shadow-lg transition disabled:opacity-70 flex justify-center items-center gap-2"
                        >
                            {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
                            Log in
                        </button>

                        <button
                            type="button"
                            disabled={processing}
                            tabIndex={4}
                            onClick={() => (window.location.href = route('auth.steam'))}
                            className="w-full bg-gradient-to-r bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded shadow-md hover:shadow-lg transition flex justify-center items-center gap-2"
                        >
                            {processing && <LoaderCircle className="h-5 w-5 animate-spin" />}
                            Login via Steam
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M2.56967 20.0269C4.30041 25.7964 9.65423 30 15.9906 30C23.7274 30 29.9995 23.7318 29.9995 16C29.9995 8.26803 23.7274 2 15.9906 2C8.56634 2 2.49151 7.77172 2.01172 15.0699C2.01172 17.1667 2.01172 18.0417 2.56967 20.0269Z"
                                    fill="url(#paint0_linear_87_8314)"
                                />
                                <path
                                    d="M15.2706 12.5629L11.8426 17.5395C11.0345 17.5028 10.221 17.7314 9.54572 18.1752L2.01829 15.0784C2.01829 15.0784 1.84411 17.9421 2.56999 20.0763L7.89147 22.2707C8.15866 23.464 8.97779 24.5107 10.1863 25.0142C12.1635 25.8398 14.4433 24.8988 15.2658 22.922C15.4799 22.4052 15.5797 21.8633 15.5652 21.3225L20.5904 17.8219C23.5257 17.8219 25.9114 15.4305 25.9114 12.4937C25.9114 9.55673 23.5257 7.16748 20.5904 7.16748C17.7553 7.16748 15.1117 9.64126 15.2706 12.5629ZM14.4469 22.5783C13.8103 24.1057 12.054 24.8303 10.5273 24.1946C9.82302 23.9014 9.29128 23.3642 8.98452 22.7237L10.7167 23.4411C11.8426 23.9098 13.1343 23.3762 13.6023 22.2514C14.0718 21.1254 13.5392 19.8324 12.4139 19.3637L10.6233 18.6222C11.3142 18.3603 12.0997 18.3507 12.8336 18.6559C13.5734 18.9635 14.1475 19.5428 14.4517 20.283C14.756 21.0233 14.7548 21.8404 14.4469 22.5783ZM20.5904 16.0434C18.6364 16.0434 17.0455 14.4511 17.0455 12.4937C17.0455 10.5379 18.6364 8.94518 20.5904 8.94518C22.5457 8.94518 24.1365 10.5379 24.1365 12.4937C24.1365 14.4511 22.5457 16.0434 20.5904 16.0434ZM17.9341 12.4883C17.9341 11.0159 19.127 9.82159 20.5964 9.82159C22.0671 9.82159 23.2599 11.0159 23.2599 12.4883C23.2599 13.9609 22.0671 15.1541 20.5964 15.1541C19.127 15.1541 17.9341 13.9609 17.9341 12.4883Z"
                                    fill="white"
                                />
                                <defs>
                                    <linearGradient id="paint0_linear_87_8314" x1="16.0056" y1="2" x2="16.0056" y2="30" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#111D2E" />
                                        <stop offset="0.21248" stopColor="#051839" />
                                        <stop offset="0.40695" stopColor="#0A1B48" />
                                        <stop offset="0.5811" stopColor="#132E62" />
                                        <stop offset="0.7376" stopColor="#144B7E" />
                                        <stop offset="0.87279" stopColor="#136497" />
                                        <stop offset="1" stopColor="#1387B8" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </button>

                        {/*<div className="text-gray-400 text-center text-sm mt-4 select-none">*/}
                        {/*    Don't have an account?{' '}*/}
                            {/*<a*/}
                            {/*    href={route('register')}*/}
                            {/*    tabIndex={5}*/}
                            {/*    className="text-indigo-400 hover:text-indigo-600 transition"*/}
                            {/*>*/}
                            {/*    Sign up*/}
                            {/*</a>*/}
                        {/*</div>*/}
                    </div>

                    {status && (
                        <div className="mt-6 rounded-md bg-green-700/70 p-3 text-center text-sm font-medium text-green-200 shadow-md">
                            {status}
                        </div>
                    )}
                </form>
            </div>
        </>
    );
}
