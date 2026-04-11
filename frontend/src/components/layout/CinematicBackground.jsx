import React, { useEffect, useRef } from 'react';

const CinematicBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let comets = [];
    let spaceships = [];
    let astronauts = [];
    
    const numStars = 200; 
    const numComets = 10;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initComets();
      initShipsAndAstronauts();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 2 + 0.1, 
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          radius: Math.random() * 1.5,
          color: Math.random() > 0.9 ? '#0ff0fc' : Math.random() > 0.9 ? '#b026ff' : '#ffffff', 
          alpha: Math.random(),
          aSpeed: (Math.random() - 0.5) * 0.02
        });
      }
    };

    const spawnComet = () => {
      return {
        x: Math.random() * canvas.width * 2,
        y: -100 - Math.random() * 500, 
        vx: -3 - Math.random() * 4, 
        vy: 3 + Math.random() * 4, 
        length: 100 + Math.random() * 150,
        thickness: 0.5 + Math.random() * 2,
        color: Math.random() > 0.6 ? '255, 100, 200' : Math.random() > 0.3 ? '100, 255, 255' : '255, 230, 150', 
        delay: Math.random() * 300 
      };
    };

    const initComets = () => {
      comets = [];
      for (let i = 0; i < numComets; i++) {
        comets.push(spawnComet());
      }
    };

    const initShipsAndAstronauts = () => {
      spaceships = [
        {
          x: canvas.width * 0.2, y: canvas.height * 0.8,
          vx: 0.6, vy: -0.3, // Trajectory: Up and right
          scale: 0.7,
          color: '#e2e8f0',
          thruster: '#0ff0fc'
        },
        {
          x: canvas.width * 0.8, y: canvas.height * 0.3,
          vx: -0.4, vy: 0.1, // Trajectory: Slow pan left
          scale: 0.4,
          color: '#cbd5e1',
          thruster: '#b026ff'
        }
      ];

      astronauts = [
        {
          x: canvas.width * 0.6, y: canvas.height * 0.6,
          vx: -0.15, vy: -0.1, // Very slow drift
          angle: 0, rotSpeed: 0.003, // Slow tumbling
          scale: 0.6
        }
      ];
    };

    const drawSpaceship = (ship) => {
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(Math.atan2(ship.vy, ship.vx));
      ctx.scale(ship.scale, ship.scale);

      // Jet Thruster Glow
      ctx.beginPath();
      const flameLength = 15 + Math.random() * 15;
      ctx.moveTo(-10, -4);
      ctx.lineTo(-10 - flameLength, 0);
      ctx.lineTo(-10, 4);
      ctx.fillStyle = ship.thruster;
      ctx.shadowBlur = 15;
      ctx.shadowColor = ship.thruster;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Spaceship Hull
      ctx.beginPath();
      ctx.moveTo(-10, -8); // Back Top
      ctx.lineTo(20, 0);   // Nose point
      ctx.lineTo(-10, 8);  // Back Bottom
      ctx.lineTo(-5, 0);   // Engine indent
      ctx.closePath();
      ctx.fillStyle = ship.color;
      ctx.fill();

      // Spaceship Cockpit Window
      ctx.beginPath();
      ctx.arc(2, 0, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();

      ctx.restore();
    };

    const drawAstronaut = (astro) => {
      ctx.save();
      ctx.translate(astro.x, astro.y);
      ctx.rotate(astro.angle);
      ctx.scale(astro.scale, astro.scale);

      // Backpack / O2 Tank
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-12, -15, 10, 30);

      // Main Torso Layer
      ctx.beginPath();
      if(ctx.roundRect) ctx.roundRect(-5, -12, 16, 26, 6);
      else ctx.fillRect(-5, -12, 16, 26); // fallback
      ctx.fillStyle = '#f8fafc';
      ctx.fill();

      // Arms
      ctx.beginPath();
      ctx.lineCap = "round";
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#f1f5f9';
      ctx.moveTo(0, -6);
      ctx.lineTo(-8, 6); // Left arm flying up slightly
      ctx.moveTo(10, -6);
      ctx.lineTo(16, 0); // Right arm bent
      ctx.stroke();

      // Head Helmet
      ctx.beginPath();
      ctx.arc(3, -16, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Visor Glow
      ctx.beginPath();
      ctx.ellipse(6, -17, 7, 5, Math.PI/6, 0, Math.PI * 2);
      ctx.fillStyle = '#0ff0fc';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0ff0fc';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Floating Cosmic Tether/Hose
      ctx.beginPath();
      ctx.moveTo(-5, 5);
      ctx.quadraticCurveTo(-20, 20, -30, -5);
      ctx.quadraticCurveTo(-40, -30, -50, -10);
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Layer 1: Background Stars & Constellations
      for (let i = 0; i < stars.length; i++) {
        let s = stars[i];
        
        s.x += s.vx / s.z;
        s.y += s.vy / s.z;
        s.alpha += s.aSpeed;
        
        if (s.alpha <= 0.1 || s.alpha >= 1) s.aSpeed = -s.aSpeed;
        
        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;
        
        ctx.beginPath();
        if (s.color !== '#ffffff') {
           ctx.shadowBlur = 10;
           ctx.shadowColor = s.color;
        } else {
           ctx.shadowBlur = 0;
        }
        ctx.arc(s.x, s.y, s.radius * s.z, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.fill();
        ctx.shadowBlur = 0; 
        
        for (let j = i + 1; j < stars.length; j++) {
            let s2 = stars[j];
            const dx = s.x - s2.x;
            const dy = s.y - s2.y;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance < 120 && Math.abs(s.z - s2.z) < 0.5) {
                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s2.x, s2.y);
                const lineAlpha = 1 - (distance / 120);
                
                ctx.strokeStyle = `rgba(180, 220, 255, ${lineAlpha * 0.15})`;
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 1;
                ctx.stroke();
            }
        }
      }

      // Layer 2: Fast Comets
      ctx.globalAlpha = 1;
      for (let i = 0; i < comets.length; i++) {
        let c = comets[i];
        
        if (c.delay > 0) {
          c.delay--;
          continue;
        }
        
        c.x += c.vx;
        c.y += c.vy;
        
        if (c.x < -c.length*2 || c.y > canvas.height + c.length*2) {
          comets[i] = spawnComet();
          comets[i].delay = Math.random() * 400 + 100;
          continue;
        }
        
        const mag = Math.sqrt(c.vx*c.vx + c.vy*c.vy);
        const tailX = c.x - (c.vx / mag) * c.length; 
        const tailY = c.y - (c.vy / mag) * c.length;
        
        const gradient = ctx.createLinearGradient(c.x, c.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(${c.color}, 1)`); 
        gradient.addColorStop(0.1, `rgba(${c.color}, 0.8)`);
        gradient.addColorStop(1, `rgba(${c.color}, 0)`); 
        
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = c.thickness;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.thickness * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.color}, 1)`;
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${c.color}, 1)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Layer 3: Spaceships and Astronauts (Foreground elements)
      const buffer = 100;
      for (let ship of spaceships) {
        ship.x += ship.vx;
        ship.y += ship.vy;
        
        // Wrap around gracefully allowing them to go fully offscreen before teleporting
        if (ship.x > canvas.width + buffer) ship.x = -buffer;
        else if (ship.x < -buffer) ship.x = canvas.width + buffer;
        
        if (ship.y > canvas.height + buffer) ship.y = -buffer;
        else if (ship.y < -buffer) ship.y = canvas.height + buffer;

        drawSpaceship(ship);
      }

      for (let astro of astronauts) {
        astro.x += astro.vx;
        astro.y += astro.vy;
        astro.angle += astro.rotSpeed;

        if (astro.x > canvas.width + buffer) astro.x = -buffer;
        else if (astro.x < -buffer) astro.x = canvas.width + buffer;
        
        if (astro.y > canvas.height + buffer) astro.y = -buffer;
        else if (astro.y < -buffer) astro.y = canvas.height + buffer;

        drawAstronaut(astro);
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030308]">
      {/* Deep Space Gradients / Animated Nebulas */}
      <div className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vh] bg-[#3b0764]/40 rounded-full blur-[140px] mix-blend-screen opacity-70 animate-[spin_100s_linear_infinite]"></div>
      <div className="absolute top-[20%] right-[-20%] w-[70vw] h-[90vh] bg-[#0c4a6e]/40 rounded-full blur-[150px] mix-blend-screen opacity-60 animate-[spin_130s_linear_infinite_reverse]"></div>
      <div className="absolute bottom-[-30%] left-[10%] w-[80vw] h-[70vh] bg-[#1e1b4b]/50 rounded-full blur-[130px] mix-blend-screen opacity-50 animate-[spin_150s_linear_infinite]"></div>
      
      {/* Newborn stellar gas clouds */}
      <div className="absolute top-[10%] left-[30%] w-[50vw] h-[50vh] bg-neon-cyan/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
      <div className="absolute bottom-[20%] right-[30%] w-[40vw] h-[40vh] bg-neon-purple/5 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow"></div>

      {/* Moving Stars, Constellations, Ships, and Meteor Showers */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 w-full h-full mix-blend-screen opacity-80"></canvas>
      
      {/* Faint static dust overlay for cinematic granularity */}
      <div className="absolute inset-0 z-20 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.05] mix-blend-overlay"></div>
    </div>
  );
};

export default CinematicBackground;
