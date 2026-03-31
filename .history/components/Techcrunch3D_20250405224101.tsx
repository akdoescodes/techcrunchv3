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
  
        {/* Rotating ball */}
        <div className="absolute w-[200px] h-[200px] animate-spin-slow">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-yellow-300 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        </div>
      </div>
    )
  }
  