input=document.getElementById("new-habit");
inputTodo=document.getElementById("new-todo")

let todoArea=document.getElementById("todo");
let habitArea=document.querySelector(".habit-section");
let todoBtn=document.getElementById("todo-btn");
let habitBtn=document.getElementById("habit-btn");

document.getElementById("menu").addEventListener('click',function(){
    document.querySelector(".habit-side-bar").style.transform="translateX(0px)"

});

document.getElementById("arrow-back").addEventListener('click',function(){
    document.querySelector(".habit-side-bar").style.transform="translateX(-400px)"
})

let chart;
let barchart;
let horibar;
let pieChart;
let piechart;


function openSlide(e){
    e.nextElementSibling.classList.add("slide");
}
function closeSlide(e){
    e.parentElement.classList.remove("slide");
}

function chartSlider(){
    document.getElementById("charts-area").style.display="flex";
    document.querySelector(".show-habits").style.filter="blur(1px)";
    document.querySelector(".finished-habits").style.filter="blur(1px)";
    document.querySelector(".habit-side-bar").style.filter="blur(1px)";
    document.querySelector(".habit-input").style.filter="blur(1px)";
    document.querySelector("#habit-title-name").style.filter="blur(1px)"
    document.querySelector(".habit-details-section").style.filter="blur(1px)"
}
function closeChart(){
    document.getElementById("charts-area").style.display="none";
    document.querySelector(".show-habits").style.filter="blur(0px)";
    document.querySelector(".habit-side-bar").style.filter="blur(0px)";
    document.querySelector(".finished-habits").style.filter="blur(0px)";
    document.querySelector(".habit-input").style.filter="blur(0px)";
    document.querySelector("#habit-title-name").style.filter="blur(0px)";
    document.querySelector(".habit-details-section").style.filter="blur(0px)"
    chart.destroy()
    barchart.destroy()
    horibar.destroy()
    $('#calendar').evoCalendar('destroy');
}

todoBtn.addEventListener("click",function(){
    
    todoArea.style.display="block"
    habitArea.style.display="none";
    todoBtn.style.backgroundColor="rgba(197, 173, 233, 0.173)";
    habitBtn.style.backgroundColor="transparent"
})
habitBtn.addEventListener("click",function(){
    todoArea.style.display="none";
    habitArea.style.display="block";
    habitBtn.style.backgroundColor="rgba(197, 173, 233, 0.173)";
    todoBtn.style.backgroundColor="transparent";
    closeSlide()
   
})

function openScoreStreak(ele){
    let e=ele.parentElement.nextElementSibling;
    e.classList.add("dispScore2")
}
function closeScoreStreak(ele){
    let e=ele.parentElement;
    e.classList.remove("dispScore2")
}

