import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

export default function LeitorQr({ onLer, disabled }) {
    const [aberto, setAberto] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const videoRef = useRef(null);
    const onLerRef = useRef(onLer);
    useEffect(() => { onLerRef.current = onLer; }, [onLer]);

    useEffect(() => {
        if (!aberto || disabled) return;
        let cancelado = false;
        let stream;
        let timer;
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        const contexto = canvas.getContext("2d", { willReadFrequently: true });
        const parar = () => stream?.getTracks().forEach((track) => track.stop());

        function lerFrame() {
            if (cancelado) return;
            try {
                if (video.readyState >= 2 && video.videoWidth > 0) {
                    canvas.width = Math.min(video.videoWidth, 640);
                    canvas.height = Math.round(video.videoHeight * canvas.width / video.videoWidth);
                    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const pixels = contexto.getImageData(0, 0, canvas.width, canvas.height);
                    const resultado = jsQR(pixels.data, pixels.width, pixels.height);
                    if (resultado) {
                        const erro = onLerRef.current(resultado.data);
                        if (!erro) {
                            parar();
                            setAberto(false);
                            setMensagem("QR code reconhecido. Destino preenchido.");
                            return;
                        }
                        setMensagem(erro);
                    }
                }
                timer = setTimeout(lerFrame, 150);
            } catch {
                parar();
                setAberto(false);
                setMensagem("Não foi possível ler a câmera. Tente abrir novamente.");
            }
        }

        async function iniciar() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: { facingMode: { ideal: "environment" } },
                });
                if (cancelado) { parar(); return; }
                video.srcObject = stream;
                await video.play();
                if (!cancelado) {
                    setMensagem("Aponte para o QR code do silo.");
                    lerFrame();
                }
            } catch (erro) {
                parar();
                if (cancelado) return;
                setAberto(false);
                setMensagem(erro.name === "NotAllowedError"
                    ? "Permita o acesso à câmera nas configurações do navegador."
                    : erro.name === "NotFoundError"
                      ? "Nenhuma câmera encontrada neste dispositivo."
                      : "Não foi possível abrir a câmera. Feche outros aplicativos que a utilizam e tente novamente.");
            }
        }
        iniciar();
        return () => {
            cancelado = true;
            clearTimeout(timer);
            parar();
            video.srcObject = null;
        };
    }, [aberto, disabled]);

    function abrir() {
        if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
            setMensagem("Para usar a câmera, abra o site por HTTPS (ou localhost no próprio computador).");
            return;
        }
        setMensagem("Solicitando acesso à câmera...");
        setAberto(true);
    }

    return <div className="qr-reader">
        {aberto && !disabled && <video ref={videoRef} autoPlay muted playsInline aria-label="Câmera para leitura do QR code" />}
        <p>Leia a etiqueta do silo para preencher o destino.</p>
        {mensagem && <p role="status">{mensagem}</p>}
        <button type="button" className="conference-secondary-button" disabled={disabled}
            onClick={aberto ? () => { setAberto(false); setMensagem("Câmera fechada."); } : abrir}>
            {aberto ? "Fechar câmera" : "Ler QR code"}
        </button>
        {disabled && <small>O leitor fica disponível antes de iniciar a simulação.</small>}
    </div>;
}
