// Search a random word from words array 
// let selectedWord=words[Math.floor(Math.random()*words.length)];
let tries=0

async function init(){
    await selectWord();
    showWordle();
    setEvents();
}
async function selectWord(){
    let response=await fetch(`https://palabras-aleatorias-public-api.herokuapp.com/random`);
    let finalData=await response.json();
    let selectedWord=finalData.body.Word;
    let word=[...selectedWord]
    while(selectedWord.length<4 || selectedWord.length>6){
        response=await fetch(`https://palabras-aleatorias-public-api.herokuapp.com/random`);
        finalData=await response.json();
        selectedWord=finalData.body.Word;
        word=[...selectedWord]
        console.log(selectedWord)
    }
    localStorage.setItem("word",JSON.stringify(word))
    localStorage.setItem("selectedWord",JSON.stringify(selectedWord))
    localStorage.setItem("hint",JSON.stringify(finalData.body.DefinitionMD))
}

function showWordle(){
    let hint=JSON.parse(localStorage.getItem("hint"))
    console.log(hint)
    let p=document.querySelector(`#hint`)
    p.innerHTML=`<b>Hint</b>: ${hint.slice(hint.indexOf(".")+1,hint.indexOf(":"))}`
    let word=JSON.parse(localStorage.getItem("word"))
    let wordle=document.querySelector(`#attempts`)
    for(let i=0;i<maxTries;i++){
        let row=document.createElement(`div`)
        row.className=`row justify-content-center`
        row.setAttribute(`id`,`row${i}`)
        word.forEach(letra => {
            row.innerHTML+=`<div class="col-2 letter align-items-center"><p class="text-center"></p></div>`
        });
        wordle.appendChild(row)

    }
}
function setEvents(){
    let input=document.querySelector(`#try`)
    input.addEventListener(`keypress`,(event)=>{
        if(event.keyCode===13){ //verifies if enter was pressed
            attempt(input.value);
        }
    })
    let btn=document.querySelector(`#tryBtn`)
    btn.addEventListener(`click`,()=>attempt(input.value))
}
function attempt(input){
    let selectedWord=JSON.parse(localStorage.getItem("selectedWord"))
    let word=JSON.parse(localStorage.getItem("word"))
    console.log(selectedWord)
    if(tries<6){ //verifies the number of attempts left
        let attempt=[...input]
        let row=document.querySelector(`#row${tries}`)
        if(attempt.length!==word.length){
            alert(`Debe contener ${word.length} caracteres`)
        }else if(attempt==``){
            alert(`Es necesario ingresar un valor`)
        }else{
            row.innerHTML=``
            let character=0
            attempt.forEach(letra => { 
                if (attempt[character]===word[character]){
                    row.innerHTML+=`<div class="col-2 letter align-items-center bg-green"><p class="text-center">${letra.toUpperCase()}</p></div>`
                }else
                if(word.includes(letra)){
                    row.innerHTML+=`<div class="col-2 letter align-items-center bg-yellow"><p class="text-center">${letra.toUpperCase()}</p></div>`
                }
                else{
                    row.innerHTML+=`<div class="col-2 letter align-items-center"><p class="text-center">${letra.toUpperCase()}</p></div>`
                }
                character++
            });
            character=0
            document.querySelector(`#try`).value=""
            tries++
            if(tries==6){lostGame(JSON.parse(localStorage.getItem("selectedWord")))}
        }
    }
}
function lostGame(word){
    let inputs=document.querySelector(`.inputs`)
    inputs.classList.add("hidden")
    let attempts=document.querySelector(`#attempts`)
    console.log(attempts)
    let message=document.createElement(`h5`)
    message.classList.add(`text-center`,`bg-error`)
    message.innerText=`You lost, the answer was ${word.toUpperCase()}`
    attempts.appendChild(message)
}