# NFCard server REST API

#### Usage 
```
$ npm i
$ npm i -g nodemon
$ npm run dev // development
$ npm run start // production
```

## COMPANY API

#### Register 

```
url: \api\company\register

Method : POST

BODY : {
  email : string // EMAIL FORMAT, UNIQUE,
  name : string,
  password : string,
  image : file
}
```

output : `{_id, email, name, password, logo}`

#### Login

```
url : \api\company\login

Method : POST

BODY : {
  email : string,
  password : string
}
```
output : `{token, company}`

---

## EMPLOYEE API

#### GET

+ by company id

```
Need employee authentication
url : \api\employees\byCompany\:companyId

HEADERS : {
  token employee
}
```
output : `[{ _id, email, name, image, phone, address, position }]`

+ by logged in

```
Need employee authentication
url : \api\employees\byLoggedin

HEADERS : {
  token employee
}
```
output : `{_id, email, name, image, phone, address, position}`
+ get contacts (from logged in employee)

```
Need employee authentication
url : \api\employees\contacts

HEADERS : {
  token employee
}
```

output : `[{_id}]`

#### POST

+ upload bulk (with excel `.xslx`)

```
Need company authentication
url : \api\employees\

method : POST

HEADERS : {
  token company
}
```
output : `[{_id, name, email, password, phone, address, position}]`

+ upload image (employee)

```
Need employee authentication
url : \api\employees\uploadImage\

method : POST

HEADERS : {
  token employee
}
```
output : `{ astagadul }`

#### Delete

+ delete one employee
```
Need company authentication
url: \api\employees\:employeeId

method : DELETE

HEADERS : {
  token employee
}
```
+ delete contacts
```
Need employee authentication
url: \api\employees\contacts\:employeeId

method : DELETE

HEADERS : {
  token employee
}
```
