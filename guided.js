let charts={}
let calorieGoal=localStorage.getItem("calorieGoal")||0

function showSection(id){

document.querySelectorAll(".section").forEach(sec=>{
sec.style.display="none"
})

document.getElementById(id).style.display="block"

loadAll()

}

function loadAll(){

loadSleep()
loadWater()
loadCalorie()

}

function toggleRecords(listId,button){

let list=document.getElementById(listId)

if(list.style.display==="none"){

list.style.display="block"
button.innerText="Hide Records"

}else{

list.style.display="none"
button.innerText="View Records"

}

}

/* SLEEP */

async function saveSleep(){

let date=sleepDate.value
let hours=parseFloat(sleepHours.value)

if(!date||!hours) return alert("Fill fields")

await supabaseClient
.from("sleep_tracker")
.insert([{date:date,hours:hours}])

updateProgress(hours,8,"sleepBar")

loadSleep()

}

async function loadSleep(){

const {data}=await supabaseClient
.from("sleep_tracker")
.select("*")
.order("date")

let list=document.getElementById("sleepList")
list.innerHTML=""

let labels=[],values=[]

data.forEach(row=>{

list.innerHTML+=`<li>${row.date} : ${row.hours} hrs 
<button onclick="deleteSleep('${row.id}')">Delete</button></li>`

labels.push(row.date)
values.push(row.hours)

})

drawChart("sleepChart",labels.slice(-7),values.slice(-7),"Sleep")

}

async function deleteSleep(id){

await supabaseClient
.from("sleep_tracker")
.delete()
.eq("id",id)

loadSleep()

}

/* WATER */

async function saveWater(){

let date=waterDate.value
let litres=parseFloat(waterAmount.value)

if(!date||!litres) return alert("Fill fields")

await supabaseClient
.from("water_tracker")
.insert([{date:date,litres:litres}])

updateProgress(litres,3,"waterBar")

loadWater()

}

async function loadWater(){

const {data}=await supabaseClient
.from("water_tracker")
.select("*")
.order("date")

let list=document.getElementById("waterList")
list.innerHTML=""

let labels=[],values=[]

data.forEach(row=>{

list.innerHTML+=`<li>${row.date} : ${row.litres} L 
<button onclick="deleteWater('${row.id}')">Delete</button></li>`

labels.push(row.date)
values.push(row.litres)

})

drawChart("waterChart",labels.slice(-7),values.slice(-7),"Water")

}

async function deleteWater(id){

await supabaseClient
.from("water_tracker")
.delete()
.eq("id",id)

loadWater()

}

/* CALORIE GOAL */

function calculateGoal(){

let weightVal=parseFloat(weight.value)
let heightVal=parseFloat(height.value)
let ageVal=parseFloat(age.value)
let activityVal=parseFloat(activity.value)

if(!weightVal||!heightVal||!ageVal)
return alert("Fill all details")

let bmr=(10*weightVal)+(6.25*heightVal)-(5*ageVal)+5

calorieGoal=Math.round(bmr*activityVal)

localStorage.setItem("calorieGoal",calorieGoal)

goalDisplay.innerHTML=
"Recommended Daily Calories: "+calorieGoal+" kcal"

}

async function saveDailyCalories(){

let date=calorieDate.value
let daily=parseFloat(dailyCalories.value)

if(!date||!daily||!calorieGoal)
return alert("Calculate goal first")

await supabaseClient
.from("calorie_tracker")
.insert([{date:date,calories:daily}])

updateCalorieProgress(daily,calorieGoal)

loadCalorie()

}

function updateCalorieProgress(value,goal){

let percent=Math.min((value/goal)*100,100)

calorieBar.style.width=percent+"%"

let status=value>goal?"Above ⚠":value<goal?"Below 🔻":"Perfect ✅"

goalDisplay.innerHTML=
`Goal: ${goal} kcal | Today: ${value} kcal | ${status}`

}

async function loadCalorie(){

const {data}=await supabaseClient
.from("calorie_tracker")
.select("*")
.order("date")

let list=document.getElementById("calorieList")
list.innerHTML=""

let labels=[],values=[]

data.forEach(row=>{

list.innerHTML+=`<li>${row.date} : ${row.calories} kcal 
<button onclick="deleteCalorie('${row.id}')">Delete</button></li>`

labels.push(row.date)
values.push(row.calories)

})

drawChart("calorieChart",labels.slice(-7),values.slice(-7),"Calories")

}

async function deleteCalorie(id){

await supabaseClient
.from("calorie_tracker")
.delete()
.eq("id",id)

loadCalorie()

}

function drawChart(id,labels,data,label){

if(charts[id]) charts[id].destroy()

charts[id]=new Chart(
document.getElementById(id),
{
type:"line",
data:{
labels:labels,
datasets:[{
label:label+" (Last 7 Days)",
data:data,
borderWidth:2,
tension:0.4,
fill:false
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
scales:{y:{beginAtZero:true}}
}
})

}

function updateProgress(value,goal,id){

let percent=Math.min((value/goal)*100,100)

document.getElementById(id).style.width=percent+"%"

}

window.onload=loadAll