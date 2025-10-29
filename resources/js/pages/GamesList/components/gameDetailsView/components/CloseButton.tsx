import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export const CloseButton = ({ onClose }: { onClose: () => void }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-slate-900/80 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-red-500/80 hover:border-red-500/50 transition-all duration-300 z-50 shadow-lg"
            aria-label="Закрыть"
        >
            <X className="w-5 h-5 text-white" />
        </motion.button>
    );
};
