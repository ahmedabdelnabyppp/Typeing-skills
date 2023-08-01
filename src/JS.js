const drownback = document.querySelector(".absolute");
const button = document.querySelector(".button");
const everyButton = document.querySelectorAll(".level button");
const inputword=document.querySelector("#test");
const inputsecond=document.querySelector("#secondtest");
const listtest=document.querySelector("#got");
const del=document.querySelectorAll("#delete");
export let arrayoftest=[]
let Gameid;

if(window.localStorage.getItem("tests")){
arrayoftest=JSON.parse(window.localStorage.getItem("tests"))
}

if(window.location.href.includes('/src/index.html')){
  window.sessionStorage.removeItem("Gameid")
}

listtest.addEventListener("click",function(ele){
    if(ele.target.classList.contains("delete")){
        delteTest(ele.target.getAttribute("data-id"))
       const child=ele.target.parentElement;
       child.parentElement.parentElement.remove()
    }
})
    listtest.addEventListener("click",function(ele){
        if(ele.target.classList.contains("testgame")){
           Gameid=ele.target.getAttribute("data-id");
           window.sessionStorage.setItem("Gameid",Gameid);
           window.location.href='game.html'
        }
    })

del.forEach(element=>{
    element.addEventListener("click",function(){
        console.log("element")
    })
})

getlocalstorage()

function setLevel() {
    everyButton.forEach(element => {
        element.onclick = function () {
            window.sessionStorage.setItem("level", this.value);
            window.location.href = './game.html'
        }
    })
}
setLevel()

//drowback in menue
button.onclick = function () {
    drownback.classList.toggle("hidden");
}

// focus the input hidden the empty massage 
let stop=setInterval(function(){
    if(inputword.value!="" && inputsecond.value!=""){
        document.querySelector(".emptyText").classList.remove("showemptyText");
        clearInterval(stop)
    }
},20)

document.querySelector("#add").onclick=function(ele){
    if(inputword.value=="" || inputsecond.value==""){
      document.querySelector(".emptyText").classList.add("showemptyText");
      ele.preventDefault();
    }
    else{
     AddTestOfArray(inputword.value,inputsecond.value);
     inputword.value=' '
     inputsecond.value=' '
     document.querySelector(".emptyText").classList.remove("showemptyText");
    }
}
function AddTestOfArray(word,second){
    const test={
        id:Date.now(),
        text:word,
        seconds:second,
    }
    // add this object in the array
    arrayoftest.push(test)
    AddTestPage(arrayoftest);
    // add array in localstorage
    Addlocalstorage(arrayoftest);
}

function Addlocalstorage(arrayoftest){
    const textarray=JSON.stringify(arrayoftest);
    window.localStorage.setItem("tests",textarray);
}

function delteTest(testid){
    const indexdelete=0
    if(window.localStorage.getItem("tests")){
        const data=JSON.parse(window.localStorage.getItem("tests"));
        for(let i=0;i<arrayoftest.length;i++){
           if(data[i].id===testid){
            indexdelete=i;
           }
        }
        data.splice(indexdelete,1);
        const update=JSON.stringify(data);
        window.localStorage.setItem("tests",update);
        window.location.reload();
    }
}
function AddTestPage(arrayoftest){
listtest.innerHTML=''
arrayoftest.forEach(element=>{
    const test = `
    <li class="flex justify-between gap-x-6 py-5  md:mx-auto md:px-32 bg-gradient-to-r relative from-sky-50 to-white rounded-lg my-4">
    <div class="flex gap-x-4">
      <i class="fi fi-sr-time-quarter-to"></i>
      <div class="min-w-0 flex-auto">
        <p class="text-sm font-semibold leading-6 text-gray-900 line-clamp-3">${element.text}</p>
        <p class="mt-1 truncate text-xs leading-5 text-gray-500">second : <span>${element.seconds}</span></p>
      </div>
    </div>
    <div class="items-end">
      <div class="flex justify-between ">
        <button  data-id=${element.id} class=" testgame border-none py-2 me-2 w-24 md:w-auto md:px-5 text-gray-900 rounded-md bg-sky-100 hover:bg-sky-400 delay-75" >Game</button>
        <button  data-id=${element.id}  class=" delete border-none py-2 w-24 md:w-auto md:px-5 text-gray-900 rounded-md bg-sky-100 hover:bg-sky-400 delay-75">Delete</button>
      </div>
    </div>
  </li>
     ` 
    const LiElement=document.createElement("li");
    LiElement.innerHTML=test;
    listtest.appendChild(LiElement);
})    
}

function getlocalstorage(){
    if(window.localStorage.getItem("tests")){
        const tests=JSON.parse(window.localStorage.getItem("tests"));
        AddTestPage(tests)
    }
}

