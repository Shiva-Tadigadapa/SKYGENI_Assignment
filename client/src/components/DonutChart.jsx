import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DonutChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const width = 400;
    const height = 400;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius / 2;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
    const totals = data.reduce(
      (acc, d) => {
        if (d.Cust_Type === "Existing Customer") {
          acc.existingACV += d.acv;
        } else if (d.Cust_Type === "New Customer") {
          acc.newACV += d.acv;
        }
        return acc;
      },
      { existingACV: 0, newACV: 0 }
    );

    const pieData = [
      { label: "Existing Customer", value: totals.existingACV },
      { label: "New Customer", value: totals.newACV },
    ];

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);

    const outerArc = d3
      .arc()
      .innerRadius(radius * 1.5)
      .outerRadius(radius * 1.1);

    const color = d3
      .scaleOrdinal()
      .domain(pieData.map((d) => d.label))
      .range(["#3584bb", "#ff8c26"]);

    const arcs = svg
      .selectAll("arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label));

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .text(`${(totals.existingACV + totals.newACV) / 1000}k`)

    arcs
      .append("text")
      .attr("transform", (d) => {
        const pos =  outerArc.centroid(d);
        const offset = radius * 0.3;
        pos[0] = pos[0] > 0 ? pos[0] + offset : pos[0] - offset;
        return `translate(${pos})`;
      })
      .attr("text-anchor", (d) =>
        outerArc.centroid(d)[0] > 0 ? "end" : "start"
      )
      .text(
        (d) =>
          `$ ${(d.data.value / 1000).toFixed(1)}k ${"  "} ${(
            (d.data.value / d3.sum(pieData, (d) => d.value)) *
            100
          ).toFixed(1)}%`
      )
      .style("font-size", 13)
      .style("font-weight", "semibold")
      .style("fill", "black");

    arcs
      .selectAll("polyline")
      .data(pie(pieData))
      .enter()
      .append("polyline")
      .attr("points", (d) => {
        const pos = outerArc.centroid(d);
        const offset = radius * 0.5;
        pos[0] = pos[0] > 0 ? pos[0] + offset : pos[0] - offset;
        return [arc.centroid(d), outerArc.centroid(d), pos];
      })
      .style("fill", "none")
      .style("stroke", "gray")
      .style("stroke-width", 1.2)
      .style("opacity", 10.5);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default DonutChart;
