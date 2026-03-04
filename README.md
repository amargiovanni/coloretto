# Coloretto

**Collezione di giochi educativi per bambini** - Una Progressive Web App touch-friendly, installabile e utilizzabile offline.

---

## Giochi Disponibili

| Gioco | Descrizione |
|-------|-------------|
| **Coloretto** | Colora bellissimi disegni toccando le aree e scegliendo i colori |
| **Memory Animali** | Trova le coppie di animali nascosti nelle carte |
| **Trova le Forme** | Trascina le forme geometriche nella posizione corretta |
| **Conta gli Oggetti** | Conta gli elementi sullo schermo e premi il numero giusto |
| **Vesti l'Animale** | Personalizza simpatici animali con cappelli, occhiali e sciarpe |
| **Puzzle Semplici** | Ricomponi le immagini trascinando i pezzi al posto giusto |

---

## Caratteristiche

- **Installabile** - Aggiungi alla schermata home come una vera app
- **Funziona Offline** - Gioca anche senza connessione internet
- **Touch-Optimized** - Progettato per dita piccole su tablet e smartphone
- **Nessun Account** - Nessuna registrazione, nessun dato raccolto
- **Gratuito** - Completamente gratuito, senza pubblicità

---

## Tecnologie

- [Astro](https://astro.build) - Framework web moderno per siti statici veloci
- Service Worker con strategia cache-first per funzionamento offline
- Web App Manifest per installazione nativa
- TypeScript per codice robusto e manutenibile
- SVG inline per grafica scalabile e leggera

---

## Sviluppo

### Requisiti

- Node.js 18+
- npm

### Installazione

```bash
npm install
```

### Comandi

```bash
# Avvia server di sviluppo
npm run dev

# Build per produzione (genera anche le icone PWA)
npm run build

# Anteprima build di produzione
npm run preview

# Genera solo le icone PWA
npm run icons
```

---

## Struttura Progetto

```
coloretto/
├── public/
│   ├── sw.js              # Service Worker
│   ├── manifest.webmanifest
│   └── icons/             # Icone PWA
├── scripts/
│   └── generate-icons.mjs # Generazione icone da SVG
├── src/
│   ├── components/        # Componenti riutilizzabili
│   ├── layouts/           # Layout base
│   └── pages/             # Pagine dei giochi
└── package.json
```

---

## Aggiornamenti Service Worker

Per distribuire aggiornamenti:

1. Modifica i file del progetto
2. Incrementa `VERSION` in `public/sw.js`
3. Esegui build e deploy

Il nuovo Service Worker si attiverà automaticamente e la pagina si ricaricherà per mostrare le novità.

---

## License

MIT
