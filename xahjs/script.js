// TODO
//   - bug: flashcard and text2speech
//   - refactooooooor!!


var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.font = "30px Arial";
ctx.fillText("Hello World", 10, 50);


// globals 

var words = new Array(1000);
var words_buffer = new Array(1000);
var words_pinyin_woAccents = new Array(1000);
var words_empt=words;
var words_length=0;
correct_flag=0;
standardLang_flag=1;

falshcard_toggle=0;

// -----------------------
// file/ txts handeling 
// -----------------------




function pros(csv){
    //reset
    k=0;
    words=words_empt;

    // remove trailing newline 

    csv=csv.replace(/\n+$/, "");

    var rows = csv.split('\n');


    words_length=rows.length;

    for (var i = 0; i < rows.length; i++) {
      cols = rows[i].split('\t');
      words[i] = new Array(3);
      for (var j = 0; j < cols.length; j++) {
        var value = cols[j];
        console.log(value)
        words[i][j] = value;
      }
      woAccents=cols[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      words_pinyin_woAccents[i]=woAccents;
    }
    document.getElementById('output').innerHTML = words[k][0]+" "+words[k][1];
    
}


function processFile(){
    var file = document.querySelector('#myFile').files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
      var csv = event.target.result;
      pros(csv)

    }
  }

function processText(){
    var x = document.getElementById("myTextarea").value;
    pros(x)
}


// Feedback correct 
function prossFeedback(userInput, solutions){
  highestMatchScores=[];
  feedbacks=[];

  for (j = 0; j < solutions.length; j++) {

    solution=solutions[j];

    matchScore=0;
    var feedback="";

    for (var i = 0; i < solution.length; i++) {
      if(userInput.charAt(i)==solution.charAt(i)){
        matchScore=matchScore+1;
        feedback=feedback.concat(userInput.charAt(i));
      }else{
        feedback=feedback.concat("_");
      }
    }

    feedbacks.push(feedback);
    highestMatchScores.push(matchScore);
  }

  // find the highest match
  var sorted = [...highestMatchScores].sort((a,b) => b - a);
  highestMatchIndex=highestMatchScores.indexOf(sorted[0]);

  return feedbacks[highestMatchIndex];
}

// -----------------------
// display word array 
// -----------------------

function nextFlashcard(){
  if (falshcard_toggle){
    document.getElementById('output').textContent=words[k][0]+" "+words[k][1];
    document.getElementById('feedback').innerHTML="<br/>";
  }else{
    document.getElementById('feedback').textContent = words[k][2];
    k =  k+1 
    k = k % (words_length); 
  }
  falshcard_toggle=!falshcard_toggle;
}

function nextItem() {
    document.getElementById('feedback').innerHTML="<br/>";
    

    
    k = Math.floor(Math.random()*(words_length)); // k+1 
    k = k % (words_length); 

    var inputF = document.getElementById("typed_word"); 
    inputF.value = ""; 

    falshcard_toggle=0;
    document.getElementById('output').textContent =   words[k][0]+" "+words[k][1];
}
function prevItem() {
    document.getElementById('feedback').innerHTML="<br/>";


    if (k === 0) { // i would become 0
        k = words_length; // so put it at the other end of the array
    }
    k = k - 1; // decrease by one
    
    var inputF = document.getElementById("typed_word"); 
    inputF.value = ""; 

    falshcard_toggle=0;
    document.getElementById('output').textContent =  words[k][0]+" "+words[k][1]; // give us back the item of where we are now
}
function checkItem() {

  var inputVal = document.getElementById("typed_word").value.toLowerCase();;
  var answer=words[k][2].replace(/ *\([^)]*\) */g, ""); //   replace (*)
  var answers=answer.split(", ");

  feedback=prossFeedback(inputVal,answers);
    if(inputVal==feedback){              
      correct_flag=correct_flag+1;
      return feedback.concat(" ✓");
    }
      correct_flag=0;
  
      document.getElementById('feedback').textContent=  feedback.concat(" ☓");
}




// -----------------------
// User input 
// -----------------------

