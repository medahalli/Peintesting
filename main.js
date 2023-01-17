const express = require('express')
const {openDb} = require("./db")




const session = require('express-session')
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

//const SQLiteStore = require('connect-sqlite3')(session);
const port = 3000
const sess = {
 // store: new SQLiteStore,
  secret: 'secret key',
  resave: true,
  rolling: true,
  cookie: {
    maxAge: 1000 * 3600//ms
  },
  saveUninitialized: true
}


if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess))
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', './views');
app.set('view engine', 'jade');


app.use(express.static('img')); //This will allow express to access any file in that folder
app.get('/',(req, res) => {
  res.redirect(302,'/accueil');
})
app.use(express.static(__dirname + '/css'));

app.get('/signup', function (req, res) { 
  res.render('sign-up');
})
app.post('/signup', async (req, res) => {

  const db = await openDb()
  const email=req.body.email
  const username = req.body.username
  const password = req.body.pass
  const confirmpassword = req.body.cpass

  let erreur=0;
  let data={

  }
  if(username.length<=4){
    erreur=1;
    data = {
      errors: "The nickname must contain more than 4 characters"
    }
  }else if(password.length<=6){
    erreur=1;
    data = {
      errors: "the password must have at least 6 characters"
    }
  }else if(!(email.endsWith('@gmail.com')||email.endsWith('@outlook.com')||email.endsWith('@bordeaux-inp.fr')||email.endsWith('@enseirb-matmeca.fr')||email.endsWith('@hotmail.com'))){
    erreur=1;
    data = {
      errors: "invalid Email"
    }
  }else if(password!=confirmpassword){
    erreur=1;
    data ={
      errors:"Those passwords didn’t match. Try again."
    }
  }else{
    erreur=0;
  }
  if(erreur==1){
    res.render('sign-up',data)
  }else{
  const post = await db.run(`
    INSERT INTO comptes(email,username,password)
    VALUES(?, ?,?)
  `,[email,username, password])
  
    res.redirect(302,'/login')
  }
})

app.get('/login',(req, res) => {
  res.render('log-in');
})
const authentification = {
  email: "email",
  password: "password",
  username:"username"
}
app.post('/login',async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  authentification.email=email;
  authentification.password=password;
  const db = await openDb()
  const comptes = await db.all(`
    SELECT * FROM comptes
  `)
  let data = {
  }
  var i;
  for (i = 0; i < comptes.length; i++) {
    if(
      email == comptes[i].email &&
      password == comptes[i].password
    ){
      authentification.username=comptes[i].username;
      req.session.logged = true
      break;
    } else {
      req.session.logged = false
        data = {
          errors: "the login is incorrect",
          logged: false
        }
      }
      
  } 
  if (req.session.logged==true){
    res.redirect(302,'/accueil');
  }else{
    res.render('log-in',data)
  }
})
app.get('/accueil',async(req,res)=>{
  if(!req.session.logged==true){
    res.redirect(302,'/login');
    return
  }else{
  const  db = await openDb();
  const liens = await db.all(`
    SELECT * FROM liens
  `)
  res.render("index",{liens: liens})
  }
})

app.post('/accueil',async(req,res)=>{
  if(req.session.logged==true){
    let date_ob = new Date();
  const date_day = date_ob.getDate();
  const date_year = date_ob.getFullYear();
  const date_month = date_ob.getMonth();
  const date_Hours = date_ob.getHours();
  const date_min = date_ob.getMinutes();
  const db = await openDb()
  const title = req.body.title
  const content = req.body.content
  const post = await db.run(`
    INSERT INTO liens(title,content,upvote,downvote,commentaire,id,year,month,day,hours,min)
    VALUES(?, ?, ?,?,?,?,?,?,?,?,?)
  `,[title, content, 0,0,0,authentification.username,date_year,date_month+1,date_day,date_Hours,date_min])
    res.redirect("/profile")
   }else{
    res.redirect(302,'/login');
  }
})



let html;
fs.readFile('about.html', 'utf8', (err, data) => {
  if (err) throw err;
  html = data;
});




