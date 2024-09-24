let swithSignup = document.querySelector(".small-sign");
let switchLogin = document.querySelector(".small-login");
let loginPage = document.querySelector(".login-page");
let signupPage = document.querySelector(".signup-page");

swithSignup.addEventListener('click', function () {
    loginPage.style.display = "none";
    signupPage.style.display = "flex";
})

switchLogin.addEventListener('click', function () {
    loginPage.style.display = "flex";
    signupPage.style.display = "none";
})

import { initializeApp } from 'firebase/app'

import {
    collection,
    getFirestore,
    addDoc,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    onSnapshot,
    deleteDoc
} from 'firebase/firestore'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyA6VuZCuqXj_JiYtKcHka5oiO21TA_5YfE",
    authDomain: "trackify-580d1.firebaseapp.com",
    projectId: "trackify-580d1",
    storageBucket: "trackify-580d1.appspot.com",
    messagingSenderId: "506692061874",
    appId: "1:506692061874:web:f8ad03f9b9c75a21be57ab"
};

initializeApp(firebaseConfig)

const db = getFirestore();

const auth = getAuth();

let uniqId;

function uniqueId() {
    const date = new Date();
    return `${date.toLocaleDateString()}${date.getTime()}`;
}

function dbDate() {
    const date = new Date();
    return date;
}

function tomorrow(t) {
    const today = new Date();
    const date = new Date(today);
    date.setDate(date.getDate() - t);
    return date.toLocaleDateString();
}
function week() {
    let currentDate = new Date();
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    var weekNumber = Math.ceil(days / 7);
    return weekNumber
}

