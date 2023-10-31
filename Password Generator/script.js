const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const sysmbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generatebutton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols ='~!@#$%^&*()_+`[]\{}|:";,./<>?'; 
 
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

setIndicator("#ccc");

//password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength; 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =((passwordLength-min)*100/(max-min)) + "% 100%";

}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(max, min){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
   return getRndInteger(0,9);
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateSymbol(){
     const rand= getRndInteger(0,symbols.length);
     return symbols.charAt(rand);
}

function calcStrength(){
    let hasUpper = false;
    let haslower = false;
    let hasNumber = false;
    let hasSymbol= false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) haslower=true;
    if(numbersCheck.checked) hasNumber=true;
    if(sysmbolsCheck.checked) hasSymbol=true;

    if(hasUpper && haslower && (hasNumber || hasSymbol) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((haslower || hasUpper) && (hasNumber || hasSymbol) && passwordLength>=6){
            setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
     
}

function shufflePassword(array){
    for(let i= array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j]=temp;
    }
    let str = "";
    array.forEach((el)=>(str+=el));
    return str;
}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckbox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider( ); 
    }
}
allCheckbox.forEach( (checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

 
inputSlider.addEventListener('input', (slider)=>{
    passwordLength=slider.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click', ()=>{
        if(checkCount<=0)return;

        if(passwordLength<checkCount){
            passwordLength = checkCount;
            handleSlider();
        }
        //remove old password

        password = "";

        let funcArr =[];

        if(uppercaseCheck.checked)
            funcArr.push(generateUpperCase);

        if(lowercaseCheck.checked)
            funcArr.push(generateLowerCase);
        
        if(numbersCheck.checked)
            funcArr.push(generateRandomNumber);

        if(sysmbolsCheck.checked)
            funcArr.push(generateSymbol);

        //addition

        for(let i = 0 ;i<funcArr.length ; i++){
            password+=funcArr[i]();
        }

        for(let i=0; i<passwordLength-funcArr.length; i++){
             let randIndex = getRndInteger(0,funcArr.length);
             password+=funcArr[randIndex]();
        }
        password = shufflePassword(Array.from(password));

        //show in UI
        passwordDisplay.value = password;

        calcStrength();
})

