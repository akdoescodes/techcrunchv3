export default function Techcrunch2D() {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Central TECHCRUNCH Text */}
        <h1
          className="text-6xl font-extrabold text-transparent bg-clip-text z-10"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
          }}
        >
          TECHCRUNCH
        </h1>
  
        {/* 3D Rotating Rings */}
        <div className="absolute w-[400px] h-[400px] perspective-1000">
          <div className="ring rotateX"></div>
          <div className="ring rotateY"></div>
          <div className="ring rotateZ"></div>
        </div>
      </div>
    );
  }
  