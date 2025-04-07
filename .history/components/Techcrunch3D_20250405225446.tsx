export default function Techcrunch2D() {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white relative overflow-hidden">
        {/* Gradient TECHCRUNCH text */}
        <h1
          className="text-6xl font-extrabold text-transparent bg-clip-text z-10"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
          }}
        >
          TECHCRUNCH
        </h1>
  
        {/* Electron orbit path */}
        <div className="absolute w-[200px] h-[100px] animate-ellipse-slow">
          <div className="w-3 h-3 bg-yellow-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
      </div>
    )
  }
  