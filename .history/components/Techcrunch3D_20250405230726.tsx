export default function Techcrunch2D() {
    const numBalls = 8;
    const radius = 100;
  
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white relative overflow-hidden">
        {/* 3D Perspective Scene */}
        <div className="orbit-scene relative w-[300px] h-[300px] flex items-center justify-center">
          {/* TECHCRUNCH Text */}
          <h1
            className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text z-20 absolute"
            style={{
              backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            }}
          >
            TECHCRUNCH
          </h1>
  
          {/* Ring of Orbs */}
          <div className="absolute w-full h-full ring-3d">
            {Array.from({ length: numBalls }).map((_, i) => {
              const angle = (360 / numBalls) * i;
              const radians = (angle * Math.PI) / 180;
              const x = radius * Math.cos(radians);
              const z = radius * Math.sin(radians);
  
              return (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full absolute shadow-lg"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #ccff33, #88cc00)",
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
  