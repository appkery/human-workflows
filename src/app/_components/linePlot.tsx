import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

import aapl from './aapl.json'

const width = 928
const height = 500
const marginTop = 20
const marginRight = 30
const marginBottom = 30
const marginLeft = 40

export default function LinePlot() {
  const ref = useRef(null)

  useEffect(() => {
    const svg = d3.select(ref.current)

    // Declare the x (horizontal position) scale.
    const dateExtent = d3.extent(aapl, d => new Date(d.date).getTime())
    if (dateExtent[0] === undefined || dateExtent[1] === undefined)
      throw new Error('aapl array is empty or contains invalid dates')

    const x = d3.scaleUtc(dateExtent, [marginLeft, width - marginRight])

    // Declare the y (vertical position) scale.
    const maxClose = d3.max(aapl, d => d.close)
    if (maxClose === undefined) throw new Error('aapl array is empty')

    const y = d3.scaleLinear([0, maxClose], [height - marginBottom, marginTop])

    // Declare the line generator.
    const line = d3
      .line<{ date: string; close: number }>()
      .x(d => x(new Date(d.date).getTime()))
      .y(d => y(d.close))

    // Add the x-axis.
    svg
      .append('g')
      .attr('transform', `translate(0,${height - marginBottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      )

    // Add the y-axis, remove the domain line, add grid lines and a label.
    svg
      .append('g')
      .attr('transform', `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call(g => g.select('.domain').remove())
      .call(g =>
        g
          .selectAll('.tick line')
          .clone()
          .attr('x2', width - marginLeft - marginRight)
          .attr('stroke-opacity', 0.1)
      )
      .call(g =>
        g
          .append('text')
          .attr('x', -marginLeft)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text('↑ Daily close ($)')
      )

    // Append a path for the line.
    svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line(aapl))
  }, [])

  return <svg ref={ref} viewBox={`0 0 ${width} ${height}`}></svg>
}
