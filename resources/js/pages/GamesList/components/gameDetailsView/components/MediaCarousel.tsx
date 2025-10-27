import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from 'lucide-react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const MediaCarousel = ({ info }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const thumbnailsRef = useRef<any>(null); // ref для Slick слайдера

    // Объединяем медиа в один массив с указанием типа
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
        setDirection('right');
        setCurrentIndex((prev) =>
            prev === mediaItems.length - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setDirection('left');
        setCurrentIndex((prev) =>
            prev === 0 ? mediaItems.length - 1 : prev - 1
        );
    };

    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 'right' : 'left');
        setCurrentIndex(index);
    };

    // Автофокус на миниатюре при изменении currentIndex
    useEffect(() => {
        if (thumbnailsRef.current && thumbnailsRef.current.slickGoTo) {
            thumbnailsRef.current.slickGoTo(currentIndex);
        }
    }, [currentIndex]);

    // Настройки карусели миниатюр
    const thumbnailSettings = {
        slidesToShow: Math.min(mediaItems.length, 6),
        infinite: false,
        swipeToSlide: true,
        focusOnSelect: true,
        draggable: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 3,
                },
            },
        ],
    };

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Медиа</h3>
                {mediaItems.length > 1 && (
                    <div className="flex space-x-2">
                        <button
                            onClick={prevSlide}
                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                            aria-label="Previous media"
                        >
                            <ChevronLeftIcon className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                            aria-label="Next media"
                        >
                            <ChevronRightIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                )}
            </div>

            {/* Основная карусель */}
            <div className="relative overflow-hidden rounded-lg bg-gray-900/50 aspect-video mb-3">
                <AnimatePresence custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        initial={{ x: direction === 'right' ? '100%' : '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction === 'right' ? '-100%' : '100%', opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {mediaItems[currentIndex].type === 'image' ? (
                            <img
                                src={mediaItems[currentIndex].data.path_full}
                                alt={`Screenshot ${currentIndex + 1}`}
                                className="object-contain w-full h-full cursor-pointer"
                                loading="lazy"
                                onClick={() => window.open(mediaItems[currentIndex].data.path_full)}
                            />
                        ) : (
                            <video
                                controls
                                poster={mediaItems[currentIndex].data.thumbnail}
                                className="w-full h-full bg-black"
                            >
                                <source src={mediaItems[currentIndex].data.webm?.max} type="video/webm" />
                                Ваш браузер не поддерживает видео.
                            </video>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Миниатюры с использованием Slick Carousel */}
            {mediaItems.length > 1 && (
                <div className="mt-4">
                    <Slider {...thumbnailSettings} ref={thumbnailsRef}>
                        {mediaItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0.7, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`mx-1 snap-start w-24 h-14 overflow-hidden rounded-lg border-2 transition-all duration-300 ease-in-out ${
                                    index === currentIndex
                                        ? 'border-blue-500 ring-2 ring-blue-400 shadow-lg'
                                        : 'border-transparent hover:border-gray-500 hover:shadow-md'
                                } cursor-pointer`}
                                onClick={() => goToSlide(index)}
                            >
                                {item.type === 'image' ? (
                                    <img
                                        src={item.data.path_thumbnail}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="relative w-full h-full bg-gray-800 flex items-center justify-center group">
                                        <PlayIcon className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
                                        <span className="sr-only">Video thumbnail</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </Slider>
                </div>
            )}
        </section>
    );
};
export default MediaCarousel;
