const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

// Nombres de los archivos en minúscula:
const archivos = [
    path.join(__dirname, "video1.mp4"),
    path.join(__dirname, "video2.mp4"),
    // Para un tercero: path.join(__dirname, "video3.mp4")
];

for (const file of archivos) {
    if (!fs.existsSync(file)) {
        console.error(`No se encontró el archivo: ${file}`);
        process.exit(1);
    }
}

const listaPath = path.join(__dirname, "lista.txt");
const textoLista = archivos.map(file => `file '${file.replace(/\\/g, "/")}'`).join("\n");
fs.writeFileSync(listaPath, textoLista);

const salida = path.join(__dirname, "VIDEOS_UNIDOS.mp4");

console.log('Uniendo videos:', archivos.map(f => path.basename(f)).join(' + '));
ffmpeg()
    .input(listaPath)
    .inputOptions(['-f concat', '-safe 0'])
    .outputOptions('-c copy')
    .on('end', () => {
        console.log('¡Videos unidos correctamente! Archivo generado:', salida);
        fs.unlinkSync(listaPath);
    })
    .on('error', err => {
        console.error('Error al unir los videos:', err.message);
        if (fs.existsSync(listaPath)) fs.unlinkSync(listaPath);
    })
    .save(salida);

