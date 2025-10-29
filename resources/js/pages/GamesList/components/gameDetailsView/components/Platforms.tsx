import React from 'react';
import { Monitor, Apple } from 'lucide-react';

export const Platforms = ({ info }: { info: any }) => {
    return (
        <div className="flex items-center gap-2 mb-4">
            {info.platforms?.windows && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
                    <Monitor className="w-4 h-4" />
                    <span>Windows</span>
                </div>
            )}
            {info.platforms?.mac && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-500/10 border border-slate-500/30 text-slate-400 text-sm font-medium">
                    <Apple className="w-4 h-4" />
                    <span>macOS</span>
                </div>
            )}
            {info.platforms?.linux && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.41 1.719-.41 2.623 0 .955.164 1.898.493 2.8.615 1.692 1.857 3.146 3.472 4.05.732.41 1.528.735 2.375.975 1.644.465 3.417.7 5.318.7 1.902 0 3.675-.235 5.318-.7.847-.24 1.643-.565 2.375-.975 1.615-.904 2.857-2.358 3.472-4.05.329-.902.493-1.845.493-2.8 0-.904-.132-1.783-.41-2.623-.589-1.771-1.831-3.47-2.716-4.521-.75-1.067-.974-1.928-1.05-3.02-.065-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021z"/>
                    </svg>
                    <span>Linux</span>
                </div>
            )}
        </div>
    );
};
