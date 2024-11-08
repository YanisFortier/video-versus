// src/app/utils/VideoRandomizer.tsx
import {VideoItem} from "@/app/models/videoItem";
import {fetchPlaylistVideosWithCache} from "@/app/utils/VideoFetcher";

// Fonction pour obtenir 2 vidéos aléatoires
export function getRandomVideos(videos: VideoItem[]): VideoItem[] {
    if (videos.length < 2) return videos;

    const randomIndices: number[] = [];
    while (randomIndices.length < 2) {
        const randomIndex = Math.floor(Math.random() * videos.length);
        if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex);
        }
    }
    return [videos[randomIndices[0]], videos[randomIndices[1]]];
}

export async function getNewVideos(setVideo1: any, setVideo2: any) {
    const videos = await fetchPlaylistVideosWithCache();
    const [newVid1, newVid2] = getRandomVideos(videos);
    setVideo1(newVid1);
    setVideo2(newVid2);
}
