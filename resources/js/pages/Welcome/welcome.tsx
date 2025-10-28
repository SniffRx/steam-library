import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Navigation } from '@/pages/Welcome/components/Navigation';
import { Footer } from '@/pages/Welcome/components/Footer';
import { HeroSection } from '@/pages/Welcome/components/sections/HeroSection';
import { FeaturesSection } from '@/pages/Welcome/components/sections/FeaturesSection';
import { StatsSection } from '@/pages/Welcome/components/sections/StatsSection';
import { CTASection } from '@/pages/Welcome/components/sections/CTASection';

export default function Welcome() {
    return (
        <>
            <Head title="Steam Library - Управляй своей игровой коллекцией">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|inter:400,500,600" rel="stylesheet" />
                <meta name="description" content="Отслеживайте прогресс в играх, управляйте библиотекой Steam и анализируйте игровую статистику в одном месте" />
            </Head>

            <div className="min-h-screen bg-[#0e1217] text-slate-100 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                    <Navigation />
                    <HeroSection />
                    <StatsSection />
                    <FeaturesSection />
                    <CTASection />
                    <Footer />
                </div>
            </div>
        </>
    );
}
