let countWord=0
let errorwords=0
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;

//defulte words and sceonds
let gameTime=60*1000
let words= 'good real one not school set they state high life consider on and not come what also for set point can want as while with of order child about school thing never hold find order each too between program work end you home place around while place problem end begin interest while public or where see time those increase interest be give end think seem small as both another a child same eye you between way do who into again good fact than under very head become real possible some write know however late each that with because that place nation only for each change form consider we would interest with world so order or run more open that large write turn never over open each over change still old take hold need give by consider line only leave while what set up number part form want against great problem can because head so first this here would course become help year first end want both fact public long word down also long for without new turn against the because write seem line interest call not if line thing what work people way may old consider leave hold want life between most place may if go who need fact such program where which end off child down change to from people high during people find to however into small new general it do that could old for last get another hand much eye great no work and with but good there last think can around use like number never since world need what we around part show new come seem while some and since still small these you general which seem will place come order form how about just also they with state late use both early too lead general seem there point take general seem few out like might under if ask while such interest feel word right again how about system such between late want fact up problem stand new say move a lead small however large public out by eye here over so be way use like say people work for since interest so fac who old way large no first too now off would in this course present order home public also'.split(' ');
let wordsCount=words.length

function givetestcase(){
  let Gameid=0;
  let index=0
  if(window.sessionStorage.getItem("Gameid")){
     Gameid=window.sessionStorage.getItem("Gameid")
     if(window.localStorage.getItem("tests")){
      const date=JSON.parse(window.localStorage.getItem("tests"));
      for(let item in date){
        if(date[item].id==Gameid){
           index=item
        }
      }
      words=`${date[index].text}`.split(' ');
      wordsCount = words.length;
      gameTime = parseInt(`${date[index].seconds}`)* 1000;
      wordsCount=words.length

     }
  }

}
givetestcase()

function addClass(el,name) {
  el.className += ' '+name;
}
function removeClass(el,name) {
  el.className = el.className.replace(name,'');
}
function randomWord() {
  const randomIndex = Math.ceil(Math.random() * wordsCount);
  return words[randomIndex - 1];
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}

function newGame() {
  if(window.sessionStorage.getItem("level")){
    document.querySelector(".Level").innerHTML=`${window.sessionStorage.getItem("level")}`
  }
  document.querySelector("#game").onfocus=()=>{
    document.querySelector("#input").focus();
  }
  document.querySelector("#input").focus();
  document.getElementById('words').innerHTML = '';
  for (let i = 0; i <words.length; i++) {
    document.getElementById('words').innerHTML += formatWord(words[i]);
  }
  addClass(document.querySelector('.word'), 'current');
  addClass(document.querySelector('.letter'), 'current');
  document.querySelector('#info span').innerHTML = (gameTime / 1000) + '';
  window.timer = null;
}

function gameOver() {
  clearInterval(window.timer);
  addClass(document.getElementById('game'), 'over');
  Achiement();
}

document.getElementById('input').addEventListener('keyup', ev => {

  const key = ev.key;
  const currentWord = document.querySelector('.word.current');
  const currentLetter = document.querySelector('.letter.current');
  const expected = currentLetter?.innerHTML || ' ';
  const isLetter = key.length === 1 && key !== ' ';
  const isSpace = key === ' ';
  const isBackspace = key === 'Backspace';
  const isFirstLetter = currentLetter === currentWord.firstChild;
  //show #cursor
  document.querySelector("#cursor").style.cssText="display:block";
  if (document.querySelector('#game.over')) {
    return;
  }

  if (!window.timer && isLetter) {
    window.timer = setInterval(() => {
      document.querySelector('#info span').innerHTML--;
      if(document.querySelector('#info span').innerHTML==0){
        gameOver()
      }
    }, 1000);
  }

  if (isLetter) {
    if (currentLetter) {
      if(key===expected){
        countWord++;
        setprogress();
        addClass(currentLetter,'correct');
      }
      else{
        addClass(currentLetter,'incorrect');
        errorwords++;
      }
      removeClass(currentLetter, 'current');
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, 'current');
      }
    } 
  }

  if (isSpace) {
    if (expected !== ' ') {
      const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
      lettersToInvalidate.forEach(letter => {
        addClass(letter, 'incorrect');
      });
    }
    removeClass(currentWord, 'current');
    addClass(currentWord.nextSibling, 'current');
    if (currentLetter) {
      removeClass(currentLetter, 'current');
    }
    addClass(currentWord.nextSibling.firstChild, 'current');
  }

  if (isBackspace) {
    if (currentLetter && isFirstLetter) {
      // make prev word current, last letter current
      removeClass(currentWord, 'current');
      addClass(currentWord.previousSibling, 'current');
      removeClass(currentLetter, 'current');
      addClass(currentWord.previousSibling.lastChild, 'current');
      removeClass(currentWord.previousSibling.lastChild, 'incorrect');
      removeClass(currentWord.previousSibling.lastChild, 'correct');
      numberWord[0].innerHTML--;
    }
    if (currentLetter && !isFirstLetter) {
      // move back one letter, invalidate letter
      removeClass(currentLetter, 'current');
      addClass(currentLetter.previousSibling, 'current');
      removeClass(currentLetter.previousSibling, 'incorrect');
      removeClass(currentLetter.previousSibling, 'correct');
      numberWord[0].innerHTML--;
    }
    if (!currentLetter) {
      addClass(currentWord.lastChild, 'current');
      removeClass(currentWord.lastChild, 'incorrect');
      removeClass(currentWord.lastChild, 'correct');
      numberWord[0].innerHTML--;
    }
  }

  // move lines / words
  if (currentWord.getBoundingClientRect().top > 250) {
    const words = document.getElementById('words');
    const margin = parseInt(words.style.marginTop || '0px');
    words.style.marginTop = (margin - 35) + 'px';
  }

  // move cursor
  const nextLetter = document.querySelector('.letter.current');
  const nextWord = document.querySelector('.word.current');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextLetter || nextWord).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextLetter || nextWord).getBoundingClientRect()[nextLetter ? 'left' : 'right'] + 'px';
});

function setprogress(){
  if(window.localStorage.getItem("level")){
    if(countWord<=window.localStorage.getItem("level")){
      const new_width=(countWord/window.localStorage.getItem("level"))*100
      if(new_width<=100){
        document.querySelector(".progress").setAttribute("style",`width:${new_width}%`)
      }
    }
  }
  
}
function Achiement(){
  const speed=Math.ceil(window.localStorage.getItem("level")/60);
  document.querySelector(".speed").innerHTML=`${speed}`
  const wordsPersecond=countWord;
  document.querySelector(".persecond").innerHTML=`${wordsPersecond}`;
  const werror=errorwords;
  document.querySelector(".error").innerHTML=`${werror}`;
  const Achiement=document.querySelector("#Achiement");
  removeClass(Achiement,"hidden");
  addClass(document.querySelector("#CardGame"),"hidden")

}

// this even is on button new game
document.querySelector("#newgame").onclick=()=>{
  window.location.reload();
}
newGame();
