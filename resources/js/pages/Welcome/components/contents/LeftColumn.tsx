import { itemVariants } from '@/pages/Welcome/types';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export const LeftColumn = () => {
    const { auth } = usePage<SharedData>().props;

    return (
        <motion.div variants={itemVariants} className="flex-1 space-y-8">
            <h1 className="font-['Instrument Sans'] text-4xl leading-tight font-bold lg:text-5xl">
                Track Your <span className="text-[#66C0F4]">Gaming Journey</span> Like Never Before
            </h1>

            <p className="max-w-2xl text-lg text-[#C7D5E0]">
                SteamLibrary helps you organize your game collection, track achievements, and share your progress with friends. Never lose track of
                your gaming accomplishments again.
            </p>

            <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href={auth.user ? route('dashboard') : route('register')}
                        className="inline-block rounded-md bg-[#66C0F4] px-8 py-3 text-base font-medium text-[#1B2838] transition-colors duration-200 hover:bg-[#4FABDD]"
                    >
                        Get Started
                    </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href="#features"
                        className="inline-block rounded-md border border-[#66C0F4] px-8 py-3 text-base font-medium text-[#66C0F4] transition-colors duration-200 hover:bg-[#66C0F4]/10"
                    >
                        Learn More
                    </Link>
                </motion.div>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                        <img
                            key={i}
                            src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 20}.jpg`}
                            alt="User"
                            className="h-10 w-10 rounded-full border-2 border-[#1B2838]"
                        />
                    ))}
                </div>
                <p className="text-sm text-[#C7D5E0]">
                    Join <span className="font-semibold text-[#66C0F4]">10,000+</span> gamers already tracking their progress
                </p>
            </div>
        </motion.div>
    );
};
