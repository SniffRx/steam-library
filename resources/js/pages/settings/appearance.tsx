import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Appearance settings', href: '/settings/appearance' }
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings - Steam Library" />

            <SettingsLayout>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                            <Palette className="w-6 h-6 text-purple-400" />
                        </div>
                        <HeadingSmall
                            title="Внешний вид"
                            description="Настройте тему и внешний вид приложения"
                        />
                    </div>

                    <div className="bg-[#1a1f29]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl">
                        <AppearanceTabs />
                    </div>
                </motion.div>
            </SettingsLayout>
        </AppLayout>
    );
}