// button input
window.addEventListener('load', function () {

    document.getElementById('prev_button').addEventListener(
        'click', // we want to listen for a click
        function (e) { // the e here is the event itself
             prevItem();
        }
    );
    
    document.getElementById('next_button').addEventListener(
        'click', // we want to listen for a click
        function (e) { // the e here is the event itself
            nextItem();
        }
    );
    document.getElementById('check_button').addEventListener(
        'click', // we want to listen for a click
        function (e) { // the e here is the event itself
            checkItem();
        }
    );



});


// enter input
var typed_word = document.getElementById("typed_word");

typed_word.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    checkItem();
    console.log(correct_flag);
    if(correct_flag>1){
       nextItem();
    }

    }
    
});



// -----------------------
// Misc. 
// -----------------------
function text2speech(){
  var msg = new SpeechSynthesisUtterance(words[k][0]);msg.lang = 'zh-CN';
window.speechSynthesis.speak(msg);
}

function changeLangFunction() {

    words=words_empt;

    for (var i = 0; i < words_length; i++) {
        if(standardLang_flag){
        words_buffer[i]=words[i][1];
        words[i][1]="";

        }else{

        words[i][1]=words_buffer[i];
        }
        [words[i][0], words[i][2]] = [words[i][2], words[i][0]];

    }


    // hide speech
    var speechDiv = document.getElementById("text2speech");
    if (speechDiv.style.display === "none") {
      speechDiv.style.display = "block";
    } else {
      speechDiv.style.display = "none";
    }



    // toggle boolean
    standardLang_flag=!standardLang_flag;

}


// -----------------------
// Automode 
// -----------------------
function autoforward() {
  nextFlashcard();

}
myVar=null
auto_flag=0;
function automode() {
  if(auto_flag){
    clearInterval(myVar);
  }else{
     myVar = setInterval(autoforward, 2000);
    document.addEventListener("keydown", nextAuto, false);
  }
  auto_flag=!auto_flag; 
  
}

function nextAuto(e) {
var keyCode = e.keyCode;
  if(keyCode==13) {
    clearInterval(myVar);
     myVar = setInterval(autoforward, 2000);
    nextItem();
  } else {
    nextFlashcard();
  }
}



// -----------------------
// focus mode 
// todo: refactor, looks ugly now
// -----------------------

function focusFunction() {
    var hide0 = document.getElementById("myCanvas");

    var hide1 = document.getElementById("fileLabel");
    var hide2 = document.getElementById("myFile");
    var hide3 = document.getElementById("prosFileButton");
    var hide4 = document.getElementById("prosLabel");
    var hide5 = document.getElementById("prosButton");
    var hide6 = document.getElementById("myTextarea");
    if (hide0.style.display == "none") {
        hide0.style.display = "block";
      } else {
        hide0.style.display = "none";
      }
  
    if (hide1.style.display == "none") {
      hide1.style.display = "block";
    } else {
      hide1.style.display = "none";
    }
    
    if (hide2.style.display == "none") {
        hide2.style.display = "block";
      } else {
        hide2.style.display = "none";
      }
      
      if (hide3.style.display == "none") {
        hide3.style.display = "block";
      } else {
        hide3.style.display = "none";
      }
      if (hide4.style.display == "none") {
        hide4.style.display = "block";
      } else {
        hide4.style.display = "none";
      }
      if (hide5.style.display == "none") {
        hide5.style.display = "block";
      } else {
        hide5.style.display = "none";
      }
      if (hide6.style.display == "none") {
        hide6.style.display = "block";
      } else {
        hide6.style.display = "none";
      }
      var alignValue = "center";

      var div1 = document.getElementById ("input_output");
      var div2 = document.getElementById ("buttons");
      div1.style.textAlign = "center";
      div2.style.textAlign = "center";

  }




  
// -----------------------
// cookie. 
// -----------------------
function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  console.log(expires);
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  var user=getCookie("username");
  if (user != "") {
    document.getElementById("dispcookie").innerHTML = user;
  } else {
     user = prompt("Please enter your name:","");
     if (user != "" && user != null) {
       setCookie("username", user, 30);
     }
  }
}