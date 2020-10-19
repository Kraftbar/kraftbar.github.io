// TODO
//   - bug:  text2speech
//   - refactooooooor!!
//   - consider reset in automode
//   - colour in  based on correct_flag
//   - reset languages when new   read
//   - think about own regex function | replace  | replace

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.font = "30px Arial";
ctx.fillText("Hello World", 10, 50);


// globals 
var words = new Array(1000);
var words_buffer = new Array(1000);
var words_length=0;
correct_flag=0;
standardLang_flag=1;



// ---------------------------------------------------------------------
// file/ txts handeling 
// ---------------------------------------------------------------------


function pros(csv){

    csv=format(csv);
    var rows = csv.split('\n');
    for (var i = 0; i < rows.length; i++) {
      words[i] = rows[i].split('\t');
    }

    k=0;
    words_length=rows.length;
    document.getElementById('output').innerHTML = words[k][0]+" "+words[k][1];
    
}

function format(text){
  // replace brackets and whats within
  text=text.replace(/ *\([^)]*\) */g, "");  
  // whitespaces in front 
  text=text.replace(/^ */gm, "");     
  // trailing newline and  whitespaces
  text=text.replace(/[ \n]+$/, "");     
  return text;
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


// Feedback correct (todo, need refactor)
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

// ---------------------------------------------------------------------
// display word array 
// ---------------------------------------------------------------------

function nextFlashcard(){
    var feedbackvalue = document.getElementById("feedback").textContent;
    console.log(feedbackvalue);
    if (feedbackvalue=="" || feedbackvalue=="-" || feedbackvalue.includes("☓")){
      document.getElementById('feedback').textContent = words[k][2];
    }else{
      nextItem();
    }
}
function nextItem() {
    document.getElementById('feedback').innerHTML="";
    document.getElementById('typed_word').value="";    
    k = k+1; 
    k = k % (words_length); 
    document.getElementById('output').textContent =   words[k][0]+" "+words[k][1];
}
function prevItem() {
    document.getElementById('feedback').innerHTML="";
    document.getElementById('typed_word').value="";
    k = k - 1; 
    if(k<0){k=0;}
    document.getElementById('output').textContent =  words[k][0]+" "+words[k][1]; 
}

// Feedback correct (todo, need refactor)
function checkItem() {
  var inputVal = document.getElementById("typed_word").value.toLowerCase();
  var answer=words[k][2];  
  var answers=answer.split(", ");
  feedback=prossFeedback(inputVal,answers);
    if(inputVal==feedback){              
      correct_flag=correct_flag+1;
      document.getElementById('feedback').textContent=   feedback.concat(" ✓");
    }else{
      correct_flag=0;
    
      document.getElementById('feedback').textContent=  feedback.concat(" ☓");
    }
}




// ---------------------------------------------------------------------
// User input 
// ---------------------------------------------------------------------

// button input
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







// ---------------------------------------------------------------------
// hotkeys. 
// ---------------------------------------------------------------------
var typed_word = document.getElementById("typed_word");

document.addEventListener("keydown",    global_hotkeys, false);

typed_word.addEventListener('focus', function() {
  document.removeEventListener("keydown", global_hotkeys, false);  
  document.addEventListener("keydown",    inputfield_hotkeys, false);
});
typed_word.addEventListener('focusout', function() {
  document.addEventListener("keydown",    global_hotkeys, false);
  document.removeEventListener("keydown", inputfield_hotkeys, false);  
});

function inputfield_hotkeys(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    checkItem();
    if(correct_flag>1){
       nextItem();
    }
    }
}

function global_hotkeys(e) {
  var keyCode = e.keyCode;
    if(keyCode==13) {
      //clearInterval(myVar);
      //myVar = setInterval(autoforward, 2000);
      nextFlashcard();
    } 
    if(keyCode == 191) {
      prevItem();
    }
    if(keyCode == 37) {
      prevItem();
    }
    if(keyCode ==39 ) {
      nextItem();
    }
    if(keyCode == 70) {
      focusFunction();
    }
  }
  




// ---------------------------------------------------------------------
// Misc. 
// ---------------------------------------------------------------------
function text2speech(){
  var msg = new SpeechSynthesisUtterance(words[k][0]);msg.lang = 'zh-CN';
window.speechSynthesis.speak(msg);
}

function randomize() {
  words.sort(() => Math.random() - 0.5);
  for (var i = 0; i < words_length; i++) {
    words_buffer[i]=words[i][1];
  }
  nextItem();
}

function changeLangFunction(pos1,pos2) {
    for (var i = 0; i < words_length; i++) {
        [words[i][pos1], words[i][pos2]] = [words[i][pos2], words[i][pos1]];
    }
}


