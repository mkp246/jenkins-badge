module.exports = function(data) {
    return(
`<svg xmlns="http://www.w3.org/2000/svg" width="${data.width}" height="20">
  <mask id="a">
    <rect width="${data.width}" height="20" rx="3" fill="#fff"/>
  </mask>
  <g mask="url(#a)">
    <path fill="#555" d="M0 0 h${data.subjectWidth} v20 H0 z" />
    <path fill="${data.color1}" d="M${data.subjectWidth} 0 h${data.status1Width} v20 h-${data.status1Width} z"/>
    <path fill="${data.color2}" d="M${data.subjectWidth + data.status1Width} 0 h${data.status2Width} v20 h-${data.status2Width} z"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="'Lucida Console'" font-size="11">
    <text x="${Math.floor(data.subjectWidth / 2)}" y="15" fill="#010101" fill-opacity=".3">${data.subject}</text>
    <text x="${Math.floor(data.subjectWidth / 2)}" y="14">${data.subject}</text>
    <text x="${Math.floor(data.status1Width / 2) + data.subjectWidth}" y="15" fill="#010101" fill-opacity=".3">${data.status1}</text>
    <text x="${Math.floor(data.status1Width / 2) + data.subjectWidth}" y="14">${data.status1}</text>
    <text x="${Math.floor(data.status2Width / 2) + data.subjectWidth + data.status1Width}" y="15" fill="#010101" fill-opacity=".3">${data.status2}</text>
    <text x="${Math.floor(data.status2Width / 2) + data.subjectWidth + data.status1Width}" y="14">${data.status2}</text>
  </g>
</svg>`);
};
