// ------------------------------------------------------------------------- 
// -------------------------------- syconus  -------------------------------
// ------------------------------------------------------------------------- 
// -- xml --- 
 function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}




// ------------------------------------------------------------------------- 
// --------------------------------  async  --------------------------------
// -------------------------------------------------------------------------
// -- json -- 
async function loadJson(url) { 
  let response = await fetch(url);
  if (response.ok) {
    let json = await response.json(); 
    return json;
  }
  alert("HTTP-Error: " + response.status);
}


