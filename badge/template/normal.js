module.exports = function(data) {
    return(
`<svg xmlns="http://www.w3.org/2000/svg" width="${data.width}" height="20">
  <mask id="a">
    <rect width="${data.width}" height="20" rx="3" fill="#fff"/>
  </mask>
  <g mask="url(#a)">
    <path fill="#555" d="M0 0 h${data.subjectWidth} v20 H0 z" />
    <path fill="${data.color}" d="M${data.subjectWidth} 0 h${data.statusWidth} v20 H${data.subjectWidth} z"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="'Lucida Console'" font-size="11">
    <text x="${Math.floor(data.subjectWidth / 2)}" y="15" fill="#010101" fill-opacity=".3">${data.subject}</text>
    <text x="${Math.floor(data.subjectWidth / 2)}" y="14">${data.subject}</text>
    <text x="${Math.floor(data.statusWidth / 2) + data.subjectWidth}" y="15" fill="#010101" fill-opacity=".3">${data.status}</text>
    <text x="${Math.floor(data.statusWidth / 2) + data.subjectWidth}" y="14">${data.status}</text>
  </g>
</svg>`);
};
