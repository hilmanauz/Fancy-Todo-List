const baseUrl= 'https://amazing-todo-web-app.herokuapp.com'
$("document").ready(() =>{
    function success(position) {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        localStorage.setItem("lat", latitude);
        localStorage.setItem("lon", longitude);
      }
    
      function error() {
        alert('Unable to retrieve your location');;
      }
    
      if(!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
      } else {
        navigator.geolocation.getCurrentPosition(success, error);
      }
    checkLocalStorage();
    weather();

    $("#submit-login").on("click", (e) => {
        e.preventDefault();
        login();
    })

    $("#submit-regist").on("click", (e) => {
        e.preventDefault();
        register();
    })

    $("#goto-add-todo").on("click", (e) => {
        e.preventDefault();
        $(".login-box, #todo-list").hide();
        $("#add-todo").show();
        $("#weather-column").hide();
    })

    $("#submit-todo").on("click", (e) =>{
        e.preventDefault();
        addTodo();
    })

    $("#back-home-edit").on("click", (e) =>{
        e.preventDefault();
        checkLocalStorage();
    })

    $("#back-home-add").on("click", (e) =>{
        e.preventDefault();
        checkLocalStorage();
    })
    
    $("#logout").on("click", (e) =>{
        e.preventDefault();
        logout();
    })

    $("#submit-todo-edit").on("click", (e) =>{
        e.preventDefault();
        editTodo();
    })
})

function checkLocalStorage(){
    if(localStorage.access_token){
        $(".login-box, #add-todo, #edit-todo").hide();
        $("#todo-list").show();
        $('.todo-list').removeClass('only-complete');
        $('.todo-list').addClass('only-active');
        $('.todo-nav a.all').removeClass('active');
        $('.todo-nav a.completed').removeClass('active');
        $('.todo-nav a.actived').addClass('active');
        $("#weather-column").show();
        toDoListUser();
    } else {
        $("#todo-list, #add-todo, #edit-todo").hide();
        $(".login-box").show();
    }
}

function login(){
    const email = $("#email-login").val();
    const password = $("#password-login").val();
    $.ajax({
        url: baseUrl+"/login",
        method: "POST",
        data: {
            email,
            password
        }
    })
        .done((response) => {
            localStorage.setItem("access_token", response.accessToken);
            Swal.fire('Succes', 'Success login','success');
            checkLocalStorage();
            weather();
        })
        .fail(err => {
            if(!email || !password){
                Swal.fire('Error', 'email or password is required','error')
            }else if (err) {
                let data = err.responseText;
                let error = JSON.parse(data)
                let message = error.message;
                Swal.fire('Error', `${message}`,'error')
            }
        })
        .always(() => {
            $("#email-login, #password-login").val("");
        })
}

function logout(){
    localStorage.removeItem("access_token");
    $("#weather").empty();
    var auth2 = gapi.auth2.getAuthInstance()
    Swal.fire('Success', 'Success logout','success')
    auth2.signOut().then(function() {
        console.log('User signed out.');
    })
    checkLocalStorage();
}

function register(){
    const email = $("#email-regist").val();
    const password = $("#password-regist").val();
    $.ajax({
        url: baseUrl+"/register",
        method: "POST",
        data: {
            email,
            password
        }
    })
        .done(() => {
            Swal.fire('Success', 'Success sign up','success')
            $(".sign-in").prop('checked',true);
            $(".sign-up").prop('checked',false);
        })
        .fail(err => {
            if(!email || !password){
                Swal.fire('Error', 'email or password is required','error')
            }else if (err){
                let data = err.responseText;
                let error = JSON.parse(data);
                let message = error.message.join(" and ");
                Swal.fire('Error', `${message}`,'error')
            }
        })
        .always(() => {
            $("#email-regist, #password-regist").val("");
        })
}

function toDoListUser(){
    $(".todo-list").empty();
    $.ajax({
        url: baseUrl+`/todos`,
        method: "GET",
        headers: {
            access_token: localStorage.access_token
        }
    })
        .done(response => {
            response.forEach(e => {
                $(".todo-list").append(
                `
                <div class="todo-item ${e.status === "finished" ? "complete" : ""}">
                    <div class="checker"><input type="checkbox" onclick="updateStatus(${e.id},event);" ${e.status === "finished" ? "checked" : ""}></span></div>
                    <a href=""><span onclick="viewTodo(${e.id},event);">${e.title}</span></a>
                    <a href="" onclick = "deleteTodo(${e.id},event);" class="remove-todo-item float-md-end" id="delete"><i class="bi bi-trash" style="font-size:x-large"></i></a>
                    <a href="" id="edit" onclick = "valueTodo(${e.id},event);" class="remove-todo-item float-md-end"><i class="bi bi-pencil-square" style="font-size:x-large"></i></a>
                </div>
                `)
            });
        })
        .fail(err => {
            console.log(err);
        })
}

function addTodo(){
    const title = $("#todo-input").val();
    const due_date = $("#date-input").val();
    const description = $("#description-input").val();
    $.ajax({
        url:baseUrl+"/todos",
        method: "POST",
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            title,
            due_date,
            description,
        }
    })
        .done(()=> {
            checkLocalStorage();
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your Todo has been saved',
                showConfirmButton: false,
                timer: 1500
              })
        })
        .fail((err)=>{
            let data = err.responseText;
            let error = JSON.parse(data);
            let message = error.message[0];
            Swal.fire('Error', `${message}`,'error');
            checkLocalStorage();
        })
        .always(()=>{
            $("#todo-input, #date-input, #description-input").val("");
        })
}