const data = ["Great site"];
/*app.get('/about',(req, res) => {
  //let htmlForm = '<h1>Laisser moi votre avis sur le site</h1> <form action = "/" method = "post">'+'<label for="nom">Nom';
  //let pathname=path.join(__dirname,'./about.html');
  let htmlForm =
  '<h1>share with us your opinion</h1><form action="/" method="post"><label' +
  ' for="nom">Nom</label><br><textarea name="nom" id="" cols="30" rows="3">' +
  '</textarea><br><br><button type="submit">Enregistrer</button></form>';
  let htmlList = "";
  data.forEach((nom) => {
    htmlList = htmlList + "<li>" + nom + "</li>";
  });
  htmlList = "<ul>" + htmlList + "</ul>";
  res.send(htmlForm + htmlList);
  //res.sendFile(pathname);
})*/

/*app.get("/about", (req, res) => {
  let htmlForm =
    '<h3>share with us your opinion</h3><form action="/about" method="post"><label' +
    ' for="nom">Nom</label><br><textarea name="nom" id="" cols="30" rows="3">' +
    '</textarea><br><br><button type="submit">Enregistrer</button></form>';
  let htmlList = "";
  data.forEach((nom) => {
    htmlList = htmlList + "<li>" + nom + "</li>";
  });
  htmlList = "<ul>" + htmlList + "</ul>";
  res.sendFile(path.join(__dirname, "about.html"), (err) => {
    if (err) {
        res.status(500).send(err);
    } else {
        res.write(htmlForm + htmlList);
        res.end();
    }
  });
});*/



app.get("/about", (req, res) => {

  let htmlForm =
    '<h3>share with us your opinion</h3><form action="/about" method="post"><label' +
    ' for="nom">comments</label><br><textarea name="nom" id="" cols="30" rows="3">' +
    '</textarea><br><br><button type="submit">Enregistrer</button></form>';
  let htmlList = "";
  data.forEach((nom) => {
    htmlList = htmlList + "<li>" + nom + "</li>";
  });
  htmlList = "<ul>" + htmlList + "</ul>";
  res.send(html+htmlForm + htmlList);
});

app.post("/about", (req, res) => {
  let inputData = new String(req.body.nom);

  let htmlForm =
    '<h1>share with us your opinion</h1><form action="/about" method="post"><label' +
    ' for="nom">Comments</label><br><textarea name="nom" id="" cols="30" rows="3">' +
    '</textarea><br><br><button type="submit">Enregistrer</button></form>';

    data.push(inputData);

    let htmlList = "";
    data.forEach((nom) => {
      htmlList = htmlList + "<li>" + nom + "</li>";
    });
    htmlList = "<ul>" + htmlList + "</ul>";
    res.send(html+htmlForm + htmlList);
  
});







app.get('/help',(req, res) => {
  let pathname=path.join(__dirname,'./help.html');
  res.sendFile(pathname);
})
app.get('/share',(req, res) => {
  let pathname=path.join(__dirname,'./share.html');
  res.sendFile(pathname);
})
app.get('/logout',(req, res) => {
  req.session.logged = false
  res.redirect(302,'/login')
})
app.post('/logout',(req, res) => {
  req.session.logged = false
  res.redirect(302,'/login')
})

app.get('/profile', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  let data={

  }
  const  db = await openDb();
  const liens = await db.all(`
  SELECT * FROM liens
  LEFT JOIN comptes on comptes.username = liens.id
  WHERE id = ? 
  `,[authentification.username])
  data={
    longueur:liens.length,
    liens:liens,
    email:authentification.email,
    username:authentification.username
  }
  res.render("user",data)
})
app.get('/post/:id', async (req, res) => {
  if(!req.session.logged){
    res.redirect(302,'/login')
    return
  }
  const id = req.params.id
  let data={

  }
  const  db = await openDb();
  const liens = await db.all(`
  SELECT * FROM liens
  LEFT JOIN comptes on comptes.username = liens.id
  WHERE id = ? 
  `,[id])
  data={
    longueur:liens.length,
    liens:liens,
    username:id
  }
  res.render("user",data)
})

app.listen(port,  () => {
  console.log(`Listening at http://localhost:${port}`)
})