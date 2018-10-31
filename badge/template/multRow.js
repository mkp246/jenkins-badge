module.exports = function(data) {
    return (
        `<svg xmlns="http://www.w3.org/2000/svg" width="${data.maxLength}" height="${data.maxHeight}">
  <style>
    td:first-child{padding-left:0px;border-left:0px;}
    tr{border-bottom:1px solid;}
    tr:last-child{border-bottom:0px;}
    tr:first-child td:last-child{border-top-right-radius:6px;}
    tr:last-child  td:last-child{border-bottom-right-radius:6px;}
    td{padding-left:${data.baseWidth}px;padding-right:${data.baseWidth}px;border-left:1px solid;}
    table{border-collapse:collapse;text-align:center;background-color:#555;color:white;border-radius:6px;}
    ${data.colors.map((color, index) => {
      if(color){
        if (typeof color==='string') return `td:nth-child(${index+1}){background-color:${color}}`;
        else {
          return Object.keys(color).map((key)=>`td.c${index}-${key.replace('/','\\/')}{background-color:${color[key]}}`).join('');
        }
      }
    }).join('\n')}
  </style>
  <foreignObject width="${data.maxLength}" height="${data.maxHeight}" style="font-family:Lucida Console;font-size=11;">
    <body xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%;margin:0px;">
    <table>
      ${data.items.map((element)=> {
          return '<tr>'+ 
          element.map((elem, index)=>{
            if(!data.colors[index] || typeof data.colors[index]==='string'){
              return `<td>${elem}</td>`;
            }else if(data.colors[index]){
              return `<td class="c${index}-${elem}">${elem}</td>`;
            }
          }).join('')+ '</tr>';
        }).join('\n')
      }
    </table>
  </body>
  </foreignObject>
</svg>`);
};
