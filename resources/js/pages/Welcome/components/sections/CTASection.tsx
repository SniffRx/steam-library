import { motion } from 'framer-motion';
import { Link, usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

export const CTASection = () => {
    const { auth } = usePage<SharedData>().props;

    return (
        <section className="max-w-7xl mx-auto mt-16 lg:mt-24 py-16 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-[#66C0F4]/10 to-[#1B2838]/50 rounded-xl p-8 lg:p-12 border border-[#66C0F4]/20"
            >
                <h2 className="text-3xl font-bold mb-6 font-['Instrument Sans']">Ready to Track Your Gaming
                    Progress?</h2>
                <p className="text-lg text-[#C7D5E0] max-w-2xl mx-auto mb-8">
                    Join thousands of gamers who are already organizing their Steam libraries and tracking achievements.
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href={auth.user ? route('dashboard') : route('register')}
                        className="inline-block rounded-md bg-[#66C0F4] px-8 py-3 text-base font-medium text-[#1B2838] hover:bg-[#4FABDD] transition-colors duration-200"
                    >
                        {auth.user ? 'Go to Dashboard' : 'Get Started for Free'}
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    )
}
