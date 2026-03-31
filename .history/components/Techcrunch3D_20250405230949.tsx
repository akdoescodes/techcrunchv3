export default function Techcrunch2D() {
    const numBalls = 8;
    const radius = 150;
  
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        {/* 3D Scene Container */}
        <div className="scene relative w-[400px] h-[400px] flex items-center justify-center">
  
          {/* Centered Text */}
          <h1
            className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text absolute z-10"
            style={{
              backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            }}
          >
            TECHCRUNCH
          </h1>
  
          {/* 3D Ring */}
          <div className="ring absolute w-full h-full top-0 left-0">
            {Array.from({ length: numBalls }).map((_, i) => {
              const angle = (360 / numBalls) * i;
              const rad = (angle * Math.PI) / 180;
              const x = radius * Math.cos(rad);
              const z = radius * Math.sin(rad);
  
              return (
                <div
                  key={i}
                  className="absolute w-5 h-5 rounded-full shadow-md"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #d1ff00, #76ff03)",
                    transform: `translateX(${x}px) translateZ(${z}px)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  