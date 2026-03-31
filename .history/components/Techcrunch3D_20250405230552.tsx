export default function Techcrunch2D() {
    const numBalls = 8;
    const radius = 100;
  
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white relative overflow-hidden">
        {/* Center container */}
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
          {/* TECHCRUNCH heading */}
          <h1
            className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text z-20 absolute"
            style={{
              backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            }}
          >
            TECHCRUNCH
          </h1>
  
          {/* 3D ring container */}
          <div className="absolute w-full h-full ring-3d">
            {Array.from({ length: numBalls }).map((_, i) => {
              const angle = (360 / numBalls) * i;
              const radians = (angle * Math.PI) / 180;
              const x = radius * Math.cos(radians);
              const z = radius * Math.sin(radians);
  
              return (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full absolute"
                  style={{
                    backgroundColor: '#ccff33', // Yellow-green
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px)`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  