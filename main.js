const stop = document.getElementById("stop")
const start = document.getElementById("start")

async function startRecording() {
    start.disabled = true
    try {
        const media = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: { ideal: 60 } }
        });

        const anchoVideo = screen.innerWidth;
        const altoVideo = screen.innerHeight;

        // Obtener la pista de video y aplicar restricciones de resolución
        const videoTrack = media.getVideoTracks()[0];
        const constraints = {
            width: { ideal: anchoVideo },  // Ajusta según sea necesario
            height: { ideal: altoVideo }  // Ajusta según sea necesario
        };
        videoTrack.applyConstraints(constraints);

        // Configuración de MediaRecorder
        const mediarecorder = new MediaRecorder(media, {
            mimeType: "video/webm;codecs=h264,opus",
            bitsPerSecond: 10000000
        });

        // Iniciar la grabación
        mediarecorder.start();

        // Manejar eventos de parada
        const stopRecording = () => {
            videoTrack.stop();
            mediarecorder.stop();
            start.disabled = false
        };

        stop.addEventListener("click", stopRecording);
        stop.addEventListener("touchstart", stopRecording);
        videoTrack.addEventListener("ended", stopRecording);

        // Manejar eventos de datos disponibles
        mediarecorder.addEventListener("dataavailable", (e) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(e.data);
            link.download = "captura.webm";
            link.click();
        });
    }
    catch (err) {
        console.error("ERROR DEL PROGRAMA: ", err)
        alert(err)
        start.disabled = false
    }
}

start.addEventListener("click", startRecording)
start.addEventListener("touchstart", startRecording)