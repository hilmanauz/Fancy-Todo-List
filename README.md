# fancy-todo
membuat sebuah website for managing fancy things todo
Website: https://amazing-todo-app-ae368.web.app/

List of available endpoints:
​
- `POST /register`
- `POST /login`
- `POST /googleLogin`
- `POST /weather`
- `GET /todos/`
- `POST /todos/`
- `GET /todos/:id`
- `PUT /todos/:id`
- `PATCH /todos/:id`
- `DELETE /todos/:id`


&nbsp;

Tech Stack used to build this app :
* Node JS
* Express JS framework
* PostgreSQL
* Bcryptjs
* Cors
* Axios
* Google-auth-library
* Jsonwebtoken
* Sequelize


&nbsp;

## Global Responses
> These responses are applied globally on all endpoints

_Response (500 - Internal server error)_
```
{
  "message": "failed reach server to create data"
}
```

_Response (400 - Bad request)_
```
{
  "message": "[email has an @, Password must be 6 - 12 characters]" (validation)
}
```

_Response (401 - Unauthorized)_
```
{
  "message": "invalid username or password"
}
```

_Response (404 - Unauthorized)_
```
{
  "message": "Request object not Found"
}
```

&nbsp;

## RESTful endpoints
### POST /register

> Register user

_Request Body_
```
{
    'email': 'string',
    'password': 'string'
}
```
_Response (201 - Created)_
```
 {
    'msg': 'Succes create user',
    'id': 'integer',
    'user': {
        email,
        password
    }
 }
```


### POST /login

> Login user

_Request Body_
```
{
    'email': 'string',
    'password': 'string'
}
```

_Response (200)_
```
 {
    'message' : 'success login',
    'access_token': 'string',
    'id': 'integer', 
    'email': 'string'
 }
```


---
### POST /googleLogin

_Request Body_
```
{
    'email': 'string'
}
```

_Response (201 - Created)_
```
 {
    'id': 'integer',
    'email': 'string',
    'message' : 'success login',
    'access_token': 'string'
 }
```

---
### GET /weather
> Get weather data

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    lat: 'integer',
    lon: 'integer'
}
```

_Response (200)_
```
 {
     "location": {
        "name": "Blian",
        "country": "Indonesia",
        "region": "Riau Islands",
        "lat": "1.129",
        "lon": "104.067",
        "timezone_id": "Asia/Jakarta",
        "localtime": "2021-03-07 09:20",
        "localtime_epoch": 1615108800,
        "utc_offset": "7.0"
    },
    "current": {
        "observation_time": "02:20 AM",
        "temperature": 29,
        "weather_code": 116,
        "weather_icons": [
            "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
        ],
        "weather_descriptions": [
            "Partly cloudy"
        ],
        "wind_speed": 11,
        "wind_degree": 10,
        "wind_dir": "N",
        "pressure": 1015,
        "precip": 3,
        "humidity": 75,
        "cloudcover": 50,
        "feelslike": 35,
        "uv_index": 1,
        "visibility": 10,
        "is_day": "yes"
    }
 }
```

---
### GET /todos/

> Get all todos data in spesific user

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
    'id': 'integer',
    'title': 'string',
    'description':'string',
    'status':'string',
    'due_date':'string',
    'UserId':'integer'
} ...
```


---
### POST /todos/

> Create todos

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'title': 'string',
    'description':'string',
    'status':'string',
    'due_date':'string',
    'UserId':'integer'
}
```

_Response (200)_
```
 {
    'message': 'user created',
    'todo': {
        'id': 'integer',
        'title': 'string',
        'description':'string',
        'status':'string',
        'due_date':'string',
        'UserId':'integer'
    }
 }
```

---
### GET /todos/:id

> GET todos data from spesific user

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'id': 'integer'
}
```

_Response (200)_
```
 {
    'todo': {
        'id': 'integer',
        'title': 'string',
        'description':'string',
        'status':'string',
        'due_date':'string',
        'UserId':'integer'
    }
 }
 ```

 ---
### PUT /todos/:id

> Edit todos data from spesific user

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'id': 'integer',
    'title': 'string',
    'description': 'string',
    'due_date': 'string'
}
```

_Response (200)_
```
 {
    'message': 'updated',
    'todo': {
        'id': 'integer',
        'title': 'string',
        'description':'string',
        'status':'string',
        'due_date':'string',
        'UserId':'integer'
    }
 }
 ```

 ---
### PATCH /todos/:id

> Update variable status in todos data from spesific user

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'id': 'integer',
    'status': 'string'
}
```

_Response (200)_
```
 {
    'message': 'updated'
    'todo': {
        'id': 'integer',
        'title': 'string',
        'description':'string',
        'status':'string',
        'due_date':'string',
        'UserId':'integer'
    }
 }
 ```

 ---
### DELETE /todos/:id

> DELETE todos data from spesific user

_Request Header_
```
{
  'access_token': 'access_token'
}
```

_Request Body_
```
{
    'id': 'integer'
}
```

_Response (200)_
```
 {
    'message': 'Todo success to delete'
 }
 ```