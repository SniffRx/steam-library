import { Head } from '@inertiajs/react';
import { motion as Motion } from 'framer-motion';
import { Navigation } from '@/pages/Welcome/components/Navigation';
import { Footer } from '@/pages/Welcome/components/Footer';
import { CTASection } from '@/pages/Welcome/components/sections/CTASection';
import { FeaturesSection } from '@/pages/Welcome/components/sections/FeaturesSection';
import { LeftColumn } from '@/pages/Welcome/components/contents/LeftColumn';
import { RightColumn } from '@/pages/Welcome/components/contents/RightColumn';
import { containerVariants } from '@/pages/Welcome/types';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome to SteamLibrary">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|inter:400,500,600" rel="stylesheet" />
                <meta name="description" content="Track your gaming achievements, share your progress and connect with other gamers on SteamLibrary" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-[#EDEDEC] p-6 lg:p-8">
                <Navigation />
                {/* Main Content */}
                <Motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
                >
                    <LeftColumn />
                    <RightColumn />
                </Motion.div>
                <FeaturesSection />
                <CTASection />
                <Footer />
            </div>
        </>
    );
}
