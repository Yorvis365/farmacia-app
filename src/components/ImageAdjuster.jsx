import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FaXmark, FaRotateRight, FaMagnifyingGlassPlus, FaMagnifyingGlassMinus,
  FaArrowsRotate, FaCheck, FaCropSimple, FaHand,
} from 'react-icons/fa6';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const OUTPUT_WIDTH = 800; // ancho final en px

export default function ImageAdjuster({ src, onConfirm, onCancel, aspect = 4 / 3 }) {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const imgRef       = useRef(null);

  const [image, setImage]       = useState(null);
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom]         = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset]     = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartRef            = useRef({ x: 0, y: 0 });
  const touchRef                = useRef({ mode: null, startDist: 0, startZoom: 1, startX: 0, startY: 0 });

  /* ================= Cargar imagen ================= */
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImage(img);
    };
    img.src = src;
  }, [src]);

  /* ====== Calcular escala base para cubrir el contenedor ====== */
  useEffect(() => {
    if (!image || !containerRef.current) return;
    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;

    const rot = ((rotation % 360) + 360) % 360;
    const isRotated = rot === 90 || rot === 270;
    const rw = isRotated ? image.height : image.width;
    const rh = isRotated ? image.width  : image.height;

    const scale = Math.max(cw / rw, ch / rh);
    setBaseScale(scale);
  }, [image, rotation]);

  /* ================= Dibujar en canvas ================= */
  const draw = useCallback(() => {
    if (!image || !canvasRef.current || !containerRef.current) return;

    const canvas    = canvasRef.current;
    const ctx       = canvas.getContext('2d');
    const cw        = containerRef.current.clientWidth;
    const ch        = containerRef.current.clientHeight;
    const dpr       = window.devicePixelRatio || 1;

    canvas.width  = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width  = cw + 'px';
    canvas.style.height = ch + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, cw, ch);

    ctx.save();
    ctx.translate(cw / 2 + offset.x, ch / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(baseScale * zoom, baseScale * zoom);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();
  }, [image, baseScale, zoom, rotation, offset]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(draw);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [draw]);

  /* ================= Mouse: arrastrar ================= */
  const handleMouseDown = (e) => {
    setDragging(true);
    dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e) =>
      setOffset({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
    const up = () => setDragging(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [dragging]);

  /* ================= Rueda: zoom ================= */
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.0015;
    setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)));
  };

  /* ================= Touch: pan + pinch ================= */
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchRef.current = { mode: 'pan', startX: t.clientX - offset.x, startY: t.clientY - offset.y };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchRef.current = { mode: 'pinch', startDist: Math.hypot(dx, dy), startZoom: zoom };
    }
  };

  const handleTouchMove = (e) => {
    const t = touchRef.current;
    if (t.mode === 'pan' && e.touches.length === 1) {
      const p = e.touches[0];
      setOffset({ x: p.clientX - t.startX, y: p.clientY - t.startY });
    } else if (t.mode === 'pinch' && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / t.startDist;
      setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, t.startZoom * ratio)));
    }
  };

  const handleTouchEnd = () => {
    touchRef.current = { mode: null, startDist: 0, startZoom: 1, startX: 0, startY: 0 };
  };

  /* ================= Acciones ================= */
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset  = () => { setZoom(1); setRotation(0); setOffset({ x: 0, y: 0 }); };

  /* ================= Exportar (crop final) ================= */
  const handleConfirm = () => {
    if (!image || !containerRef.current) return;

    const cw = containerRef.current.clientWidth;
    const ch = containerRef.current.clientHeight;

    const outW = OUTPUT_WIDTH;
    const outH = Math.round(OUTPUT_WIDTH / aspect);

    const canvas = document.createElement('canvas');
    canvas.width  = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outW, outH);

    const scaleFactor = outW / cw;

    ctx.save();
    ctx.scale(scaleFactor, scaleFactor);
    ctx.translate(cw / 2 + offset.x, ch / 2 + offset.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(baseScale * zoom, baseScale * zoom);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.restore();

    onConfirm(canvas.toDataURL('image/jpeg', 0.9));
  };

  /* ================= Render ================= */
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4
                 animate-[fadeIn_0.15s_ease-out]"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl
                   border border-gray-100 dark:border-slate-800 overflow-hidden
                   animate-[scaleIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4
                        border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FaCropSimple className="text-pharma-600 dark:text-pharma-400" />
            <h3 className="font-bold text-gray-800 dark:text-white">Ajustar imagen</h3>
          </div>
          <button
            onClick={onCancel}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <FaXmark />
          </button>
        </div>

        {/* Canvas */}
        <div className="p-5">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-full aspect-[4/3] bg-gray-100 dark:bg-slate-800
                       rounded-xl overflow-hidden select-none touch-none
                       cursor-grab active:cursor-grabbing"
          >
            <canvas ref={canvasRef} className="absolute inset-0" />

            {/* Cuadrícula de tercios */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/3 left-0 right-0 h-px bg-white/25" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-white/25" />
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/25" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/25" />
            </div>

            {/* Hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full
                            bg-black/60 text-white text-[10px] font-medium flex items-center gap-1.5
                            pointer-events-none">
              <FaHand className="text-[9px]" /> Arrastra para mover
            </div>
          </div>

          {/* Controles */}
          <div className="mt-5 space-y-4">

            {/* Zoom slider */}
            <div className="flex items-center gap-3">
              <FaMagnifyingGlassMinus className="text-gray-400 text-sm flex-shrink-0" />
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-pharma-600"
              />
              <FaMagnifyingGlassPlus className="text-gray-400 text-sm flex-shrink-0" />
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400 w-12 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Acciones */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg
                           bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200
                           hover:bg-gray-200 dark:hover:bg-slate-700 text-xs font-semibold transition"
              >
                <FaRotateRight /> Rotar 90°
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg
                           bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200
                           hover:bg-gray-200 dark:hover:bg-slate-700 text-xs font-semibold transition"
              >
                <FaArrowsRotate /> Restablecer
              </button>

              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700
                             text-gray-700 dark:text-gray-200
                             hover:bg-gray-50 dark:hover:bg-slate-800 text-xs font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                             bg-pharma-600 hover:bg-pharma-700 text-white
                             text-xs font-semibold transition shadow-sm shadow-pharma-500/30"
                >
                  <FaCheck /> Aplicar
                </button>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
              Arrastra para mover · Rueda del ratón o slider para zoom · Botón para rotar
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}