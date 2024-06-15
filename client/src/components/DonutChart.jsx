import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DonutChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const width = 400; // Width of the SVG
    const height = 400; // Height of the SVG
    const margin = 50; // Margin around the chart
    const radius = Math.min(width, height) / 2 - margin; // Radius of the outer circle
    const innerRadius = radius / 2; // Radius of the inner circle (donut hole)

    // Create the SVG element and append a group element to center the chart
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Calculate total ACV for existing and new customers
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

    // Prepare the data for the pie chart
    const pieData = [
      { label: "Existing Customer", value: totals.existingACV },
      { label: "New Customer", value: totals.newACV },
    ];

    // Create a pie generator function
    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    // Create an arc generator function for the slices
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);

    // Create an arc generator function for the outer arc (for labels)
    const outerArc = d3
      .arc()
      .innerRadius(radius * 1.5)
      .outerRadius(radius * 1.1);

    // Create a color scale
    const color = d3
      .scaleOrdinal()
      .domain(pieData.map((d) => d.label))
      .range(["#3584bb", "#ff8c26"]);

    // Create the pie chart slices
    const arcs = svg
      .selectAll("arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Append paths (slices) to the chart
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.label));

    // Append the total ACV text in the center of the donut chart
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .text(`${(totals.existingACV + totals.newACV) / 1000}k`);

    // Append text labels for each slice
    arcs
      .append("text")
      .attr("transform", (d) => {
        const pos = outerArc.centroid(d);
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

    // Append polylines connecting slices to their labels
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
      .style("opacity", 0.5);
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default DonutChart;
