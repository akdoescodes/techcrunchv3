export default function Techcrunch2D() {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white relative overflow-hidden">
        {/* Center TECHCRUNCH heading */}
        <h1
          className="text-6xl font-extrabold text-transparent bg-clip-text z-10"
          style={{
            backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899)",
          }}
        >
          TECHCRUNCH
        </h1>
  
        {/* Orbiting Rings Container with Perspective */}
        <div className="absolute w-[400px] h-[400px] perspective-1000">
          <div className="ring-orbit orbitX">
            <div className="ring rotateX"></div>
          </div>
          <div className="ring-orbit orbitY">
            <div className="ring rotateY"></div>
          </div>
          <div className="ring-orbit orbitZ">
            <div className="ring rotateZ"></div>
          </div>
        </div>
      </div>
    );
  }
  