import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export const Navigation = () => {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className="max-w-7xl mx-auto mb-12 lg:mb-16">
            <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <svg className="w-8 h-8 text-[#66C0F4]" viewBox="0 0 32 32" fill="currentColor">
                        <path
                            d="M2.57 20.027C4.3 25.796 9.654 30 15.99 30c7.737 0 14-6.268 14-14 0-7.732-6.263-14-14-14C8.566 2 2.492 7.772 2.012 15.07c0 2.097 0 2.972.558 4.957z" />
                        <path
                            d="M15.27 12.563l-3.428 4.976c-.808-.037-1.622.192-2.297.636L2.018 15.078S1.844 17.942 2.57 20.076l5.321 2.195c.267 1.193 1.086 2.24 2.295 2.743 1.977.826 4.257-.114 5.08-2.09.214-.517.314-1.06.3-1.6l5.025-3.501c3.935 0 6.321-2.391 6.321-5.328 0-2.937-2.386-5.326-6.321-5.326-2.835 0-5.479 2.474-5.32 5.396zm-.824 9.015c-.636 1.528-2.393 2.252-3.92 1.617-.704-.293-1.236-.83-1.543-1.47l1.732.717c1.126.469 2.418-.064 2.886-1.189.47-1.126-.062-2.419-1.187-2.887l-1.79-.659c.691-.262 1.476-.271 2.21.034.74.307 1.314.887 1.618 1.627.304.74.303 1.557-.005 2.295zm6.168-6.535c-1.954 0-3.545-1.592-3.545-3.55 0-1.956 1.591-3.548 3.545-3.548 1.955 0 3.546 1.592 3.546 3.548 0 1.958-1.591 3.55-3.546 3.55zm-2.656-3.555c0-1.472 1.193-2.666 2.662-2.666 1.471 0 2.664 1.194 2.664 2.666 0 1.473-1.193 2.666-2.664 2.666-1.469 0-2.662-1.193-2.662-2.666z"
                            fill="white" />
                    </svg>
                    <span className="text-xl font-bold text-[#66C0F4] font-['Instrument Sans']">SteamLibrary</span>
                </div>

                <div className="flex items-center gap-4">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block rounded-md bg-[#66C0F4] px-6 py-2 text-sm font-medium text-[#1B2838] hover:bg-[#4FABDD] transition-colors duration-200"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-md border border-[#66C0F4] px-6 py-2 text-sm font-medium text-[#66C0F4] hover:bg-[#66C0F4]/10 transition-colors duration-200"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-block rounded-md bg-[#66C0F4] px-6 py-2 text-sm font-medium text-[#1B2838] hover:bg-[#4FABDD] transition-colors duration-200"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}
