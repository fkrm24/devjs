const http = require('http');
const fs = require('fs');
const path = require('path');

// On sélectionne une citation aléatoirement
let lastCitation = ''; // Stocke la dernière citation affichée

function random(items) {
    return items[Math.floor(Math.random() * items.length)];
}

// Création du serveur HTTPgit
const server = http.createServer((req, res) => {
    // Vérifie si l'URL est "/home"
    if (req.url === '/home') {
        fs.readFile('citations.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Erreur lors de la lecture du fichier");
                return;
            }

            const citations = JSON.parse(data);
            let citationAleatoire;

            // Évite de répéter la dernière citation
            do {
                citationAleatoire = random(citations);
            } while (citationAleatoire.citation === lastCitation);

            lastCitation = citationAleatoire.citation; 
            const responseText = `${citationAleatoire.citation} - ${citationAleatoire.auteur}`;
            
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(responseText);
        });

    } else if (req.url.startsWith('/search')) {
        // Récupère le mot-clé à partir de l'URL
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const keyword = urlParams.get('keyword');

        if (!keyword) {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Mot-clé non fourni');
            return;
        }

        // Lecture du fichier de citations
        fs.readFile('citations.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Erreur lors de la lecture du fichier");
                return;
            }

            const citations = JSON.parse(data);
            // Filtrer les citations contenant le mot-clé
            const citationsFiltrees = citations.filter(citation =>
                citation.citation.toLowerCase().includes(keyword.toLowerCase())
            );

            if (citationsFiltrees.length === 0) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(`Aucune citation trouvée contenant le mot "${keyword}".`);
            } else {
                const resultText = citationsFiltrees.map(c =>
                    `${c.citation} - ${c.auteur}`
                ).join('\n');
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(resultText);
            }
        });

    } else if (req.url === '/newhome') {
        // Servir le fichier index.html
        fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end("Erreur lors de la lecture du fichier HTML");
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });

    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found');
    }
});

server.listen(8889, 'localhost', () => {
    console.log('Serveur à l\'écoute sur localhost:8889');
});
