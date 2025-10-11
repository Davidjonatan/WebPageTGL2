import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

interface Image {
  src: string;
  alt?: string;
}

interface Props {
  images: Image[];
  initialIndex: number;
  onClose: () => void;
}

export default function HowItWorksGalleryModal({ images, initialIndex, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [fullscreen, setFullscreen] = useState(false);
  const [slideShow, setSlideShow] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // posición y dragging
  const positionRef = useRef({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startPositionRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);
  const CLICK_THRESHOLD = 6; // px para distinguir click vs drag
  const ZOOM_SCALE = 2;

  // Bloqueo scroll al abrir
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (fullscreen && document.fullscreenElement) document.exitFullscreen();
    };
  }, []);

  // slideshow
  useEffect(() => {
    if (!slideShow) return;
    const id = setInterval(() => setCurrentIndex((p) => (p + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, [slideShow]);

  const prev = () => setCurrentIndex((p) => (p - 1 + images.length) % images.length);
  const next = () => setCurrentIndex((p) => (p + 1) % images.length);

  const toggleFullscreen = async () => {
    if (!fullscreen) {
      await document.documentElement.requestFullscreen?.();
      setFullscreen(true);
    } else {
      if (document.fullscreenElement) await document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  const handleClose = async () => {
    if (fullscreen && document.fullscreenElement) await document.exitFullscreen?.();
    onClose();
  };

  // --- Helpers para límites de arrastre ---
  const computeBounds = () => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return { maxX: 0, maxY: 0 };

    // ancho/alto actual de la imagen tal como está renderizada (sin scale)
    const renderedW = img.clientWidth;
    const renderedH = img.clientHeight;

    // tamaño con zoom
    const zoomW = renderedW * ZOOM_SCALE;
    const zoomH = renderedH * ZOOM_SCALE;

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;

    const maxX = Math.max(0, (zoomW - containerW) / 2);
    const maxY = Math.max(0, (zoomH - containerH) / 2);

    return { maxX, maxY };
  };

  const clampPosition = (x: number, y: number) => {
    const { maxX, maxY } = computeBounds();
    const nx = Math.max(-maxX, Math.min(maxX, x));
    const ny = Math.max(-maxY, Math.min(maxY, y));
    return { x: nx, y: ny };
  };

  // --- Pointer handlers (funcionan con mouse y touch) ---
  const onPointerDown = (e: PointerEvent) => {
    // solo si estamos en zoomed permiten arrastrar
    if (!zoomed) return;

    // evitar selección/drag nativo
    e.preventDefault();

    const target = imgRef.current;
    if (!target) return;

    // capturar pointer para recibir move/up aunque salga del elemento
    try {
      target.setPointerCapture(e.pointerId);
    } catch (err) {
      // algunos navegadores pueden no soportar, ignorar
    }

    pointerIdRef.current = e.pointerId;
    draggingRef.current = true;
    movedRef.current = false;

    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startPositionRef.current = { ...positionRef.current };
  };

  const onPointerMove = (e: PointerEvent) => {
    // solo procesa si pointer id coincide y estamos arrastrando
    if (!draggingRef.current || pointerIdRef.current !== e.pointerId) return;
    e.preventDefault();

    const dx = e.clientX - startPointerRef.current.x;
    const dy = e.clientY - startPointerRef.current.y;

    if (!movedRef.current && Math.hypot(dx, dy) > CLICK_THRESHOLD) {
      movedRef.current = true;
    }

    const candidateX = startPositionRef.current.x + dx;
    const candidateY = startPositionRef.current.y + dy;
    const clamped = clampPosition(candidateX, candidateY);
    positionRef.current = clamped;
    setPosition(clamped);
  };

  const finishPointer = (e?: PointerEvent) => {
    // release capture si es posible
    try {
      if (pointerIdRef.current != null && imgRef.current) {
        imgRef.current.releasePointerCapture(pointerIdRef.current);
      }
    } catch (err) {}

    // si no se movió (click) entonces togglear zoom
    if (!movedRef.current) {
      // si no estabamos en zoom -> activar zoom
      if (!zoomed) {
        setZoomed(true);
        // resetear posición al entrar en zoom
        positionRef.current = { x: 0, y: 0 };
        setPosition({ x: 0, y: 0 });
      } else {
        // si ya estabamos en zoom y solo hicimos click sin mover -> salir del zoom
        setZoomed(false);
        positionRef.current = { x: 0, y: 0 };
        setPosition({ x: 0, y: 0 });
      }
    } else {
      // si hubo movimiento, mantener zoom (no toggle), solo finalizar arrastre
    }

    draggingRef.current = false;
    pointerIdRef.current = null;
    movedRef.current = false;
  };

  // Asegurar que capturemos el pointerup global aunque el pointer salga
  useEffect(() => {
    const onGlobalPointerUp = (ev: PointerEvent) => {
      if (!draggingRef.current) return;
      finishPointer(ev);
    };
    window.addEventListener("pointerup", onGlobalPointerUp);
    window.addEventListener("pointercancel", onGlobalPointerUp);
    return () => {
      window.removeEventListener("pointerup", onGlobalPointerUp);
      window.removeEventListener("pointercancel", onGlobalPointerUp);
    };
  }, [zoomed]);

  // Evitar doble trigger por click nativo: desactivamos onClick en img y usamos pointerup logic.
  // Pero para navegadores antiguos que no soporten pointer events, aún tenemos onClick fallback:
  const onImgClickFallback = (e: MouseEvent) => {
    // si pointer events está manejando, no hacer nada
    // fallback: si no hubo movimiento -> toggle
    if (!('onpointerdown' in window)) {
      if (!zoomed) {
        setZoomed(true);
      } else {
        setZoomed(false);
        setPosition({ x: 0, y: 0 });
        positionRef.current = { x: 0, y: 0 };
      }
    }
  };

  // keyboard arrows opcional (izq/der)
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowLeft") prev();
      else if (ev.key === "ArrowRight") next();
      else if (ev.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // estilos cursor dinámico
  const cursorStyle = draggingRef.current ? "grabbing" : zoomed ? "grab" : "zoom-in";

  return (
    <div
      ref={containerRef}
      class={`fixed inset-0 z-50 flex items-center justify-center ${fullscreen ? "bg-black/95" : "bg-black/80"}`}
      // prevenir scroll cuando se arrastra (touch)
      onTouchMove={(ev) => { if (zoomed && draggingRef.current) ev.preventDefault(); }}
    >
      {/* CONTROLES EXTERNOS */}
      <div class={`absolute ${fullscreen ? "top-6 right-6" : "top-4 right-4"} z-50 flex gap-2`}>
        {/* Fullscreen */}
        <button onClick={toggleFullscreen} class="p-1 rounded hover:bg-white/20" aria-label="Fullscreen">
          {fullscreen ? ( 
            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff" strokeWidth={2} class="w-6 h-6">
              <polyline points="52 40 40 40 40 52"></polyline>
              <line x1="40" y1="40" x2="56" y2="56"></line>
              <polyline points="24 52 24 40 12 40"></polyline>
              <line x1="24" y1="40" x2="8" y2="56"></line>
              <polyline points="12 24 24 24 24 12"></polyline>
              <line x1="24" y1="24" x2="8" y2="8"></line>
              <polyline points="40 12 40 24 52 24"></polyline>
              <line x1="40" y1="24" x2="56" y2="8"></line>
            </svg>
           
          ) : ( 
            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff" strokeWidth={2} class="w-6 h-6">
              <polyline points="20 8 8 8 8 20"></polyline>
              <line x1="8" y1="8" x2="24" y2="24"></line>
              <polyline points="56 20 56 8 44 8"></polyline>
              <line x1="56" y1="8" x2="40" y2="24"></line>
              <polyline points="44 56 56 56 56 44"></polyline>
              <line x1="56" y1="56" x2="40" y2="40"></line>
              <polyline points="8 44 8 56 20 56"></polyline>
              <line x1="8" y1="56" x2="24" y2="40"></line>
            </svg>
           
          )}
        </button>

        {/* Slide show */}
        <button onClick={() => setSlideShow((s) => !s)} class="p-1 rounded hover:bg-white/20" aria-label="Slideshow">
          {slideShow ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} class="w-6 h-6"><path d="M10 9v6m4-6v6" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} class="w-6 h-6"><path d="M5 3v18l15-9L5 3z" /></svg>
          )}
        </button>
      
        {/* Compartir 
        <button onClick={() => alert("Compartir funcionalidad")} class="p-1 rounded hover:bg-white/20" aria-label="Compartir">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} class="w-6 h-6">
            <path d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z" />
          </svg>
        </button>*/}

        {/* Cerrar */}
        <button onClick={handleClose} class="p-1 rounded hover:bg-white/20" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} class="w-6 h-6"><line x1="6" y1="6" x2="18" y2="18" /><line x1="6" y1="18" x2="18" y2="6" /></svg>
        </button>
      </div>

      {/* IMAGEN + FLECHAS */}
      <div class="relative flex items-center justify-center max-w-[90vw] max-h-[90vh]">
        <img
          ref={imgRef}
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          draggable={false}
          // pointer events
          onPointerDown={onPointerDown as any}
          onPointerMove={onPointerMove as any}
          onPointerUp={() => finishPointer()}
          onPointerCancel={() => finishPointer()}
          // fallback click
          onClick={onImgClickFallback as any}
          // estilos y transform
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            transform: `scale(${zoomed ? ZOOM_SCALE : 1}) translate(${position.x}px, ${position.y}px)`,
            transition: zoomed ? "transform 0.08s linear" : "transform 0.25s ease",
            touchAction: "none", // importante para touch
            cursor: cursorStyle,
            userSelect: "none",
            WebkitUserDrag: "none",
          }}
          class="rounded-lg shadow-xl"
        />

        {/* Flechas visibles siempre */}
        <button onClick={prev} class="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full z-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} class="w-6 h-6"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={next} class="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full z-50">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2} class="w-6 h-6"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
