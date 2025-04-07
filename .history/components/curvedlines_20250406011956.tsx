import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Home() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const canvas = document.getElementById("curveCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const lines = Array.from({ length: 8 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      ctrlX: Math.random() * width,
      ctrlY: Math.random() * height,
      endX: Math.random() * width,
      endY: Math.random() * height,
      speed: 0.2 + Math.random() * 0.3,
    }));

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(0,0,0,0.05)";
      ctx.lineWidth = 1;

      lines.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.quadraticCurveTo(line.ctrlX, line.ctrlY, line.endX, line.endY);
        ctx.stroke();

        // animate
        line.ctrlY += Math.sin(line.speed);
        line.ctrlX += Math.cos(line.speed);
      });

      requestAnimationFrame(animate);
    }

    animate();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <main className="relative min-h-screen text-black overflow-hidden">
      <canvas
        id="curveCanvas"
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      <div className="relative z-10 flex justify-center items-center min-h-screen">
        <div className="w-[90%] md:w-[70%] bg-white rounded-xl p-8 shadow-lg border">
          <div className="font-mono text-green-500 text-xl">$ Terminal Style</div>
          <p className="mt-2 text-gray-700">
            This is your terminal layout content. Everything is inside a centered
            div.
          </p>
        </div>
      </div>

      <section
        ref={ref}
        className="relative z-10 flex flex-col items-center justify-center gap-4 py-20"
      >
        {isInView && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-11/12 md:w-4/5"
          >
            {/* Replace with your actual event cards */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-6 border hover:scale-[1.02] transition-transform"
              >
                <h3 className="text-xl font-semibold">Event {i + 1}</h3>
                <p className="text-gray-600 mt-2">
                  Short description for Event {i + 1} with date/time/location etc.
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}
