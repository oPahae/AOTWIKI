import {
    GiCastle,
    GiForest,
    GiVillage,
    GiChurch,
    GiIsland,
    GiFactory,
    GiCannon,
    GiPagoda,
} from "react-icons/gi";

export const WALLS = [
    {
        name: "Wall Maria",
        subtitle: "The outer rampart",
        img: "/walls/maria.jfif",
        desc:
            "The outermost and widest of the three walls, standing roughly 50 meters tall. It encircles the kingdom's most exposed farmland and shelters its poorest districts. It was at Shiganshina, its southernmost point, that the Colossal Titan tore open the first breach in the year 845, leading to the fall of the entire wall and the invasion of the lands it protected.",
    },
    {
        name: "Wall Rose",
        subtitle: "The middle rampart",
        img: "/walls/rose.webp",
        desc:
            "The second line of defense, protecting the land reclaimed after the loss of Wall Maria. Its population, swollen by hundreds of thousands of refugees, is spread across farming villages and small garrison towns. Wall Rose was breached in turn at Trost in the year 850, an event that saw Eren Jaeger transform into a Titan for the very first time.",
    },
    {
        name: "Wall Sina",
        subtitle: "The inner rampart",
        img: "/walls/sina.webp",
        desc:
            "The smallest and oldest of the three walls, never once breached by a Titan. It protects Mitras, the royal capital, along with the nobility and the central government. Behind this wall lie some of the heaviest secrets concerning the true nature of the world.",
    },
];

export const WALL_MARIA_PLACES = [
    {
        name: "Shiganshina District",
        img: "/walls/shiganshina.png",
        desc:
            "The southernmost town of Wall Maria, hometown of Eren, Mikasa, and Armin. Razed in the year 845 during the first appearance of the Colossal and Armored Titans, it marks the true starting point of the story. Beneath this city, Grisha Jaeger also hid a basement holding the answers to the origin of the Titans and the outside world.",
    },
    {
        name: "Yarckel District",
        img: "/walls/yarckel.webp",
        desc:
            "A town of Wall Maria, lost alongside Shiganshina during the 845 invasion. Its residents were among the many refugees later crammed into the camps of Wall Rose.",
    },
    {
        name: "Krolva District",
        img: "/walls/krolva.webp",
        desc:
            "Another district of Wall Maria that fell during the initial breach. Its fate, like Yarckel's, illustrates the scale of the disaster that cost humanity nearly a fifth of its territory.",
    },
];

export const WALL_ROSE_PLACES = [
    {
        name: "Trost District",
        img: "/walls/trost.png",
        desc:
            "A large garrison town in Wall Rose and the site of the famous Battle of Trost in the year 850. Here the Colossal Titan strikes again, and Eren sacrifices himself to seal the breach, revealing to the world his ability to transform into a Titan.",
    },
    {
        name: "Karanes District",
        img: "/walls/karanes.png",
        desc:
            "A town hosting enormous refugee camps after the fall of Wall Maria. It's also the site of the graduation ceremony where new cadets choose their military branch — the same ceremony infamously interrupted by news of the retaking of Trost.",
    },
    {
        name: "Ehrmich District",
        img: "/walls/ehrmich.png",
        desc:
            "Home to the military tribunal where Eren is publicly tried after his capture, in front of the Military Police, the Survey Corps, and the Garrison, each vying for control over him.",
    },
];

export const WALL_SINA_PLACES = [
    {
        name: "Mitras, the Royal Capital",
        img: "/walls/mitras.png",
        desc:
            "The seat of power, home to the king and the central government. The wealthiest and best-protected city on Paradis, housing the nobility as well as the Military Police headquarters.",
    },
    {
        name: "Stohess District",
        img: "/walls/stohess.png",
        desc:
            "An elegant town within Wall Sina, the setting for the climax of the Female Titan arc: the hunt for and crystallization of Annie Leonhart in the heart of its streets.",
    },
    {
        name: "Orvud District",
        img: "/walls/orvud.png",
        desc:
            "A border town between Wall Rose and Wall Sina, targeted by a bombardment from the Beast Titan during the uprising against the central government, in an attempt to protect Historia Reiss.",
    },
];

export const SPECIAL_SITES = [
    {
        name: "The Underground City",
        icon: GiVillage,
        img: "/places/underground.jpg",
        desc:
            "A city built literally beneath the capital, cut off from sunlight. A forgotten quarter where the poorest and outlaws survive, including Levi, Farlan, and Isabel before their forced enlistment into the Survey Corps.",
    },
    {
        name: "Utgard Castle",
        icon: GiCastle,
        img: "/places/utgard.webp",
        desc:
            "An abandoned fortress used as a shelter by the 104th Training Corps during the expedition meant to unmask the Female Titan. It becomes the stage for Annie Leonhart's decisive attack on her own former comrades.",
    },
    {
        name: "Forest of Giant Trees",
        icon: GiForest,
        img: "/places/forest.jpg",
        desc:
            "A woodland of oversized trees at the edge of Wall Rose. Its unique terrain allows the Survey Corps to make full use of their omni-directional mobility gear during the confrontation with the Female Titan.",
    },
    {
        name: "Ragako Village",
        icon: GiVillage,
        img: "/places/ragako.webp",
        desc:
            "A quiet farming village within Wall Rose, completely wiped out by the Female Titan on her way to Trost. Its villagers, transformed into mindless Titans, remain one of the series' most chilling images.",
    },
    {
        name: "The Reiss Family Chapel",
        icon: GiChurch,
        img: "/places/chapel.webp",
        desc:
            "A hidden underground sanctuary beneath an isolated estate, secret seat of the cult devoted to the royal bloodline. It's here that Historia's fate and the secret of the Founding Titan come to a head.",
    },
];

export const WORLD_PLACES = [
    {
        name: "Paradis Island",
        icon: GiIsland,
        img: "/eyecatch/target.webp",
        desc:
            "The full island on which the story takes place — Wall Maria, Wall Rose, and Wall Sina occupy only its interior. Ringed by cliffs and, for a hundred years, believed to be the last refuge of humanity, Paradis sits alone in the ocean, isolated from the rest of the world by both geography and by the lie the government told its own people.",
    },
    {
        name: "Marley",
        icon: GiCannon,
        img: "/places/marley.jpg",
        desc:
            "A powerful nation on the mainland across the sea, controlling much of the outside world through military might and the export constant threat of its Titan forces. Marley subjugated Eldians for generations and shaped global politics around the fear of the Titans it commands.",
    },
    {
        name: "Liberio",
        icon: GiFactory,
        img: "/places/liberio.webp",
        desc:
            "An internment zone inside Marley where Eldians are confined and treated as second-class citizens, forced to prove their loyalty through military service. Liberio is the setting for the Warrior candidates' ceremony and the devastating raid launched against it later in the story.",
    },
    {
        name: "Fort Slava",
        icon: GiCannon,
        img: "/places/slava.jfif",
        desc:
            "A heavily fortified Marleyan military base, showcasing the nation's technological and naval power. It represents the vast military gap between Marley and the isolated, low-tech society of Paradis.",
    },
    {
        name: "Hizuru",
        icon: GiPagoda,
        img: "/places/hizuru.jfif",
        desc:
            "A distant Eastern nation and one of the few to resist full Marleyan domination, later becoming an ally of Paradis. It is the ancestral homeland of Kiyomi Azumabito and holds a historical connection to Mikasa's bloodline through the Ackerman clan.",
    },
];