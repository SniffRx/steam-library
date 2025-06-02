import React from 'react';

export const CloseButton = ({onClose}: {onClose:void}) => {
    return (
        <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition z-10"
            aria-label="Закрыть"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    )
}
