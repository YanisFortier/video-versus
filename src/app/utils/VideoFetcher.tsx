// src/app/utils/VideoFetcher.tsx
"use client";

import {VideoItem} from "@/app/models/videoItem";

const playlistId: string = 'PL8EoGH5rIjYzIkuiRdliVIZDATfxoBT2g';

// Fonction pour charger les vidéos avec cache
export async function fetchPlaylistVideosWithCache(): Promise<VideoItem[]> {
    const cacheKey = `playlist_${playlistId}`;
    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
        console.log("Chargement des vidéos depuis le cache...");
        return JSON.parse(cachedData).map((item: any) => new VideoItem(item.videoId));
    }

    console.log("Aucun cache détecté, chargement de la playlist...");
    const videos = await fetchPlaylistVideos();
    localStorage.setItem(cacheKey, JSON.stringify(videos));

    return videos;
}

// Fonction pour récupérer les vidéos de la playlist
export async function fetchPlaylistVideos(): Promise<VideoItem[]> {
    const videos: VideoItem[] = [];
    let nextPageToken = '';

    do {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${process.env.NEXT_PUBLIC_API_KEY}`);
        const data = await response.json();

        if (data.items) {
            videos.push(...data.items.map((item: any) => new VideoItem(item.snippet.resourceId.videoId)));
        } else {
            console.error("Erreur dans la réponse de l'API YouTube:", data);
            break;
        }

        nextPageToken = data.nextPageToken || '';
    } while (nextPageToken);

    return videos;
}
