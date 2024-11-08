"use client";  // Cette directive permet d'utiliser des hooks React côté client.

import React, {useEffect, useState} from 'react';
import {VideoItem} from "@/app/models/videoItem";
import {updateElo} from "@/app/seed/route";

const playlistId: string = 'PL8EoGH5rIjYzIkuiRdliVIZDATfxoBT2g';

// Fonction pour charger les vidéos avec cache
async function fetchPlaylistVideosWithCache(): Promise<VideoItem[]> {
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
async function fetchPlaylistVideos(): Promise<VideoItem[]> {
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


// Fonction pour obtenir 2 vidéos aléatoires
function getRandomVideos(videos: VideoItem[]): VideoItem[] {
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

async function getNewVideos(setVideo1: any, setVideo2: any) {
    const videos = await fetchPlaylistVideosWithCache();
    const [newVid1, newVid2] = getRandomVideos(videos);
    setVideo1(newVid1);
    setVideo2(newVid2);
}

const Page = () => {
    const [video1, setVideo1] = useState<VideoItem>();
    const [video2, setVideo2] = useState<VideoItem>();

    // Charger les vidéos lors du montage
    useEffect(() => {
        async function loadVideos() {
            await getNewVideos(setVideo1, setVideo2);
        }

        loadVideos();
    }, []);

    const handleVote = async (winner: VideoItem, loser: VideoItem) => {
        console.log(`Mise à jour Elo pour: gagnant ${winner.videoId}, perdant ${loser.videoId}`);

        const result = await updateElo(winner.videoId, loser.videoId);

        if (result.error) {
            console.error("Erreur de mise à jour ELO :", result.error);
        } else {
            console.log(result.message);
        }

        await getNewVideos(setVideo1, setVideo2);
    };


    return (<>
        <div className="container d-flex justify-content-center align-items-center">
            <div className="row justify-content-evenly w-100">
                <div className="col-4 text-center">
                    <div id="video1" className="video">
                        {video1 && (<iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${video1.videoId}`}
                            allowFullScreen
                        ></iframe>)}
                    </div>
                    <button
                        type="button"
                        className="button-gauche"
                        onClick={() => handleVote(video1 as VideoItem, video2 as VideoItem)}
                    >
                        👍
                    </button>
                </div>
                <div className="col-4 text-center">
                    <div id="video2" className="video">
                        {video2 && (<iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${video2.videoId}`}
                            allowFullScreen
                        ></iframe>)}
                    </div>
                    <button
                        type="button"
                        className="button-droite"
                        onClick={() => handleVote(video2 as VideoItem, video1 as VideoItem)}
                    >
                        👍
                    </button>
                </div>
            </div>
        </div>
    </>);
};

export default Page;
