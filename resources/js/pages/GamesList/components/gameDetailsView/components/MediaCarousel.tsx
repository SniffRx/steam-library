import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight, Play, Image as ImageIcon } from 'lucide-react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const MediaCarousel = ({ info }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const thumbnailsRef = useRef<any>(null);

    const mediaItems = [
        ...(info.screenshots?.map(shot => ({
            type: 'image',
            data: shot,
            id: `img-${shot.id}`
        })) || []),
        ...(info.movies?.map(movie => ({
            type: 'video',
            data: movie,
            id: `video-${movie.id}`
        })) || [])
    ];

    if (mediaItems.length === 0) return null;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (thumbnailsRef.current?.slickGoTo) {
            thumbnailsRef.current.slickGoTo(currentIndex);
        }
    }, [currentIndex]);

    const thumbnailSettings = {
        slidesToShow: Math.min(mediaItems.length, 6),
        infinite: false,
        swipeToSlide: true,
        focusOnSelect: true,
        draggable: true,
        arrows: false,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 5 } },
            { breakpoint: 768, settings: { slidesToShow: 4 } },
            { breakpoint: 480, settings: { slidesToShow: 3 } },
        ],
    };

    return (
        <section className="rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                    <ImageIcon className="w-5 h-5 text-blue-400" />
                    Медиа
                </h3>
                {mediaItems.length > 1 && (
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={prevSlide}
                            className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 border border-white/5 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={nextSlide}
                            className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700 border border-white/5 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </motion.button>
                    </div>
                )}
            </div>

            {/* Main View */}
            <div className="relative overflow-hidden rounded-xl bg-slate-950 aspect-video mb-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {mediaItems[currentIndex].type === 'image' ? (
                            <img
                                src={mediaItems[currentIndex].data.path_full}
                                alt={`Screenshot ${currentIndex + 1}`}
                                className="object-contain w-full h-full cursor-pointer"
                                onClick={() => window.open(mediaItems[currentIndex].data.path_full)}
                            />
                        ) : (
                            <video
                                controls
                                poster={mediaItems[currentIndex].data.thumbnail}
                                className="w-full h-full bg-black"
                            >
                                <source src={mediaItems[currentIndex].data.webm?.max} type="video/webm" />
                            </video>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Thumbnails */}
            {mediaItems.length > 1 && (
                <Slider {...thumbnailSettings} ref={thumbnailsRef}>
                    {mediaItems.map((item, index) => (
                        <div key={item.id} className="px-1">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative w-full h-16 overflow-hidden rounded-lg cursor-pointer border-2 transition-all ${
                                    index === currentIndex
                                        ? 'border-blue-500 shadow-lg shadow-blue-500/50'
                                        : 'border-white/10 hover:border-white/30'
                                }`}
                                onClick={() => goToSlide(index)}
                            >
                                {item.type === 'image' ? (
                                    <img
                                        src={item.data.path_thumbnail}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
                                        <Play className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    ))}
                </Slider>
            )}
        </section>
    );
};

export default MediaCarousel;
