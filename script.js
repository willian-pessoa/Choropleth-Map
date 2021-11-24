let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

let countyData
let educationData

const width = 1000;
const height = 600;

const colors = ['#3D550C', '#81B622', '#ECF87F', '#59981A'];
const percentage = ["Less than 15%", "15% to 30%", "30% to 45%", "More than 45%"]

let canvas = d3.select('#canvas');
const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip');

let drawMap = () => {

    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (item) => {
            let fips = item['id']
            let county = educationData.find((county) => {
                return county['fips'] === fips
            })
            let percentage = county['bachelorsOrHigher']
            if (percentage <= 15){
                return colors[0]
            }else if (percentage <= 30){
                return colors[1]
            } else if (percentage <= 45){
                return colors[2]
            } else {
                return colors[3]
            }
          })
        .attr('data-fips', (item) => {
            return item['id']
        })
        .attr('data-education', (item) => {
            let fips = item['id']
            let county = educationData.find((county) => {
                return county['fips'] === fips
            })
            let percentage = county['bachelorsOrHigher']
            return percentage
        })
        .on('mouseover', (countyDataItem) => {
            tooltip.transition()
                    .style('visibility', 'visible')
        
            let fips = countyDataItem['id']
            let county = educationData.find((county) => {
                return county['fips'] === fips
            })
        
            tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

            tooltip.attr('data-year', item['year'])
        })
        .on('mouseout', (countyDataItem) => {
            tooltip.transition()
                    .style('visibility', 'hidden')
        })
        
}

let drawLegend = () => {

    canvas.selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("height", 20)
        .attr("width", 20)
        .attr("fill", d => d)
        .attr("x", width - 30)
        .attr("y", (d, i) => (height - 100) + i*20)
        
    canvas.selectAll("text")
        .data(percentage)
        .enter()
        .append("text")
        .attr("x", width - 35)
        .attr("y", (d, i) => (height - 85) + i*20)
        .text(d => d)
        .attr("fill", "black")
        .attr("text-anchor", "end")

}

d3.json(countyURL).then(
    (data, error) => {
        if(error){
            console.log(error);
        }else{
            countyData = data;
            countyData = topojson.feature(countyData, countyData.objects.counties).features;
            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error);
                    }
                    else{
                        educationData = data;
                        drawMap();
                        drawLegend();
                    }
                }
            )

        }
    }
)