import { useEffect, useRef } from "react";
import styles from "./PolyrhythmicSpiral.module.css";

export default function PolyrhythmicSpiral() {
  const canvasRef = useRef(null);
  const gradientSliderValueRef = useRef(500);
  const circleSliderValueRef = useRef(15);

  const setGradientSliderValue = (value) => {
    gradientSliderValueRef.current = value;
  };

  const setCircleSliderValue = (value) => {
    circleSliderValueRef.current = value;
  };

  useEffect(() => {
    const paper = canvasRef.current;
    if (paper) {
      // ... rest of your code ...
      const pen = paper.getContext("2d");

      const colors = Array(22).fill("#A6C48A");

      const settings = {
        startTime: new Date().getTime(),
        duration: gradientSliderValueRef.current,
        maxCycles: Math.max(colors.length, 100),
      };

      let arcs = [];

      const calculateInitialVelocity = (index) => {
        const numberOfCycles = settings.maxCycles - index;
        const distancePerCycle = 2 * Math.PI;
        return (numberOfCycles * distancePerCycle) / 1000;
      };

      const calculateVelocity = (index) => {
        const numberOfCycles = settings.maxCycles - index;
        const distancePerCycle = 2 * Math.PI;
        // return (
        //   (numberOfCycles * distancePerCycle) /
        //   (1000 - circleSliderValueRef.current)
        // );
        return (numberOfCycles * distancePerCycle) / 1000;
      };

      const calculateNextImpactTime = (currentImpactTime, velocity) => {
        return currentImpactTime + ((2 * Math.PI) / velocity) * 1000;
      };

      const calculatePositionOnArc = (center, radius, angle) => ({
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      });
      const init = () => {
        pen.lineCap = "round";

        arcs = colors.map((color, index) => {
          //   const velocity = calculateVelocity(index);
          const initialVelocity = calculateInitialVelocity(index);
          const lastImpactTime = 0;
          const nextImpactTime = calculateNextImpactTime(
            settings.startTime,
            // velocity
            initialVelocity
          );

          return {
            color,
            // velocity,
            initialVelocity,
            lastImpactTime,
            nextImpactTime,
            totalDistance: 0,
          };
        });
      };

      const drawArc = (x, y, radius, start, end, action = "stroke") => {
        pen.beginPath();
        pen.arc(x, y, radius, start, end);
        if (action === "stroke") pen.stroke();
        else pen.fill();
      };

      const drawPointOnArc = (center, arcRadius, pointRadius, angle) => {
        const position = calculatePositionOnArc(center, arcRadius, angle);
        drawArc(position.x, position.y, pointRadius, 0, 2 * Math.PI, "fill");
      };
      let frame = 0;

      const draw = () => {
        // ... rest of your code ...
        paper.width = paper.parentElement.clientWidth;
        paper.height = paper.parentElement.clientHeight;

        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - settings.startTime) / 1000;

        const length = Math.min(paper.width, paper.height) * 2;
        const offset = (paper.width - length) / 2;
        const start = { x: offset, y: paper.height / 2 };
        const end = { x: paper.width - offset, y: paper.height / 2 };
        const center = { x: paper.width / 2, y: paper.height / 2 };

        const base = {
          length: end.x - start.x,
          minAngle: 0,
          startAngle: 0,
          maxAngle: 2 * Math.PI,
        };

        base.initialRadius = base.length * 0.1;
        base.circleRadius = base.length * 0.009;
        base.clearance = base.length * 0.01;
        base.spacing =
          (base.length - base.initialRadius - base.clearance) /
          2 /
          colors.length;

        arcs.forEach((arc, index) => {
          //   const velocity = arc.velocity * (circleSliderValueRef.current / 500);
          const velocity =
            arc.initialVelocity * (circleSliderValueRef.current / 500);

          arc.totalDistance += velocity;

          const radius = base.initialRadius + base.spacing * index;
          //   const distance = elapsedTime >= 0 ? elapsedTime * velocity : 0;
          //   const angle = (Math.PI + distance) % base.maxAngle;
          const angle = (Math.PI + arc.totalDistance) % base.maxAngle;
          const colorPosition = ((frame - index * 10) % 360) / 360;

          let red, green, blue;

          if (colorPosition < 0.25) {
            red = Math.floor(255 * (1 - colorPosition / 0.25));
            green = 0;
            blue = Math.floor(255 * (colorPosition / 0.25));
          } else if (colorPosition < 0.5) {
            red = Math.floor(255 * ((colorPosition - 0.25) / 0.25));
            green = Math.floor(140 * ((colorPosition - 0.25) / 0.25));
            blue = Math.floor(255 * (1 - (colorPosition - 0.25) / 0.25));
          } else if (colorPosition < 0.75) {
            red = Math.floor(255 * (1 - (colorPosition - 0.5) / 0.25));
            green = Math.floor(140 + 115 * ((colorPosition - 0.5) / 0.25));
            blue = 0;
          } else {
            red = Math.floor(255 * ((colorPosition - 0.75) / 0.25));
            green = Math.floor(255 * (1 - (colorPosition - 0.75) / 0.25));
            blue = 0;
          }

          pen.globalAlpha = 0.75;
          pen.lineWidth = base.length * 0.003;
          pen.strokeStyle = `rgb(${red}, ${green}, ${blue})`;

          const offset = (base.circleRadius * (0 / 3)) / radius;

          drawArc(
            center.x,
            center.y,
            radius,
            Math.PI + offset,
            2 * Math.PI - offset
          );
          drawArc(center.x, center.y, radius, offset, Math.PI - offset);

          pen.globalAlpha = 1;
          pen.fillStyle = `rgb(${red}, ${green}, ${blue})`;

          if (currentTime >= arc.nextImpactTime) {
            arc.nextImpactTime = calculateNextImpactTime(
              arc.nextImpactTime,
              arc.velocity
            );
          }

          drawPointOnArc(center, radius, base.circleRadius, angle);
        });

        frame += gradientSliderValueRef.current / 500;

        requestAnimationFrame(draw);
      };

      init();
      draw();
    }
  }, []); // Removed dependencies from the dependency array

  return (
    <div>
      <input
        type="range"
        min="1"
        max="4000"
        defaultValue={gradientSliderValueRef.current}
        onChange={(e) => setGradientSliderValue(Number(e.target.value))}
      />

      <input
        type="range"
        min="1"
        max="100"
        defaultValue={circleSliderValueRef.current}
        onChange={(e) => setCircleSliderValue(Number(e.target.value))}
      />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
