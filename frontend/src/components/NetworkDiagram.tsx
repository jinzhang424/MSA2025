import { useEffect, useState, useRef } from 'react';
const NetworkDiagram = () => {
  const baseRadius = 100;
  const radiusVariation = 70;

  const initialNodes = [{
    size: 40,
    imgUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
  }, {
    size: 40,
    imgUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  }, {
    size: 40,
    imgUrl: 'https://randomuser.me/api/portraits/women/68.jpg'
  }, {
    size: 40,
    imgUrl: 'https://randomuser.me/api/portraits/men/75.jpg'
  }, {
    size: 40,
    imgUrl: 'https://randomuser.me/api/portraits/women/90.jpg' 
  }, {
    size: 40,
    imgUrl: 'https://randomuser.me/api/portraits/men/36.jpg'
  }, {
    size: 40,
    imgUrl: 'https://randomuser.me/api/portraits/women/33.jpg'
  }];
  
  const [nodes, setNodes] = useState(initialNodes);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const animateNodes = () => {
      nodes.forEach((node, i) => {
        const nodeElement = nodeRefs.current[i];
        if (nodeElement) {
          const time = Date.now() * 0.00055;

          const centerX = 250;
          const centerY = 200;

          const orbitRadius = baseRadius + (i % 3) * radiusVariation;

          const speedMultiplier = 1 - (i % 3) * 0.2; // Inner orbits move faster

          const angle = time * speedMultiplier + (i * (Math.PI * 2) / nodes.length);
          const offsetX = Math.sin(angle) * orbitRadius - (node.size / 2);
          const offsetY = Math.cos(angle) * orbitRadius - (node.size / 2);

          const newX = centerX + offsetX;
          const newY = centerY + offsetY;

           nodeElement.style.transform = `translate(${newX}px, ${newY}px) scale(1)`;
        }
      });
      requestAnimationFrame(animateNodes);
    };
    
    requestAnimationFrame(animateNodes);
  }, [nodes]);
  
  return (
    <div className="relative w-[500px] h-[400px]" ref={containerRef}>
      {/* Orbital path circles */}
      {[0, 1, 2].map(level => {
        const orbitRadius = baseRadius + (level * radiusVariation);
        const diameter = orbitRadius * 2;
        
        return (
          <div
            key={level}
            className="absolute border border-white/20 rounded-full pointer-events-none"
            style={{
              width: `${diameter}px`,
              height: `${diameter}px`,
              left: `${250 - orbitRadius}px`, // Center X - radius
              top: `${200 - orbitRadius}px`,  // Center Y - radius
              zIndex: 1,
            }}
          />
        );
      })}

      {/* Large center circle */}
      <div className="absolute left-[200px] top-[150px] w-[100px] h-[100px] rounded-full border-3 border-white/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">20k+</div>
          <div className="text-sm text-white">Specialists</div>
        </div>
      </div>
      
      {/* Profile nodes */}
      {nodes.map((node, i) => 
        <div 
          key={i} 
          ref={el => {nodeRefs.current[i] = el}}
          className="absolute overflow-hidden border-2 border-white rounded-full shadow-lg" 
          style={{
            width: `${node.size}px`,
            height: `${node.size}px`,
            zIndex: 2,
          }}
        >
          <img 
            src={node.imgUrl} 
            alt="Profile" 
            className="object-cover w-full h-full pointer-events-none" 
            draggable={false}
          />
        </div>)}
    </div>
  )
};
export default NetworkDiagram;