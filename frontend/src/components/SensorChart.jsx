import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { io } from 'socket.io-client';

const socket = io("http://localhost:4000");

const SensorChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on('sensorData', (newData) => {
      setData((prev) => [...prev, newData]);
    });

    return () => socket.off('sensorData');
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const svg = d3.select('#chart')
                    .attr('width', 500)
                    .attr('height', 300);

      svg.selectAll('*').remove();

      const xScale = d3.scaleLinear()
                       .domain([0, data.length])
                       .range([0, 500]);

      const yScale = d3.scaleLinear()
                       .domain([0, 100])
                       .range([300, 0]);

      svg.append('path')
         .data([data])
         .attr('fill', 'none')
         .attr('stroke', 'steelblue')
         .attr('stroke-width', 1.5)
         .attr('d', d3.line()
             .x((d, i) => xScale(i))
             .y(d => yScale(d.humidity))
         );
    }
  }, [data]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Monitoreo de Sensores</h2>
      <svg id="chart"></svg>
    </div>
  );
};

export default SensorChart;