function valueTodo(id, e){
    e.preventDefault();
    $("#weather-column").hide();
    $("#login-box, #add-todo, #edit-todo, #todo-list").hide();
    $("#edit-todo").show();
    $.ajax({
        url: baseUrl+`/todos/${id}`,
        headers: {
            access_token: localStorage.access_token
        },
        method: "GET"
    })
        .done((todos) => {
            $("#todo-edit").val(todos.title);
            $("#date-edit").val(todos.due_date);
            $("#description-edit").val(todos.description);
            localStorage.setItem("idTodo",id);
        })
        .fail((err) => {
            console.log(err);
        })
}

function editTodo(){
    const title =  $("#todo-edit").val();
    const due_date = $("#date-edit").val();
    const description = $("#description-edit").val();
    $.ajax({
        url: baseUrl+`/todos/${localStorage.idTodo}`,
        method: "PUT",
        headers: {
            access_token: localStorage.access_token
        },
        data: {
            title,
            due_date,
            description,
        }
    })
        .done(() => {
            checkLocalStorage();
        })
        .fail((err) => {
            console.log(err)
        })
}

function updateStatus(id, e){
    e.preventDefault();
    $.ajax({
        url: baseUrl+`/todos/${id}`,
        headers: {
            access_token: localStorage.access_token
        },
        method: "GET"
    })
        .done((todos) => {
           if (todos.status === "finished"){
                $.ajax({
                    url: baseUrl+`/todos/${id}`,
                    method: "PATCH",
                    data: {
                        status: 'unfinished'
                    },
                    headers: {
                        access_token: localStorage.access_token
                    }
                })
                    .done((data) => {
                        const message = data.todo[0].title;
                        Swal.fire('Success', `${message} become unfinished`,'success');
                        checkLocalStorage();
                    })
                    .fail((err) => {
                        console.log(err);
                    })  
           } else {
            $.ajax({
                url: baseUrl+`/todos/${id}`,
                method: "PATCH",
                data: {
                    status: 'finished'
                },
                headers: {
                    access_token: localStorage.access_token
                }
            })
                .done((data) => {
                    const message = data.todo[0].title;
                    Swal.fire('Success', `${message} has finished`,'success');
                    checkLocalStorage();
                })
                .fail((err) => {
                    console.log(err);
                })  
           }
        })
        .fail((err) => {
            console.log(err);
        })
}

function deleteTodo(id, e){
    e.preventDefault();
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Deleted!',
                text: "Your file has been deleted.",
                icon: 'success',
                confirmButtonText: 'Ok'
            })
            if (result.isConfirmed){
              $.ajax({
                    url: baseUrl + `/todos/${id}`,
                    method: 'DELETE',
                    headers: {
                        access_token: localStorage.access_token
                    }
                })
                    .done(() => {
                        checkLocalStorage();
                    })
                    .fail((err) => {
                        console.log(err);
                    })
            }
        }
      })
}

function weather(){
            $.ajax({
            url: baseUrl + "/weather",
            method: "POST",
            data: {
                lat:localStorage.lat,
                lon:localStorage.lon
            },
            headers: {
                access_token: localStorage.access_token
            }
        })
            .done((weather) => {
                const time = weather.location.localtime.split(" ")[1];
                const fullDate = weather.location.localtime.split(" ")[0];
                const name = weather.location.name;
                const region =weather.location.region;
                const temp = weather.current.temperature;
                const weather_desc = weather.current.weather_descriptions[0];
                const matahari = weather.current.feelslike;
                const humid = weather.current.humidity;
                const wind = weather.current.wind_speed;
                const img = weather.current.weather_icons[0];
                let d = new Date(weather.location.localtime);
                let weekday = new Array(7);
                weekday[0] = "Sunday";
                weekday[1] = "Monday";
                weekday[2] = "Tuesday";
                weekday[3] = "Wednesday";
                weekday[4] = "Thursday";
                weekday[5] = "Friday";
                weekday[6] = "Saturday";

                let n = weekday[d.getDay()];
                $("#weather").append(`
                    <div class="d-flex">
                        <h6 class="flex-grow-1">${name}, ${region}</h6>
                        <h6>${time}</h6>
                    </div>
                    <div class="d-flex flex-column temp mt-5 mb-3">
                        <span class="small grey">${fullDate}</span>
                        <h1 class="mb-0 font-weight-bold" id="heading"> ${temp}° C </h1> <span class="small grey">${weather_desc}</span>
                    </div>
                    <div class="d-flex">
                        <div class="temp-details flex-grow-1">
                            <p class="my-1"> <img src="./css/matahari.png" height="17px"> <span> ${matahari} km/h </span> </p>
                            <p class="my-1"> <i class="fa fa-tint mr-2" aria-hidden="true"></i> <span> ${humid} </span> </p>
                            <p class="my-1"> <img src="./css/angin.png" height="17px"> <span> ${wind}h </span> </p>
                        </div>
                        <div> <img src=${img} width="100px"> </div>
                    </div>
                `)
            })
}

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    $.ajax({
        method: "POST",
        url: baseUrl+ "/googleLogin",
        data: {
            access_token: id_token
        }
    })
    .done((response) => {
        Swal.fire('Success', 'Success login','success')
        localStorage.setItem("access_token", response.access_token);
        checkLocalStorage();
        weather();
    })
    .fail((err) => {
        console.log(err);
    })
}

function viewTodo(id,e){
    e.preventDefault();
    $.ajax({
        method: "GET",
        url: baseUrl + `/todos/${id}`,
        headers: {
            access_token: localStorage.access_token
        }
    })
        .done(todo => {
            Swal.fire({
                title: `${todo.title}`,
                text: `${todo.description}`,
                icon: 'info',
                confirmButtonText: 'Ok',
                footer: `EXPIRED DATE: ${todo.due_date}`
              })
        })
        .fail((err) => {
            console.log(err);
        })
}
