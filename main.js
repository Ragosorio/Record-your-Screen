const stop = document.getElementById("stop");
const start = document.getElementById("start");

let mediaStream;

async function startRecording() {
    start.disabled = true;
    try {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: { ideal: 60 } },
            audio: true
        });

        const anchoVideo = screen.innerWidth;
        const altoVideo = screen.innerHeight;

        const videoTrack = mediaStream.getVideoTracks()[0];
        const constraints = {
            width: { ideal: anchoVideo },
            height: { ideal: altoVideo }
        };
        videoTrack.applyConstraints(constraints);

        const mediarecorder = new MediaRecorder(mediaStream, {
            mimeType: "video/webm;codecs=h264,opus",
            bitsPerSecond: 10000000
        });

        mediarecorder.start();

        const stopRecording = () => {
            mediarecorder.stop();
            mediaStream.getTracks().forEach(track => track.stop());
            start.disabled = false;
        };

        stop.addEventListener("click", stopRecording);
        mediarecorder.addEventListener("dataavailable", (e) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(e.data);
            link.download = "captura.webm";
            link.click();
        });
    } catch (err) {
        if (err != "NotAllowedError: Permission denied") {
            alert("Tu dispositivo no es compatible 😔")
        }
        start.disabled = false;
    }
}

start.addEventListener("click", startRecording);