export default function Techcrunch2D() {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white relative overflow-hidden">
        {/* Center wrapper */}
        <div className="relative flex items-center justify-center">
          {/* Gradient TECHCRUNCH text */}
          <h1
            className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text z-10"
            style={{
              backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
            }}
          >
            TECHCRUNCH
          </h1>
  
          {/* Orbit Path 1 (highlighted ellipse) */}
          <div className="absolute w-[200px] h-[100px] border border-purple-300 rounded-full opacity-50"></div>
          {/* Moving Ball 1 */}
          <div className="absolute w-[200px] h-[100px] animate-ellipse-slow">
            <div className="w-3 h-3 bg-yellow-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2" />
          </div>
  
          {/* Orbit Path 2 (highlighted ellipse) */}
          <div className="absolute w-[150px] h-[75px] border border-pink-300 rounded-full opacity-50"></div>
          {/* Moving Ball 2 */}
          <div className="absolute w-[150px] h-[75px] animate-ellipse-fast">
            <div className="w-2.5 h-2.5 bg-pink-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2" />
          </div>
        </div>
      </div>
    );
  }
  