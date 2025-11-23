"use client";

export function GradientBackground() {
  return (
    <>
      <style>{`
        @keyframes gradient-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
        @keyframes gradient-drift {
          0%, 100% {
            transform: translate(0, 0);
          }
          33% {
            transform: translate(20px, -15px);
          }
          66% {
            transform: translate(-15px, 20px);
          }
        }
        .animate-gradient-pulse {
          animation: gradient-pulse 12s ease-in-out infinite;
        }
        .animate-gradient-drift {
          animation: gradient-drift 20s ease-in-out infinite;
        }
      `}</style>
      {/* Subtle gradient overlays for texture */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Radial gradients behind text sections */}
        <div className="animate-gradient-drift absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-purple-500/8 via-pink-500/6 to-transparent blur-3xl" />
        <div
          className="animate-gradient-pulse absolute top-1/2 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-500/8 via-cyan-500/6 to-transparent blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="animate-gradient-drift absolute bottom-1/4 left-1/2 h-[350px] w-[350px] rounded-full bg-gradient-to-br from-pink-500/8 via-purple-500/6 to-transparent blur-3xl"
          style={{ animationDelay: "4s" }}
        />
        {/* Linear gradients for horizontal texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/1 to-transparent opacity-40" />
      </div>
    </>
  );
}
