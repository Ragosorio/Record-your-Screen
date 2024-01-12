const stop = document.getElementById("stop")
const start = document.getElementById("start")

start.addEventListener("click", async () => {
    start.disabled = true
    try {
        const media = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: { ideal: 60 } }
        });

        // Obtener la pista de video y aplicar restricciones de resolución
        const videoTrack = media.getVideoTracks()[0];
        const constraints = {
            width: { ideal: 1920 },  // Ajusta según sea necesario
            height: { ideal: 1080 }  // Ajusta según sea necesario
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
        console.err("ERROR DEL PROGRAMA: ", err)
    }
})