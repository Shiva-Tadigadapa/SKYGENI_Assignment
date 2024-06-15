import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data) return;

    const margin = { top: 20, right: 30, bottom: 80, left: 60 }; // Increased bottom margin for x-axis label and legend
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Group data by fiscal quarter
    const groupedData = d3.groups(data, (d) => d.closed_fiscal_quarter);

    // Process data to calculate total ACV and separate ACV for existing and new customers
    const quarters = groupedData.map(([quarter, values]) => {
      const totalACV = d3.sum(values, (d) => d.acv);
      const existingACV = d3.sum(
        values.filter((d) => d.Cust_Type === "Existing Customer"),
        (d) => d.acv
      );
      const newACV = d3.sum(
        values.filter((d) => d.Cust_Type === "New Customer"),
        (d) => d.acv
      );
      return {
        quarter,
        totalACV,
        existingACV,
        newACV,
      };
    });

    // X and Y scales
    const x = d3
      .scaleBand()
      .domain(quarters.map((d) => d.quarter))
      .range([0, width])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(quarters, (d) => d.totalACV)])
      .nice()
      .range([height, 0]);

    // Adjust y axis ticks to every 200k
    const yAxis = d3
      .axisLeft(y)
      .ticks(Math.ceil(y.domain()[1] / 200000))
      .tickFormat(d3.format(".2s"));

    // X axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Y axis
    svg.append("g").attr("class", "y-axis").call(yAxis);

    // Y axis gridlines
    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(""))
      .selectAll(".tick line")
      .attr("stroke", "#e0e0e0"); // Light gray color for grid lines

    // Stacked bars with corrected order
    // Purple (New Customer) bars
    svg
      .selectAll(".bar-new")
      .data(quarters)
      .enter()
      .append("rect")
      .attr("class", "bar bar-new")
      .attr("x", (d) => x(d.quarter))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.existingACV + d.newACV)) // Stack on top of existing customer bars
      .attr("height", (d) => y(0) - y(d.newACV))
      .attr("fill", "#ff8c26");

    // Teal (Existing Customer) bars
    svg
      .selectAll(".bar-existing")
      .data(quarters)
      .enter()
      .append("rect")
      .attr("class", "bar bar-existing")
      .attr("x", (d) => x(d.quarter))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.existingACV)) // Stack on top of x-axis
      .attr("height", (d) => y(0) - y(d.existingACV))
      .attr("fill", "#3584bb");

    // Total ACV labels on top of stacked bars
    svg
      .selectAll(".label")
      .data(quarters)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.quarter) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.totalACV) - 10) // Adjust position above the stacked bars
      .attr("text-anchor", "middle")
      .text(
        (d) =>
          `${(d.totalACV / 1000).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}k`
      )
      .style("fill", "black")
      .style("font-size", "12px");

    // ACV values for New Customer bars
    svg
      .selectAll(".label-new")
      .data(quarters)
      .enter()
      .append("text")
      .attr("class", "label label-new")
      .attr("x", (d) => x(d.quarter) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.existingACV + d.newACV / 2)) // Center within the new customer bar
      .attr("text-anchor", "middle")
      .text(
        (d) =>
          `${(d.newACV / 1000).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}k`
      )
      .style("fill", "white")
      .style("font-size", "12px");

    // ACV values for Existing Customer bars
    svg
      .selectAll(".label-existing")
      .data(quarters)
      .enter()
      .append("text")
      .attr("class", "label label-existing")
      .attr("x", (d) => x(d.quarter) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.existingACV / 2)) // Center within the existing customer bar
      .attr("text-anchor", "middle")
      .text(
        (d) =>
          `${(d.existingACV / 1000).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}k`
      )
      .style("fill", "white")
      .style("font-size", "12px");

    // X-axis label
    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 30)
      .text("Closed Fiscal Quarter")
      .style("font-size", "14px");

    // Legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(0, ${height + 60})`); // Added padding-top to the legend

    legend
      .append("rect")
      .attr("x", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#3584bb");

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 15)
      .text("Existing Customer")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");

    legend
      .append("rect")
      .attr("x", 150)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#ff8c26");

    legend
      .append("text")
      .attr("x", 175)
      .attr("y", 15)
      .text("New Customer")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default BarChart;
