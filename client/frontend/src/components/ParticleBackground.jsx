// frontend/src/components/ParticleBackground.jsx

import React, { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
  // This function initializes the particles engine
  const particlesInit = useCallback(async (engine) => {
    // console.log(engine); // you can log the engine to see its properties
    // This loads the "slim" version of the particles library, which is lightweight
    await loadSlim(engine);
  }, []);

  // This function is called when the container is loaded
  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container); // you can log the container to see its properties
  }, []);

  // These are the options to configure the look and feel of the particles
  const options = {
    background: {
      color: {
        value: "#1a1a1d", // Matches your dark theme background
      },
    },
    fpsLimit: 60, // Limit to 60 frames per second for performance
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "repulse", // Particles move away from the cursor
        },
        resize: true,
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ff2d55", // The romantic red color for the particles
      },
      links: {
        enable: false, // Set to false for a "starfield" look instead of a network
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: 0.5, // Slow, gentle movement
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80, // The number of particles on screen
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 }, // Particles will have a random size between 1 and 3 pixels
      },
    },
    detectRetina: true, // Makes particles look sharp on high-DPI screens
  };

  return (
    <div className="background-particles">
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={options}
        />
    </div>
  );
};

export default ParticleBackground;