function monthDayYear(d) {
    const today = new Date();
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    date.setMonth(date.getMonth());
    date.setFullYear(date.getFullYear());
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

function streakDate() {
    return new Date(monthDayYear(0))
}

function getWeek(w) {
    let currentDate = new Date();
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    var weekNumber = Math.ceil(days / 7) - w;
    return weekNumber
}


document.getElementById('btn-for-signup').addEventListener('click', function (e) {
    e.preventDefault();
    let signMail = document.getElementById("sign-user").value;
    let signPass = document.getElementById("sign-pass").value;
    createUserWithEmailAndPassword(auth, signMail, signPass)
    .then(()=>{
        loginPage.style.display = "flex";
    signupPage.style.display = "none";
    })
})

document.getElementById('btn-for-login').addEventListener('click', function (e) {
    e.preventDefault();
    let loginMail = document.getElementById("login-user").value;
    let loginPass = document.getElementById("login-pass").value;
    signInWithEmailAndPassword(auth, loginMail, loginPass)
        .then((cred) => {
            uniqId = cred.user.uid;
            document.querySelector(".outer-layer-for-habit").style.display = "block";
            document.querySelector(".outer-layer-for-signup").style.display = "none";
            userDetails()
            check();
            IndexChange();
            weekChange();
            userDetailsTodos();
        })
        .catch((e) => {
            alert("your password must be 6 or more characters (or) you need to create an account");
        })
})


function userDetails() {

    let docRef = collection(db, 'users', uniqId, "habit")
    onSnapshot(docRef, (snapshot) => {
        let habits = [];
        let docId = [];
        snapshot.docs.forEach((doc) => {
            habits.push(doc.data())
            docId.push(doc.id)
            document.querySelector(".totalhabits").innerText = "Total number of habits: " + habits.length
            document.querySelector(".show-habits").innerHTML = "";
            document.querySelector(".finished-habits").innerHTML = "";
            document.querySelector(".show-habits").innerHTML = `<h3 class="ongoing">On going</h3>`;
            document.querySelector(".finished-habits").innerHTML = `<h3 class="ongoing">Achieved</h3>`;
            for (let i = 0; i < habits.length; i++) {
                if (habits[i].check == false) {
                    document.querySelector(".show-habits").innerHTML += `
                    <div class="habit1">
                        <div class="content-box">
                            <div class="name-check">
                                <h3>${habits[i].habit_name}</h3>
                                 <div class="parent-check">
                                    <input id="${docId[i]}" onclick="updateDetails(this);addScore(this)" class="checkbox" type="checkbox">
                                </div>
                            </div>
                            <div class="streakScore">
                                <div class="streakArrow">
                                    <span class="material-symbols-outlined" data-key="${docId[i]}" onclick="openScoreStreak(this);showScore(this);showStreak(this)">
                                        arrow_back_ios
                                    </span>
                                </div>
                                 <div class="dispScore">
                                     <span class="material-symbols-outlined" onclick="closeScoreStreak(this)">
                                        chevron_right
                                    </span>
                                    <div class="score-number">score: 0</div>
                                    <div class="streak-number">streak: 0</div>
                                </div>
                            </div>
                            <div class="streak-and-score">
                                <div> created on: ${habits[i].dbdate}</div>
                            </div>
                            <div class="view-and-del">
                                <p class="view-chart" data-key="${docId[i]}" onclick="chartSlider();charts(this);streak(this);rank(this);getCalendar(this)">
                                    <span data-key="${habits[i].id}" class="arrow-forward material-symbols-outlined">
                                        arrow_forward
                                    </span>view chart
                                </p>    
                                <p>
                                    <span data-key="${habits[i].id}" data-del="${docId[i]}" onclick="delDoc(this)"  class="del material-symbols-outlined">
                                        delete
                                    </span>
                                </p>
                             </div>
                        </div>
                    </div>`
                }
                else {
                    document.querySelector(".finished-habits").innerHTML +=
                        `
                    <div class="habit1">
                        <div class="content-box">
                            <div class="name-check">
                                <h3>${habits[i].habit_name}</h3>
                                 <div class="parent-check">
                                    <input id="${docId[i]}" onclick="updateDetails(this);addScore(this)" class="checkbox" type="checkbox">
                                </div>
                            </div>
                            <div class="streakScore">
                                <div class="streakArrow">
                                    <span class="material-symbols-outlined" data-key="${docId[i]}" onclick="openScoreStreak(this);showScore(this);showStreak(this)">
                                        arrow_back_ios
                                    </span>
                                </div>
                                 <div class="dispScore">
                                     <span class="material-symbols-outlined" onclick="closeScoreStreak(this)">
                                        chevron_right
                                    </span>
                                    <div class="score-number">score: 0</div>
                                    <div class="streak-number">streak: 0</div>
                                </div> 
                            </div>
                            <div class="streak-and-score">
                                <div> created on: ${habits[i].dbdate}</div>
                            </div>
                            <div class="view-and-del">
                                <p class="view-chart" data-key="${docId[i]}" onclick="chartSlider();charts(this);streak(this);rank(this);getCalendar(this)">
                                    <span data-key="${habits[i].id}" class="arrow-forward material-symbols-outlined">
                                        arrow_forward
                                    </span>view chart
                                </p>    
                                <p>
                                    <span data-key="${habits[i].id}" data-del="${docId[i]}" onclick="delDoc(this)"  class="del material-symbols-outlined">
                                        delete
                                    </span>
                                </p>
                             </div>
                        </div>
                    </div>`

                }
            }

        })

    })

    dashboard();
    check();
}

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        if (input.value.length >= 1) {
            let newHabit = {
                check: false,
                date: ["0/0/0000"],
                dbdate: `${dbDate().toLocaleDateString()}`,
                habit_name: input.value,
                last_opened: `${streakDate()}`,
                score: [0],
                streak: [0],
                week_number: week(),
                week_streak: [0],
                yesterday: `${dbDate().toLocaleDateString()}`,
                id: uniqueId(),
            }
            let doc = collection(db, "users", uniqId, "habit");
            addDoc(doc, newHabit).then(e => {
                input.value = "";
                userDetails();
                updateChart(0, 0);
            })
                .catch((e) => {
                    alert(e)
                })
        }
        else {
            alert("input box contain atleast one character")
        }
    }

});

inputTodo.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        if (inputTodo.value.length >= 1) {
            let newTodo = {
                check: false,
                todo_name: inputTodo.value,
                date: `${dbDate().toLocaleDateString()}`
            }
            let doc = collection(db, 'users', uniqId, 'todo');
            addDoc(doc, newTodo).then(e => {
                inputTodo.value = "";
                chartUpdateTodo(0);
            })
        }
        else {
            alert("input box contain atleast one charactr");
        }
    }
})

