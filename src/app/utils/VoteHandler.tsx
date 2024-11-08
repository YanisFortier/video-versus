// src/app/utils/VoteHandler.tsx
import {updateElo} from "@/app/database/updateDatabase";
import {VideoItem} from "@/app/models/videoItem";
import {getNewVideos} from "@/app/utils/VideoRandomizer";

// Fonction de gestion des votes
export async function handleVote(winner: VideoItem, loser: VideoItem, setVideo1: any, setVideo2: any) {
    console.log(`Mise à jour Elo pour: gagnant ${winner.videoId}, perdant ${loser.videoId}`);

    const result = await updateElo(winner.videoId, loser.videoId);

    if (result.error) {
        console.error("Erreur de mise à jour ELO :", result.error);
    } else {
        console.log(result.message);
    }

    await getNewVideos(setVideo1, setVideo2);
}
