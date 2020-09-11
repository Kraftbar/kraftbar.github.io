
// --------------------------------------------------------------
let obj = new canvasplot('xy-graph')

// --------------------------------------------------------------
csvtext=  httpGet("https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv")




// --------------------------------------------------------------
arr=csvtext.split("\n")
Norway=[]
for (i = 0; i < arr.length; i++) {
    linearr=arr[i].split(",")
    if(linearr[1]=="Norway"){
       console.log(linearr)
       Norway=linearr
    }
}
Norway_der=[]
for (i = 1; i < Norway.length; i++) {
    Norway_der.push(Norway[i]-Norway[i-1])
}
obj.Draw(Norway_der.slice(40))