window.userDetailsTodos = function () {
    let docRef = collection(db, 'users', uniqId, "todo");
    onSnapshot(docRef, (snapshot) => {
        let todos = [];
        let docId = [];
        snapshot.docs.forEach((doc) => {
            todos.push(doc.data())
            docId.push(doc.id)
        })
        let activeTodo = document.getElementById("active-todo");
        let finishedTodo = document.getElementById("finished-todo");
        document.querySelector(".totaltodos").innerText = "Total number of todos: " + todos.length
        activeTodo.innerHTML = "",
            finishedTodo.innerHTML = "";
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].check === false) {
                activeTodo.innerHTML += `<div class="todo-outer">
                    <div class="input-box">
                      <input data-key="${docId[i]}" type="checkbox"  onclick="updateTodo(this)">
                      <div  class="todo-name">
                      ${todos[i].todo_name}
                      </div>
                    </div>
                    <div class="del-todo">
                      <span class="material-symbols-outlined del-todo" data-key="${docId[i]}"  onclick="delTodo(this)">
                        delete
                      </span>
                    </div>
                  </div>`
            }
            else {
                finishedTodo.innerHTML += `<div class="todo-outer" style="background-color:rgba(0,0,0,0.050); transform:scale(0.980); box-shadow:none;">
                   <div class="input-box" >
                     <input data-key="${docId[i]}" type="checkbox" onclick="updateTodo(this)" checked>
                     <div  class="todo-name" style="text-decoration:line-through;">
                     ${todos[i].todo_name}
                     </div>
                   </div>
                   <div class="del-todo">
                     <span class="material-symbols-outlined del-todo" data-key="${docId[i]}" onclick="delTodo(this)">
                       delete
                     </span>
                   </div>
                 </div>`
            }
        }
    })
    todoDashboard();
}

window.delDoc = function (ele) {
    let id = ele.getAttribute("data-del");
    let docRef = doc(db, "users", uniqId, 'habit', id);

    getDoc(docRef).then(e => {
        if (e.data().check == false) {
            deleteDoc(docRef);
            check();
            updateChart(0, 1);

        }
        else if (e.data().check == true) {
            deleteDoc(docRef)
            check();
            updateChart(1, 0)
        }
    })
}

window.delTodo = function (ele) {
    let id = ele.getAttribute("data-key");
    let docRef = doc(db, "users", uniqId, 'todo', id);
    document.querySelector(".active-todo").innerHTML = "";
    document.querySelector(".finished-todo").innerHTML = "";

    getDoc(docRef).then(e => {
        if (e.data().check == false) {
            deleteDoc(docRef)
            userDetailsTodos()
            updateChartTodo(0, 1)
        }
        else if (e.data().check == true) {
            deleteDoc(docRef);
            userDetailsTodos();
            updateChartTodo(1, 0);
        }
    })

}


window.updateTodo = function (e) {
    let id = e.getAttribute("data-key");
    let docRef = doc(db, 'users', uniqId, 'todo', id);
    getDoc(docRef).then(e => {
        if (e.data().check === false) {
            updateDoc(docRef, {
                check: true
            }).then(() => {
                userDetailsTodos()
                updateChartTodo(0, 0)
            })
        }
        else if (e.data().check === true) {
            updateDoc(docRef, {
                check: false
            }).then(() => {
                userDetailsTodos()
                updateChartTodo(0, 0)
            })
        }
    })
}

window.updateDetails = function (e) {
    let id = e.id;
    let docRef = doc(db, 'users', uniqId, 'habit', id);
    getDoc(docRef).then(e => {
        if (e.data().check === false) {
            updateDoc(docRef, {
                check: true
            }).then(() => {
                check()
                updateChart(0, 0)

            })
        }
        else if (e.data().check === true) {
            updateDoc(docRef, {
                check: false
            }).then(() => {
                check()
                updateChart(0, 0)
            })
        }
    })
}

window.check = function () {
    let colRef = collection(db, "users", uniqId, "habit")
    getDocs(colRef).then((snapshot) => {
        let checkbox = [];
        let id = []
        snapshot.docs.forEach((doc) => {
            checkbox.push(doc.data());
            id.push(doc.id)
            for (let i = 0; i < checkbox.length; i++) {
                if (checkbox[i].check === true) {
                    document.getElementById(id[i]).checked = true
                }
                else if (checkbox[i].check === false) {
                    document.getElementById(id[i]).checked = false
                }
            }
        })
    })
}

