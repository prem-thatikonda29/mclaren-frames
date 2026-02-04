/**
 * Car silhouette path generation
 * Creates a McLaren side-profile silhouette for the particle formation animation
 */

export interface Point {
  x: number;
  y: number;
}

/**
 * Generate McLaren car silhouette points
 * Creates a simplified side-profile shape with iconic McLaren features:
 * - Long, low hood
 * - Aggressive front splitter
 * - Low roofline with teardrop cabin
 * - Aerodynamic rear diffuser
 * - Visible wheel arches
 */
export function getCarSilhouettePoints(): Point[] {
  // Normalized coordinates (0-1 scale, centered around 0.5, 0.5)
  // This makes it easy to scale and position in the container
  const points: Point[] = [
    // Front bumper & splitter
    { x: 0.05, y: 0.55 },
    { x: 0.08, y: 0.50 },
    { x: 0.12, y: 0.48 },

    // Front hood (long and low)
    { x: 0.15, y: 0.47 },
    { x: 0.25, y: 0.45 },
    { x: 0.35, y: 0.43 },
    { x: 0.45, y: 0.42 },

    // Windshield (angled)
    { x: 0.48, y: 0.41 },
    { x: 0.52, y: 0.38 },

    // Roof (low, aerodynamic)
    { x: 0.60, y: 0.38 },
    { x: 0.68, y: 0.40 },
    { x: 0.72, y: 0.42 },

    // Rear quarter panel
    { x: 0.78, y: 0.43 },
    { x: 0.82, y: 0.44 },

    // Rear wing/diffuser
    { x: 0.88, y: 0.45 },
    { x: 0.92, y: 0.50 },
    { x: 0.95, y: 0.55 },

    // Rear undercarriage
    { x: 0.93, y: 0.60 },
    { x: 0.88, y: 0.62 },

    // Rear wheel arch
    { x: 0.80, y: 0.62 },
    { x: 0.76, y: 0.63 },

    // Lower rear section
    { x: 0.70, y: 0.62 },
    { x: 0.60, y: 0.62 },

    // Front wheel arch
    { x: 0.45, y: 0.63 },
    { x: 0.35, y: 0.63 },

    // Front lower section
    { x: 0.25, y: 0.62 },
    { x: 0.15, y: 0.60 },
    { x: 0.08, y: 0.58 },
    { x: 0.05, y: 0.55 },
  ];

  // Add detail points along the hull for smoother coverage
  const detailedPoints: Point[] = [];
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];

    detailedPoints.push(current);

    // Add intermediate point
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    detailedPoints.push({ x: midX, y: midY });
  }

  return detailedPoints;
}

/**
 * Generate particle data with random spawn positions and silhouette targets
 */
export interface Particle {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  color: string;
  delay: number;
}

export function generateParticles(
  carPath: Point[],
  count: number,
  containerWidth: number = 600,
  containerHeight: number = 300
): Particle[] {
  const particles: Particle[] = [];
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  for (let i = 0; i < count; i++) {
    // Distribute particles along the car path
    const pathIndex = Math.floor((i / count) * carPath.length);
    const target = carPath[pathIndex];

    // Scale target coordinates to container dimensions
    const targetX = centerX + (target.x - 0.5) * containerWidth;
    const targetY = centerY + (target.y - 0.5) * containerHeight;

    // Random spawn positions (spread out around the container)
    const angle = (Math.random() * Math.PI * 2);
    const distance = 150 + Math.random() * 100;
    const startX = centerX + Math.cos(angle) * distance;
    const startY = centerY + Math.sin(angle) * distance;

    // 10% orange particles for visual interest
    const color = i % 10 === 0 ? "#ff6a00" : "#ffffff";

    particles.push({
      id: i,
      startX,
      startY,
      targetX,
      targetY,
      color,
      delay: Math.random() * 0.3,
    });
  }

  return particles;
}

/**
 * Extract car path outline for rendering (useful for debugging)
 */
export function getCarPathSVG(points: Point[], width: number = 600, height: number = 300): string {
  const centerX = width / 2;
  const centerY = height / 2;

  const pathPoints = points
    .map((p) => {
      const x = centerX + (p.x - 0.5) * width;
      const y = centerY + (p.y - 0.5) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return `<polygon points="${pathPoints}" fill="none" stroke="white" stroke-width="2"/>`;
}
