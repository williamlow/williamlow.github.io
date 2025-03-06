/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////      Data panel     /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


function updateTitle() {
    
    if (currentProperties.length > 0) {
    
    var arrList = "";
    
    for (i in currentProperties) {
    arrList+=('<div class="arrListEntry">'+currentProperties[i]+'</div>');    
}
$("#arrivalsField").html(arrList);


     } else {
        $("#arrivalsField").html("All");
     }

}

function updateTitlePair(adm2) {
 //!!   $("#dataPaneTitle").html(adm2+" to "+selectedPolygon.feature.properties.ADM2_PT);   
}    
    
