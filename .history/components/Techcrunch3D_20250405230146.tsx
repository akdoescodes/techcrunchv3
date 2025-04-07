export default function Techcrunch2D() {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white relative overflow-hidden">
        {/* Wrapper to center everything */}
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
          {/* TECHCRUNCH Text */}
          <h1
            className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text z-10 absolute"
            style={{
              backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            }}
          >
            TECHCRUNCH
          </h1>
  
          {/* Orbit 1 Path */}
          <div className="absolute w-[200px] h-[100px] border border-purple-400 rounded-full opacity-50" />
  
          {/* Orbit 1 Ball */}
          <div className="absolute w-[200px] h-[100px] animate-orbit">
            <div className="w-3 h-3 bg-yellow-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2" />
          </div>
  
          {/* Orbit 2 Path */}
          <div className="absolute w-[120px] h-[60px] border border-pink-400 rounded-full opacity-50" />
  
          {/* Orbit 2 Ball */}
          <div className="absolute w-[120px] h-[60px] animate-orbit-fast">
            <div className="w-2.5 h-2.5 bg-pink-500 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2" />
          </div>
        </div>
      </div>
    );
  }
  