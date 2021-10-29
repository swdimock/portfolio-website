import useTranslation from 'next-translate/useTranslation';
import media1 from "./media-1.jpg";
import media2 from "./media-2.jpg";
import media3 from "./media-3.jpg";
import media4 from "./media-4.jpg";

// const { t, lang } = useTranslation('common');
export const media = [
    {
        image: media1,
        title: 'WebBuy',
        position: 'Chief Technology Officer',
        description: 'A leader in the automotive digital retailing, WebBuy is changing the world of consumer car buying.  My role overarches the engineering, support, and installation teams.  My job has extended from the original concepualization of the application\'s functionality through the end-to-end architecture and development of the application from the ground up.',
    },
    {
        image: media2,
        title: 'Webgrain',
        position: 'Chief Technology Officer / Partner',
        description: 'As a partner in Webgrain I helped to build a business of over 400 website and application clients.  We developed custom solutions for a wide variety of clientele as well a providing follow up support and hosting services.',
    },
    {
        image: media3,
        title: 'Furnace',
        position: 'Founder',
        description: '',
    },
    {
        image: media4,
        title: 'AgentAuto',
        position: 'Founder',
        description: '',
    },
];
export const mediaByIndex: any = (index: number) => media[index % media.length];
