export default function Techcrunch2D() {
    const numBalls = 8;
    const orbitRadius = 120;
  
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white relative overflow-hidden">
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
          {/* TECHCRUNCH text */}
          <h1
            className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text z-10 absolute"
            style={{
              backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            }}
          >
            TECHCRUNCH
          </h1>
  
          {/* Ring wrapper */}
          <div
            className="absolute w-[300px] h-[300px] ring-orbit"
            style={{
              position: "absolute",
            }}
          >
            {Array.from({ length: numBalls }).map((_, i) => {
              const angle = (360 / numBalls) * i;
              const x = orbitRadius * Math.cos((angle * Math.PI) / 180);
              const y = orbitRadius * Math.sin((angle * Math.PI) / 180);
  
              return (
                <div
                  key={i}
                  className="w-3 h-3 bg-green-400 rounded-full absolute"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  