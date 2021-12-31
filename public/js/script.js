function submitData (){
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let phone = document.getElementById("phone").value
    let company = document.getElementById("company").value
    let subject = document.getElementById("subject").value
    let message = document.getElementById("message").value

    if (name == '' || email == '' || phone == ''|| company == ''|| subject == ''|| message == ''){
       return alert ('Field will not empty')
    }

    let emailPerson = "sebagaimana@gmail.com"
    let a = document.createElement('a')
    a.href = `mailto:${emailPerson}?subject=${subject}&body=Hello my name is ${name} from ${company}. ${message} . If you interest you can reply this message o call me by phone in ${phone}. `
    a.click()

}



let movies =[]

function addMovie(event){
    event.preventDefault()
    
    let title = document.getElementById("title").value
    let genre = document.getElementById("genre").value
    let writer = document.getElementById("writer").value
    let author = document.getElementById("author").value
    let description = document.getElementById("description").value
    let poster = document.getElementById("poster").files

    if (title == '' || genre == '' || writer == ''|| author == ''|| description == ''|| poster == ''){
        return alert ('Field will not empty')
    }
    poster = URL.createObjectURL(poster[0])
    let movie = {
        title : title,
        genre : genre,
        writer : writer,
        author : author,
        postAt: new Date(),
        description : description,
        poster : poster
    }

    
    movies.push(movie)

    inputData()
}

function inputData(){
    let content = document.getElementById("cardname")

    content.innerHTML ='';

    for(let i= 0; i < movies.length; i++){
        content.innerHTML += `
        <div class="card-body">
                    <div class="division1">
                        <img src="${movies[i].poster}" alt="">
                        <div class="division2">
                            <h1 class="card-title">${movies[i].title}</h1>
                            <h4 class="genre">${movies[i].genre}</h4>
                            <h6 class="card-title" style="font-size: smaller;">${getTime(movies[i].postAt)} || ${movies[i].author}</h6>
                            <div class="card-text">
                                <p >${movies[i].description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="button2">
                      <button class="btn btn-warning"><a href="#" >Post</a></button>
                      <button class="btn btn-warning"><a href="#" >Edit</a></button>
                    </div>
                    <div class="duration">
                        <p>${getDistanceTime(movies[i].postAt)}</p>
                    </div>
                </div>`
    }

}
let month = [
    "January",
    "Pebruary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "Dcember",
]

function getTime(time){
    let year = time.getFullYear()
    let monthIndex = time.getMonth()
    let date = time.getDate()
    let hours = time.getHours()
    let minutes = time.getMinutes()

    let result = `${date} ${month[monthIndex]} ${year} || ${hours} : ${minutes} WIB`
    return result
}

function getDistanceTime(time){
    let timePost = time
    let timeNow = new Date();

    let distance = timeNow - timePost

    let miliseconds = 1000;
    let secondsInMinutes = 60;
    let minuteInHours = 60;
    let hoursInDay = 23;

    let distanceDay = Math.floor(distance/(miliseconds * secondsInMinutes * minuteInHours * hoursInDay))
    
    if(distanceDay >= 1){
        return(`${distanceDay} day ago`)
    }else {
        let distanceHours = Math.floor(distance/(miliseconds * secondsInMinutes * minuteInHours))
        if(distanceHours >= 1){
            return(`${distanceHours} hour ago`)
        }else {
            let distanceMinutes = Math.floor(distance/(miliseconds * secondsInMinutes))
            if(distanceMinutes >= 1){
            return(`${distanceMinutes} minutes ago`)
            }else {
                let distanceSecond = Math.floor(distance/miliseconds)
                return(`${distanceSecond} second ago`)

            }
        }
    }
}
// setInterval(()=>{
//     inputData()
// },1000)