window.addScore = function (id) {
    id = id.id;
    let docRef = doc(db, 'users', uniqId, 'habit', id)
    getDoc(docRef).then((e) => {
        let score = e.data().score
        let streak = e.data().streak
        let date = e.data().date;
        let weekStreak = e.data().week_streak;
        if (e.data().check === true) {
            score.pop();
            streak.pop();
            score.push(0);
            streak.push(0);
            date.pop();
            let poped = weekStreak.pop()
            weekStreak.push(poped - 1)
            updateDoc(docRef, {
                score: score,
                streak: streak,
                date: date,
                week_streak: weekStreak
            })
        }
        else if (e.data().check === false) {
            score.pop();
            streak.pop();
            score.push(10);
            streak.push(1);
            date.push(monthDayYear(0));
            let poped = weekStreak.pop()
            weekStreak.push(poped + 1)
            updateDoc(docRef, {
                score: score,
                streak: streak,
                date: date,
                week_streak: weekStreak
            })
        }
    })
}

window.IndexChange = function () {
    let colRef = collection(db, 'users', uniqId, 'habit');
    getDocs(colRef).then((snapshot) => {
        let books = []
        let id = []
        snapshot.docs.forEach((e) => {
            books.push(e.data())
            id.push(e.id)
        })
        for (let i = 0; i < books.length; i++) {

            if (books[i].yesterday != dbDate().toLocaleDateString()) {
                let str = books[i].last_opened;
                let newStr = new Date(str)
                let tod = dbDate();
                let dif = Math.abs(tod - newStr)
                let newDif = dif / (1000 * 3600 * 24);
                let rounded = Math.ceil(newDif)
                let docRef = doc(db, 'users', uniqId, 'habit', id[i]);

                getDoc(docRef).then((el) => {
                    let score = el.data().score
                    let streak = el.data().streak
                    for (let j = 0; j < rounded; j++) {
                        score.push(0)
                        streak.push(0)
                    }
                    updateDoc(docRef, {
                        score: score,
                        streak: streak,
                        yesterday: dbDate().toLocaleDateString(),
                        check: false,
                        last_opened: `${streakDate()}`
                    })
                })

            }
        }
    })
}

window.weekChange = function () {
    let colRef = collection(db, 'users', uniqId, 'habit');
    let books = []
    let id = [];
    getDocs(colRef).then((snapshot) => {
        snapshot.docs.forEach((e) => {
            books.push(e.data())
            id.push(e.id)
        })
        let oldWeek = []

        for (let i = 0; i < books.length; i++) {
            oldWeek.push(books[i].week_number);

        }

        for (let i = 0; i < books.length; i++) {
            if (week() != books[i].week_number) {
                let newW = week() - books[i].week_number
                let docRef = doc(db, 'users', uniqId, 'habit', id[i]);
                getDoc(docRef).then((el) => {
                    let weekStreak = el.data().week_streak;
                    for (let j = 0; j < newW; j++) {
                        console.log(newW)
                        weekStreak.push(0)
                    }
                    updateDoc(docRef, {
                        week_streak: weekStreak,
                        week_number: week()
                    })
                })
            }
        }

    })
}

let qori;
window.charts = function (ele) {
    let id = ele.getAttribute("data-key")
    let docRef = doc(db, "users", uniqId, "habit", id)
    let dummy = [];
    let sum = null;
    let dumArr;
    let ori = [];
    getDoc(docRef).then((e) => {
        let arr = e.data().score
        document.getElementById("habitname").innerText = e.data().habit_name
        for (let i = 1; i < arr.length + 1; i++) {
            dumArr = arr.slice(0, i);
        }
        for (let j = 0; j < dumArr.length; j++) {
            sum += dumArr[j];
            dummy.push(sum)
        }
        for (let k = 0; k < dummy.length; k++) {
            let total = Math.round((dummy[k] / (k + 1)) * (10))
            ori.push(total)
        }

        let rou = 5 - ori.length
        let dumZero = []
        for (let i = 0; i < rou; i++) {
            dumZero.push(0)

        }

        qori = dumZero.concat(ori)

        const ctx = document.getElementById('line-chart');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [tomorrow(4), tomorrow(3), tomorrow(2), tomorrow(1), tomorrow(0)],
                datasets: [{
                    barThickness: 30,
                    label: 'Score',
                    borderColor: '#05002d',
                    data: dumZero.concat(ori.slice(-5)),
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        max: 120,
                        beginAtZero: true,
                    },
                    x: {
                        grid: {
                            lineWidth: 0
                        }
                    }
                }
            }
        });
    })
}

