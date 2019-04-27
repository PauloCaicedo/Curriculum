var i=-1;
function delay(){
    var array = ["#58FAF4", "#58FAD0", "#58FAAC", "#58FA82",                  "#58FA58","#82FA58","#ACFA58","#D0FA58",
                 "#F4FA58","#F7D358","#FAAC58","#FA8258",
                 "#FA5858","#FA5882","#FA58AC","#FA58D0",
                 "#FA58F4","#D358F7","#AC58FA","#8258FA",
                 "#5858FA","#2E64FE","#0080FF","#04B4AE",
                 ,"#088A68","#58D3F7"];
    i++;
    setTimeout(function(){changeColor(array[i])}, 650);
  
    if(i===25){
      i=-1;
      delay();
    }
  }
  
  function changeColor(color){
      $('a.email').css("color", color);
    delay();
   }
delay();