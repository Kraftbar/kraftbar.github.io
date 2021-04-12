// TODO:
//   - bug:  text2speech
//
//   - in  format function, consider to remove all chars that is not needed 
//   - colour in  based on correct_flag
//   - dont show word after multiple correct answers
//
//   - reset things after new Process 
//
//   - find a way to check pinyin 

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.font = "30px Arial";
ctx.fillText("Hello World", 10, 50);


// globals 
var words = new Array(1000);
var words_buffer = new Array(1000);
var words_log = new Array(1000);
var words_length=0;
correct_flag=0;
standardLang_flag=1;



// ---------------------------------------------------------------------
// file/ txts handling 
// ---------------------------------------------------------------------


function pros(csv){
    csv=format(csv);
    var rows = csv.split('\n');
    for (var i = 0; i < rows.length; i++) {
      words[i] = rows[i].split('\t');
    }
    // init globals 
    k=0;
    words_length=rows.length;
    // init text
    document.getElementById('output').innerHTML  = words[k][0]+" "+words[k][1];
    fillMult();
    // log txt
    textHash(csv)
}

function format(text){
  // replace brackets and whats within
  text=text.replace(/ *\([^)]*\) */g, "");  
  // whitespaces in front 
  text=text.replace(/^ */gm, "");     
  // trailing newline and  whitespaces
  text=text.replace(/[ \n]+$/, "");     
  // not case sensitive
  text=text.toLowerCase()
  return text;
} 


function processText(){
    var x = document.getElementById("myTextarea").value;
    pros(x)
}



// ---------------------------------------------------------------------
// Hide word after multiple correct answers 
// ---------------------------------------------------------------------
// wordMemory=[[word1,log],
//             [word2,log],
//             [word3,log]]

function removeWord(){

}

// 
function logAnswer(){
}



// ---------------------------------------------------------------------
// check item   (needs refactor)
// ---------------------------------------------------------------------

function checkAnswer(userInput){

  highestMatchScores=[];
  feedbacks=[];

  
  // get match score(s) 
  var answer=words[k][2];  
  var solutions=answer.split(", ");

  
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

  // sort and get highest match score 
  var sorted = [...highestMatchScores].sort((a,b) => b - a);
  highestMatchIndex=highestMatchScores.indexOf(sorted[0]);
  feedback= feedbacks[highestMatchIndex];


  // for multi_c
  var userInputs=userInput.split(", ");
  const found = userInputs.some(r=> solutions.indexOf(r) >= 0)
  // return
  if(userInput==feedback || found>0){              
    correct_flag=correct_flag+1;
  }else{
    correct_flag=0;
  }
  return feedback;
}




// ---------------------------------------------------------------------
// display word array 
// ---------------------------------------------------------------------

// Feedback correct 
function checkItem() {
  var userInput = document.getElementById("typed_word").value.toLowerCase();
  feedback=checkAnswer(userInput);
  if(correct_flag>0){              
    document.getElementById('feedback').textContent=  feedback.concat(" ✓");
  }else{
    document.getElementById('feedback').textContent=  feedback.concat(" ☓");  
  }

}
function nextFlashcard(){
    var feedbackvalue = document.getElementById("feedback").textContent;
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
    fillMult();
}
function prevItem() {
    document.getElementById('feedback').innerHTML="";
    document.getElementById('typed_word').value="";
    k = k - 1; 
    if(k<0){k=0;}
    document.getElementById('output').textContent =  words[k][0]+" "+words[k][1]; 
    fillMult();
}


// ---------------------------------------------------------------------
// multi. choice 
// ---------------------------------------------------------------------
function fillMult(){
  var inputs = document.querySelectorAll('input[type=submit]');
  inputs=Array.from(inputs);
  inputs=inputs.sort(() => Math.random() - 0.5);
  inputs[0].value=words[k][2];
  for (var i = 1; i < inputs.length; i++) {
    inputs[i].value=words[Math.floor(Math.random() * words_length)][2];
  }
}


function checkmult(div_id){
  m_answer=document.getElementById(div_id).value;
  checkAnswer(m_answer);
  if(correct_flag>0){
    nextItem();
  }

}



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
    if(keyCode == 13) {nextFlashcard();} 
    if(keyCode == 191) {prevItem();}
    if(keyCode == 37) {prevItem();}
    if(keyCode == 39 ) {nextItem();}
    if(keyCode == 49 || keyCode == 100) {checkmult("m1");}
    if(keyCode == 50 || keyCode == 101) {checkmult("m2");}
    if(keyCode == 51 || keyCode == 97) {checkmult("m3");}
    if(keyCode == 52 || keyCode == 98) {checkmult("m4");}
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
    var hide4 = document.getElementById("prosLabel");
    var hide5 = document.getElementById("prosButton");
    var hide6 = document.getElementById("myTextarea");
    hide0.style.display = hide0.style.display === 'none' ? '' : 'none';
    hide4.style.display = hide4.style.display === 'none' ? '' : 'none';
    hide5.style.display = hide5.style.display === 'none' ? '' : 'none';
    hide6.style.display = hide6.style.display === 'none' ? '' : 'none';
    var div1 = document.getElementById ("input_output");
    var div2 = document.getElementById ("buttons");
    var div4 = document.getElementById ("multgrid");
    div1.style.textAlign = "center";
    div2.style.textAlign = "center";
    div4.style.textAlign = "center";

  }

function multiChoice() {
    var hide0 = document.getElementById("multgrid");
    hide0.style.display = hide0.style.display === 'none' ? '' : 'none';
}
multiChoice();






  
// ---------------------------------------------------------------------
// cookie. 
// ---------------------------------------------------------------------

// use hash to idetify words 
function textHash(txt_input) {
  // remove newline
  txt_hash=txt_input.replace(/(\r\n|\n|\r)|\t| /gm, "");
  // pick out at random substing 
  txt_hash=txt_hash.replace(/.(.){4}/g,"$1")
  console.log(txt_hash)
}


function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
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

function saveCookie(){}
function loadCookie(){}

// need rewriting, use  functions above
function checkCookie() {
  var user=getCookie("username");
  document.getElementById("dispcookie").innerHTML = user;
  user = prompt("Please enter secret pass:","");
  setCookie("username", user, 30);
}












