import React from 'react';

export const Platforms = ({info}: {info:any}) => {
    return (
        <div className="flex items-center space-x-3 mb-4">
            {info.platforms?.windows && (
                <img src="/images/windows.svg" alt="Windows" className="w-6 h-6" />
            )}
            {info.platforms?.mac && (
                <img src="/images/mac.svg" alt="Mac" className="w-6 h-6" />
            )}
            {info.platforms?.linux && (
                <img src="/images/linux.svg" alt="Linux" className="w-6 h-6" />
            )}
        </div>
    )
}
