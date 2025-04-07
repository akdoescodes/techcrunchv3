export default function Techcrunch2D() {
    return (
      <div className="w-full h-[70vh] bg-white flex flex-col items-center justify-center space-y-10">
        {/* Gradient Text */}
        <h1
          className="text-6xl font-extrabold text-transparent bg-clip-text"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
          }}
        >
          TECHCRUNCH
        </h1>
  
        {/* 2D Gradient Ball */}
        <div
          className="w-32 h-32 rounded-full shadow-lg"
          style={{
            background: "radial-gradient(circle at top left, #22c55e, #eab308)",
          }}
        ></div>
      </div>
    )
  }
  