var a = 0;
var b = 0;
window.previous = function (e) {
    if (e === 0) {
        a = a + 1
        b = b + 1
        let c = -6 - a;
        let d = -5 - b;
        let pre = qori.slice(d);
        chart.data.datasets[0].data = pre;
        chart.data.labels = [tomorrow(a + 4), tomorrow(a + 3), tomorrow(a + 2), tomorrow(a + 1), tomorrow(a + 0)]
        chart.update()
    }
    else if (e === 1) {
        a = a - 1
        b = b - 1
        let c = -5 - a;
        let d = -1 - b;
        let forw = qori.slice(c);
        chart.data.datasets[0].data = forw;
        chart.data.labels = [tomorrow(a + 4), tomorrow(a + 3), tomorrow(a + 2), tomorrow(a + 1), tomorrow(a + 0)]
        chart.update()
    }
}
let wori = [];
window.streak = function (ele) {
    let id = ele.getAttribute("data-key")
    let docRef = doc(db, "users", uniqId, "habit", id)
    getDoc(docRef).then((e) => {
        let arr = e.data().week_streak;

        // for (let i = 0; i < arr.length; i++) {
        //     wori.push(arr[i])
        // }

        let rou = 5 - arr.length
        let dumZero = []
        for (let i = 0; i < rou; i++) {
            dumZero.push(0)
        }
        wori=dumZero.concat(arr)
        const ctx1 = document.getElementById('bar-chart');
        barchart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: [
                    "week " + getWeek(4), "week " + getWeek(3), "week " + getWeek(2), "week " + getWeek(1), "week " + getWeek(0)
                ],
                datasets: [{
                    barThickness: 20,
                    label: 'weekly streaks',
                    backgroundColor: '#3e3e3e',
                    borderRadius: 8,
                    borderSkipped: false,
                    data: dumZero.concat(arr.slice(-5)),
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    },
                    x: {
                        grid: {
                            lineWidth: 0
                        }
                    }
                }
            }
        });
    })
}

var e = 0;
var f = 0;
window.preStreak = function (ele) {
    if (ele === 0) {
        e = e + 1
        f = f + 1
        let c = -6 - e;
        let d = -5 - f;
        let pre = wori.slice(d);
        barchart.data.datasets[0].data = pre;
        barchart.data.labels = ["week " + getWeek(e + 4), "week " + getWeek(e + 3), "week " + getWeek(e + 2), "week " + getWeek(e + 1), "week " + getWeek(e + 0)]
        barchart.update()
    }
    else if (ele === 1) {
        e = e - 1
        f = f - 1
        let c = -5 - e;
        let d = -1 - f;
        let forw = wori.slice(c);
        barchart.data.datasets[0].data = forw;
        barchart.data.labels = ["week " + getWeek(e + 4), "week " + getWeek(e + 3), "week " + getWeek(e + 2), "week " + getWeek(e + 1), "week " + getWeek(e + 0)]
        barchart.update()
    }
}

window.rank = function (ele) {
    let id = ele.getAttribute("data-key")
    let docRef = doc(db, "users", uniqId, "habit", id)
    getDoc(docRef).then((e) => {
        let arr = e.data().streak;
        let streaks = arr.reduce(function (res, n) {
            if (n) res[res.length - 1]++;
            else res.push(0);
            return res;
        }, [0]);
        let sorted = streaks.sort(function (a, b) { return b - a });
        const ctx2 = document.getElementById('hori-bar');
        horibar = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: [
                    'Rank1',
                    'Rank2',
                    'Rank3',
                    'Rank4',
                ],
                datasets: [{
                    barThickness: 20,
                    label: 'Best streaks',
                    backgroundColor: '#3e3e3e',
                    borderRadius: 8,
                    borderSkipped: false,
                    data: sorted,
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        lineWidth: 0
                    }
                }
            }
        })
    })
}