function hideMiddle() {
    for (var i = 0; i < words_length; i++) {
        if(standardLang_flag){
            words_buffer[i]=words[i][1];
            words[i][1]="";

        }else{
            words[i][1]=words_buffer[i];
        }
    }
    standardLang_flag=!standardLang_flag;
}



// ---------------------------------------------------------------------
// Automode 
// ---------------------------------------------------------------------

myVar=null
auto_flag=0;
function automode() {
  if(auto_flag){
    clearInterval(myVar);
  }else{
     myVar = setInterval(nextFlashcard, 2000);
  }
  auto_flag=!auto_flag; 
  
}



// ---------------------------------------------------------------------  
// change lang 
// ---------------------------------------------------------------------


const fills = document.querySelectorAll('.fill');
const empties = document.querySelectorAll('.empty');

 let shuffleElement;
 let shuffleParentElement;
 let hopFrom;
 let hopTo;
// -----------------Drag Functions
// Fill listeners
for (const fill of fills) {
    fill.addEventListener('dragstart', dragStart);
    fill.addEventListener('dragend', dragEnd);
}
// Loop through empty boxes and add listeners
for (const empty of empties) {
    empty.addEventListener('dragover', dragOver);
    empty.addEventListener('dragenter', dragEnter);
    empty.addEventListener('dragleave', dragLeave);
    empty.addEventListener('drop', dragDrop);
}

function dragStart(e) {
    this.className += ' hold';
    setTimeout(() => (this.className = 'invisible'), 0);
    shuffleElement = e.currentTarget;
    shuffleParentElement = e.currentTarget.parentElement;
    // added 
    hopFrom=shuffleParentElement.id;
    if(shuffleParentElement.id== "1" && shuffleElement.innerHTML=="x" ){
            shuffleElement.innerHTML=shuffleElement.id;
            hideMiddle();
    }   
}
function dragEnd()    { this.className = 'fill';   hopTo=this.parentElement.id; switchlang();  }
function dragOver(e)  { e.preventDefault();     }
function dragEnter(e) { e.preventDefault();  this.className += ' hovered';    }
function dragLeave()  { this.className = 'empty';    }
 function dragDrop() {
    this.className = 'empty';
    const shuffleWithElement = this.querySelector('.fill');
    this.innerHTML = '';
    this.append(shuffleElement);
    if(shuffleWithElement) {    
      shuffleParentElement.innerHTML = '';
      shuffleParentElement.append(shuffleWithElement);
    }
}

// ----------------- own helpers
function onClickLang(el) {
    temp_child=document.getElementById(el).firstElementChild;
    if   (temp_child.innerHTML== "x"){
      document.getElementById(el).firstElementChild.innerHTML=temp_child.id;
    }else{
      document.getElementById(el).firstElementChild.innerHTML = "x";  
    }
    hideMiddle();
}
function switchlang(){
    if ( hopFrom!= hopTo) {
    changeLangFunction(hopFrom,hopTo)
        
    }
}



// ---------------------------------------------------------------------
// focus mode 
// todo: refactor, looks ugly now
// ---------------------------------------------------------------------

function focusFunction() {
    var hide0 = document.getElementById("myCanvas");
    var hide1 = document.getElementById("fileLabel");
    var hide2 = document.getElementById("myFile");
    var hide3 = document.getElementById("prosFileButton");
    var hide4 = document.getElementById("prosLabel");
    var hide5 = document.getElementById("prosButton");
    var hide6 = document.getElementById("myTextarea");
    hide0.style.display = hide0.style.display === 'none' ? '' : 'none';
    hide1.style.display = hide1.style.display === 'none' ? '' : 'none';
    hide2.style.display = hide2.style.display === 'none' ? '' : 'none';
    hide3.style.display = hide3.style.display === 'none' ? '' : 'none';
    hide4.style.display = hide4.style.display === 'none' ? '' : 'none';
    hide5.style.display = hide5.style.display === 'none' ? '' : 'none';
    hide6.style.display = hide6.style.display === 'none' ? '' : 'none';
    var div1 = document.getElementById ("input_output");
    var div2 = document.getElementById ("buttons");
    div1.style.textAlign = "center";
    div2.style.textAlign = "center";

  }




  
// ---------------------------------------------------------------------
// cookie. 
// ---------------------------------------------------------------------
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
    user=""
    while(user!="pepe"){
     user = prompt("Please enter secret pass:","");
     if (user != "" && user != null) {
       setCookie("username", user, 30);
     }
    }
  }
}
