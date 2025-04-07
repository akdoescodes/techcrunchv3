export default function Techcrunch2D() {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white relative overflow-hidden">
        {/* Glowing Pulse Ring */}
        <div className="absolute w-[300px] h-[300px] border-[2px] rounded-full border-purple-400 opacity-40 animate-pulse-slow"></div>
  
        {/* Orbit Ring Animation */}
        <div className="absolute w-[320px] h-[320px] border-[1px] border-dashed border-pink-500 rounded-full animate-spin-slow"></div>
  
        {/* TechCrunch Text */}
        <h1
          className="text-6xl font-extrabold text-transparent bg-clip-text z-10"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
          }}
        >
          TECHCRUNCH
        </h1>
      </div>
    );
  }
  