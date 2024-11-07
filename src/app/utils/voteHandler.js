export async function updateElo(winnerId, loserId) {
    const dbUrl = "postgres://default:gw8nG4OxpMcK@ep-cool-recipe-a2ca1g3r-pooler.eu-central-1.aws.neon.tech:5432/verceldb?sslmode=require"; // URL de la BDD, fournie dans .env

    try {
        // Requête SQL pour appeler la fonction update_elo
        const query = `SELECT update_elo('${winnerId}', '${loserId}')`;

        const response = await fetch(dbUrl, {
            method: 'POST', headers: {
                'Content-Type': 'application/sql', // Indique que la requête est SQL
            }, body: query
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la mise à jour du score ELO: ${response.statusText}`);
        }

        console.log("Score ELO mis à jour avec succès");
    } catch (error) {
        console.error("Erreur:", error);
    }
}
