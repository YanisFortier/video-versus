import dotenv from 'dotenv';
import fs from 'fs';
import pkg from 'pg';

dotenv.config();

const {Client} = pkg;

// Configuration de la connexion à la BDD depuis les variables d'environnement
const client = new Client({
    connectionString: process.env.POSTGRES_URL
})

async function saveVideosToDatabase(videos) {
    try {
        await client.connect();
        console.log("Connexion à la base de données établie.");

        for (const video of videos) {
            const youtubeId = video.snippet.resourceId.videoId;

            // Vérifie si la vidéo est déjà présente dans la BDD
            const res = await client.query('SELECT video_id FROM videos WHERE youtube_id = $1', [youtubeId]);

            if (res.rowCount === 0) {
                // Insère la vidéo dans la BDD si elle n'existe pas encore
                await client.query('INSERT INTO videos (youtube_id) VALUES ($1)', [youtubeId]);
                console.log(`Vidéo ajoutée : (${youtubeId})`);
            } else {
                console.log(`Vidéo déjà présente : (${youtubeId})`);
            }
        }
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des vidéos :", error);
    } finally {
        await client.end();
        console.log("Connexion à la base de données fermée.");
    }
}

// Récupère les vidéos et les sauvegarde dans la BDD
(async function () {
    const videos = JSON.parse(fs.readFileSync('./videosCache.json', 'utf-8'));
    if (videos.length === 0) {
        console.log("Aucune vidéo à sauvegarder.");
        return;
    }
    await saveVideosToDatabase(videos);
})();