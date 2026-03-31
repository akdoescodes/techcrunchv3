export default function TechcrunchRings() {
    return (
      <div className="w-full h-screen flex items-center justify-center relative overflow-hidden bg-transparent">
        {/* TECHCRUNCH Text */}
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text z-10"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
          }}
        >
          TECHCRUNCH
        </h1>
  
        {/* 3D Orbit Rings */}
        <div className="absolute w-[300px] h-[300px] perspective-3d">
          <div className="absolute w-full h-full rounded-full border-2 border-purple-500 border-dashed orbitX glow-ring" />
          <div className="absolute w-full h-full rounded-full border-2 border-purple-400 border-dashed orbitY glow-ring" />
          <div className="absolute w-full h-full rounded-full border-2 border-purple-300 border-dashed orbitZ glow-ring" />
        </div>
      </div>
    );
  }
  