window.showScore = function (ele) {
    let id = ele.getAttribute("data-key");
    let docRef = doc(db, "users", uniqId, "habit", id);
    let dummy = [];
    let sum = null;
    let dumArr;
    let ori = [];
    getDoc(docRef).then((e) => {
        let arr = e.data().score;
        document.getElementById("habitname").innerText = e.data().habit_name;
        for (let i = 1; i < arr.length + 1; i++) {
            dumArr = arr.slice(0, i);
        }
        for (let j = 0; j < dumArr.length; j++) {
            sum += dumArr[j];
            dummy.push(sum)
        }
        for (let k = 0; k < dummy.length; k++) {
            let total = Math.round((dummy[k] / (k + 1)) * (10))
            ori.push(total)
        }
        let el = ele.parentElement.nextElementSibling.firstChild.nextElementSibling.nextElementSibling;
        el.innerText = "score: " + ori.slice(-1)
    })
}

window.showStreak = function (ele) {
    let id = ele.getAttribute("data-key");
    let docRef = doc(db, "users", uniqId, "habit", id);
    getDoc(docRef).then((e) => {
        let arr = e.data().streak;
        let streaks = arr.reduce(function (res, n) {
            if (n) res[res.length - 1]++;
            else res.push(0);
            return res;
        }, [0]);
        let el = ele.parentElement.nextElementSibling.firstChild.nextElementSibling;
        el.nextElementSibling.nextElementSibling.innerText = "streak: " + streaks.slice(-1)
    })
}

window.getCalendar = function (ele) {
    let id = ele.getAttribute("data-key");
    let docRef = doc(db, "users", uniqId, "habit", id)
    getDoc(docRef).then((e) => {
        let arr = e.data().date;
        $('#calendar').evoCalendar({
            'sidebarDisplayDefault': false,
            'eventDisplayDefault': false,
            'eventListToggler': false,
            theme: '',
            calendarEvents: [
            ]
        })
        for (let i = 0; i < arr.length; i++) {
            const newArray = {
                id: `event${i}`,
                name: 'checked',
                date: arr[i],
                type: 'holiday',
                everyYear: 'false',
                color: '#8773c1',
                everyYear: false
            }
            $('#calendar').evoCalendar('addCalendarEvent', [newArray]);
        }
    })
}


let active = [];
let finish = [];
window.dashboard = function () {
    let docRef = collection(db, 'users', uniqId, "habit")

    onSnapshot(docRef, (snapshot) => {
        let habits = [];
        active = []
        finish = []

        snapshot.docs.forEach((doc) => {
            habits.push(doc.data())
        })
        for (let i = 0; i < habits.length; i++) {
            if (habits[i].check === false) {
                active.push(habits[i])
            }
            else {
                finish.push(habits[i])
            }
        }

        let pie = document.getElementById("pie-chart");

        pieChart = new Chart(pie, {
            type: 'pie',
            data: {
                labels: [
                    "completed",
                    "Incomplete"
                ],
                datasets: [{

                    backgroundColor: ["#ff6384", "#ffcd56"],
                    data: [finish.length, active.length],
                    borderWidth: 2,
                }]
            },
            options: {
                scales: {
                }
            }
        })
    })
}

window.updateChart = function (e, f) {
    pieChart.data.datasets[0].data = [finish.length - e, active.length - f]
    pieChart.update();
}

let activeTodo = []
let finishTodo = []

window.todoDashboard = function () {
    let docRef = collection(db, 'users', uniqId, "todo")

    onSnapshot(docRef, (snapshot) => {
        let todos = [];

        activeTodo = []
        finishTodo = []

        snapshot.docs.forEach((doc) => {
            todos.push(doc.data())
        })
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].check === false) {
                activeTodo.push(todos[i])
            }
            else {
                finishTodo.push(todos[i])
            }
        }

        let pieTodo = document.getElementById("pie-chart-todo");
        piechart = new Chart(pieTodo, {
            type: 'pie',
            data: {
                labels: [
                    "completed",
                    "Incomplete"
                ],
                datasets: [{
                    backgroundColor: ["#ff6384", "#ffcd56"],
                    data: [finishTodo.length, activeTodo.length],
                    borderWidth: 2,
                }]
            },
        })

    })
}

window.updateChartTodo = function (e, f) {
    piechart.data.datasets[0].data = [finishTodo.length - e, activeTodo.length - f]
    piechart.update();
}

window.logOut = function () {
    document.querySelector(".outer-layer-for-habit").style.display = "none";
    document.querySelector(".outer-layer-for-signup").style.display = "flex";
}