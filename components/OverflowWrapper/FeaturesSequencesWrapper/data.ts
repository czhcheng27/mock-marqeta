import fundingOverlayImg from '@/public/videos/features/funding/overlay.png';

import controlsOverlayImg from '@/public/videos/features/controls/overlay.png';
import widgetsOverlayImg from '@/public/videos/features/widgets/overlay.png';
import cardsOverlayImg from '@/public/videos/features/cards/overlay.png';

export const IndexFeaturesSequence = [
    {
        dataTp: 'funding',
        dataView: 'IndexFeatures-Funding',
        videoShow: [
            {
                type: 'show',
                videoSrc: '/videos/features/funding/show.mp4',
                dataTimeOut: 347,
                opacity: 0,

            },
            {
                type: 'hover',
                videoSrc: '/videos/features/funding/hover.mp4',
                dataTimeOut: 865,
                opacity: 1,
            },
            {
                type: 'unhover',
                videoSrc: '/videos/features/funding/unhover.mp4',
                dataTimeOut: 875,
                opacity: 0,
            }
        ],
        imgSrc: fundingOverlayImg,
        link: 'jit-funding',
        title: 'JIT Funding',
    },
    {
        dataTp: 'controls',
        dataView: 'IndexFeatures-Controls',
        videoShow: [
            {
                type: 'show',
                videoSrc: '/videos/features/controls/show.mp4',
                dataTimeOut: 357,
                opacity: 0,
            },
            {
                type: 'hover',
                videoSrc: '/videos/features/controls/hover.mp4',
                dataTimeOut: 587,
                opacity: 1,
            },
            {
                type: 'unhover',
                videoSrc: '/videos/features/controls/unhover.mp4',
                dataTimeOut: 593,
                opacity: 0,
            }
        ],
        imgSrc: controlsOverlayImg,
        link: 'dynamic-spend-controls',
        title: 'Dynamic spend controls',
    },
    {
        dataTp: 'widgets',
        dataView: 'IndexFeatures-Widgets',
        videoShow: [
            {
                type: 'show',
                videoSrc: '/videos/features/widgets/show.mp4',
                dataTimeOut: 351,
                opacity: 0,
            },
            {
                type: 'hover',
                videoSrc: '/videos/features/widgets/hover.mp4',
                dataTimeOut: 857,
                opacity: 1,
            },
            {
                type: 'unhover',
                videoSrc: '/videos/features/widgets/unhover.mp4',
                dataTimeOut: 864,
                opacity: 0,
            }
        ],
        imgSrc: widgetsOverlayImg,
        link: 'pci-compliant-widgets',
        title: 'PCI widgets',
    },
    {
        dataTp: 'cards',
        dataView: 'IndexFeatures-Cards',
        videoShow: [
            {
                type: 'show',
                videoSrc: '/videos/features/cards/show.mp4',
                dataTimeOut: 348,
                opacity: 0,
            },
            {
                type: 'hover',
                videoSrc: '/videos/features/cards/hover.mp4',
                dataTimeOut: 617,
                opacity: 1,
            },
            {
                type: 'unhover',
                videoSrc: '/videos/features/cards/unhover.mp4',
                dataTimeOut: 975,
                opacity: 0,
            }
        ],
        imgSrc: cardsOverlayImg,
        link: 'virtual-cards',
        title: 'Issue virtual cards',
    },
];
