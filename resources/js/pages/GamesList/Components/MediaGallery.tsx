import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Screenshot {
    id: number;
    url?: string;
}

interface Video {
    id: number;
    title: string;
    thumbnail?: string;
    videoUrl?: string;
}

interface MediaGalleryProps {
    screenshots: Screenshot[];
    videos: Video[];
    activeMediaTab: 'screenshots' | 'videos';
    setActiveMediaTab: (tab: 'screenshots' | 'videos') => void;
    gameName: string;
}

export default function MediaGallery({
                                         screenshots,
                                         videos,
                                         activeMediaTab,
                                         setActiveMediaTab,
                                         gameName
                                     }: MediaGalleryProps) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewVideo, setPreviewVideo] = useState<Video | null>(null);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Настройки слайдера
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ],
        afterChange: (index: number) => setCurrentSlideIndex(index)
    };

    // Формируем список URL для lightbox
    const screenshotUrls = screenshots
        .map(s => s.url)
        .filter(Boolean) as string[];

    return (
        <div className="px-6 pb-4">
            {/* Табы */}
            <div className="border-b border-gray-700 mb-6 pb-1">
                <nav className="flex space-x-6">
                    {screenshots.length > 0 && (
                        <button
                            onClick={() => setActiveMediaTab('screenshots')}
                            className={`font-medium text-sm flex items-center gap-2 px-3 py-2 rounded-t-lg transition-colors ${
                                activeMediaTab === 'screenshots'
                                    ? 'text-blue-400 border-b-2 border-blue-500'
                                    : 'text-gray-400 hover:text-gray-300'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v10H4V5z" />
                                <path d="M9 11a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                            Screenshots ({screenshots.length})
                        </button>
                    )}
                    {videos.length > 0 && (
                        <button
                            onClick={() => setActiveMediaTab('videos')}
                            className={`font-medium text-sm flex items-center gap-2 px-3 py-2 rounded-t-lg transition-colors ${
                                activeMediaTab === 'videos'
                                    ? 'text-blue-400 border-b-2 border-blue-500'
                                    : 'text-gray-400 hover:text-gray-300'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                <path d="M2 10a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z" />
                                <path d="M12 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2z" />
                                <path d="M12 10a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-6z" />
                            </svg>
                            Videos ({videos.length})
                        </button>
                    )}
                </nav>
            </div>

            {/* Скриншоты */}
            {activeMediaTab === 'screenshots' && screenshots.length > 0 && (
                <Slider {...sliderSettings}>
                    {screenshots.map((screenshot) => {
                        const url = screenshot.url;
                        return (
                            <div key={screenshot.id} className="px-2">
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => url && setPreviewImage(url)}
                                >
                                    <img
                                        src={url || ''}
                                        alt={`${gameName} - Screenshot ${screenshot.id}`}
                                        className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-xl shadow-md hover:shadow-xl transition-shadow"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://via.placeholder.com/800x450/1a202c/718096?text=No+Image ';
                                        }}
                                    />
                                    <div
                                        className="absolute inset-0 bg-black/0 group-hover:bg-black/40 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white text-xs">Click to preview</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </Slider>
            )}

            {/* Видео */}
            {activeMediaTab === 'videos' && videos.length > 0 && (
                <Slider {...sliderSettings}>
                    {videos.map((video) =>
                        (
                            <div key={video.id} className="px-2">
                                <div
                                    className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                                    onClick={() => setPreviewVideo(video)}
                                >
                                    {video.thumbnail ? (
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-40 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                            No Thumbnail
                                        </div>
                                    )}
                                    <div
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform"
                                            aria-label={`Play ${video.title}`}
                                        >
                                            <svg
                                                className="w-5 h-5 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div
                                        className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                                        <p className="text-white truncate">{video.title}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </Slider>
            )}

            {/* Lightbox для скриншотов */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                    onClick={() => setPreviewImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-bold"
                        onClick={() => setPreviewImage(null)}
                    >
                        &times;
                    </button>

                    {/* Контейнер для навигации */}
                    <div
                        className="relative max-w-4xl max-h-screen w-full h-full flex items-center justify-between px-4">
                        {/* Кнопка "Предыдущий" */}
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold"
                            onClick={(e) => {
                                e.stopPropagation();
                                const newIndex = currentSlideIndex === 0
                                    ? screenshotUrls.length - 1
                                    : currentSlideIndex - 1;

                                setCurrentSlideIndex(newIndex);
                                setPreviewImage(screenshotUrls[newIndex]);
                            }}
                        >
                            ‹
                        </button>

                        {/* Изображение */}{' '}
                        <img
                            src={previewImage}
                            alt="Fullscreen Preview"
                            className="max-w-full max-h-screen object-contain z-10"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Кнопка "Следующий" */}
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl font-bold"
                            onClick={(e) => {
                                e.stopPropagation();
                                const newIndex = currentSlideIndex === screenshotUrls.length - 1
                                    ? 0
                                    : currentSlideIndex + 1;

                                setCurrentSlideIndex(newIndex);
                                setPreviewImage(screenshotUrls[newIndex]);
                            }}
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}

            {/* Модальное окно для видео */}
            {previewVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
                    onClick={() => setPreviewVideo(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPreviewVideo(null);
                        }}
                    >
                        &times;
                    </button>

                    <div className="relative w-full max-w-4xl aspect-video mx-auto">
                        <video
                            src={previewVideo.videoUrl || ''}
                            controls
                            autoPlay
                            className="w-full h-full rounded-lg shadow-2xl"
                            onLoadedMetadata={() => {
                            }}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}
        </div>
    );
}
