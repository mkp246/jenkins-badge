module.exports = function(data) {
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" width="${data.maxLength}" height="${24* data.items.length}">
  <style>
    td:first-child{padding-left:0px;border-left:0px;}
    tr{border-bottom:1px solid;}
    tr:last-child{border-bottom:0px;}
    td{padding-left:${data.baseWidth}px;padding-right:${data.baseWidth}px;border-left:1px solid;}
    table{border-collapse:collapse;text-align:center;background-color:#555;color:white;}
  </style>
  <foreignObject width="${data.maxLength}" height="${24* data.items.length}" style="font-family:Lucida Console;font-size=11;">
    <body xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;margin:0px;">
    <table>
      ${data.items.map(element=> '<tr>'+element.map(data=>`<td>${data}</td>`).join('') + '</tr>').join('\n')}
    </table>
  </body>
  </foreignObject>
</svg>`);
};
