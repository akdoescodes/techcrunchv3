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
  
        {/* 2D Flat Color Circle */}
        <div
          className="w-32 h-32 rounded-full shadow-lg"
          style={{
            backgroundColor: "#b6d94c", // A green-yellow flat color
          }}
        ></div>
      </div>
    )
  }
  