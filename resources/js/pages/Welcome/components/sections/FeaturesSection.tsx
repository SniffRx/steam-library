import { motion } from 'framer-motion';

export const FeaturesSection = () => {
    return (
        <section id="features" className="max-w-7xl mx-auto mt-24 lg:mt-32 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl font-bold mb-4 font-['Instrument Sans']">Powerful Features for Gamers</h2>
                <p className="text-[#C7D5E0] max-w-2xl mx-auto">
                    SteamLibrary offers everything you need to track and share your gaming progress
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    {
                        icon: (
                            <svg className="w-8 h-8 text-[#66C0F4]" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ),
                        title: "Achievement Tracking",
                        description: "Track your progress through all achievements in your games and see which ones you're missing."
                    },
                    {
                        icon: (
                            <svg className="w-8 h-8 text-[#66C0F4]" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ),
                        title: "Friend Profiles",
                        description: "View your friends' gaming progress and compare achievements."
                    },
                    {
                        icon: (
                            <svg className="w-8 h-8 text-[#66C0F4]" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        ),
                        title: "Game Reviews",
                        description: "Share your thoughts on games and read reviews from other players."
                    },
                    {
                        icon: (
                            <svg className="w-8 h-8 text-[#66C0F4]" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        ),
                        title: "Progress Statistics",
                        description: "Detailed stats about your gaming habits and completion rates."
                    },
                    {
                        icon: (
                            <svg className="w-8 h-8 text-[#66C0F4]" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        ),
                        title: "Game Library",
                        description: "Organize your entire Steam library with custom categories and tags."
                    },
                    {
                        icon: (
                            <svg className="w-8 h-8 text-[#66C0F4]" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        ),
                        title: "Badges & Rewards",
                        description: "Earn badges for completing games and reaching milestones."
                    }
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-[#1B2838]/50 rounded-xl p-6 border border-[#66C0F4]/10 hover:border-[#66C0F4]/30 transition-colors duration-200"
                    >
                        <div className="mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-[#C7D5E0]">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
