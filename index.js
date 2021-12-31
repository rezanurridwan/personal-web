const express = require ('express')
const db = require('./connection/db')
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require ('express-session')

const app = express ()
const port = 5000

const upload = require('./middleware/uploadFile')

let islogin = true
const pathFile = 'http://localhost:5000/uploads/'
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
    "December",
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
let article = [{
        title : 'The Raid',
        genre : 'Action',
        author : 'Raditya Dika',
        postAt : '15 Desember 2021',
        post : '7 hour ago',
        description : 'With supporting text below as a natural lead-in to additional content, Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolor laborum minima molestias consequuntur molestiae eaque distinctio ab blanditiis sed totam eligendi nemo, magnam aut est corporis temporibus tenetur eum tempore!Loreml, Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        poster : 'poster.jpg'
}]

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:false}))

app.use('/public', express.static(__dirname + '/public'))
app.use('/uploads', express.static(__dirname + '/uploads'))

// mengirim alert menggunakan flash
app.use(flash())
app.use(
    session({
        cookie: {
            maxAge: 2 * 60 * 60 * 1000,
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
)
// route for add-blog
app.get('/login', function(req,res){
    res.render('login')
})
app.post('/login', function(req,res){
    const {email, password} = req.body
    let query = `SELECT * FROM tb_user WHERE email= '${email}'`

    db.connect(function(err,client,done){
        if (err) throw err

        client.query(query, function(err,results){
            if(err) throw err

            if(results.rows.length == 0){
                req.flash('danger','your data is not match')
                return res.redirect('/login')
            }

            let isMatch = bcrypt.compareSync(password, results.rows[0].password)

            if(isMatch){
                req.session.islogin = true
                req.session.user = {
                    id: results.rows[0].id,
                    name: results.rows[0].name,
                    email: results.rows[0].email,
                }
                req.flash('success','Your has been login now !!')
                res.redirect('/home')
            }else {
                req.flash('danger','Your data is not match !!')
                res.redirect('/login')
            }
        })
    })
})
app.get('/register', function(req,res){
    res.render('register')
})
app.post('/register', function(req,res){
    const {name, email, password} = req.body

    const hashPassword = bcrypt.hashSync(password, 10)

    db.connect(function(err, client, done){
        if (err) throw err
        let query = `INSERT INTO tb_user (name, email, password) VALUES ('${name}','${email}','${hashPassword}')`
        client.query(query, function(err,result){
            if(err) throw err
            res.redirect('/login')
                })
            })


})
app.get('/logout',function(req,res){
    req.session.destroy()
    res.redirect('/home')
})
app.get('/', function (request, res){
    res.render('home')
})
app.get('/home', function(req,res){
    db.connect(function(err, client, done){
        if (err) throw err

        client.query('SELECT * FROM tb_personaldata', function(err,result){
            done()
            let resulted=result.rows[0]
            res.render('home', {
                islogin:req.session.islogin,
                article:resulted,
                user:req.session.user})
        })
    })
})
app.post('/home', function(req,res){
    let data = req.body
 
    db.connect(function(err, client, done){
     if (err) throw err
     let personaldata = `INSERT INTO tb_personaldata (name, photo,title, phone, email, name) VALUES ('${data.name}','${data.photo}','${data.title}','${data.about}','${data.address}','${data.phone}','${data.email}','${data.name}')`

     let experience1 = `INSERT INTO tb_experience-1 (jobtitle,company, year) VALUES ('${data.jobtitle}','${data.company}','${data.year}')`

     let experience2 = `INSERT INTO tb_experience-2 (jobtitle,company, year) VALUES ('${data.jobtitle}','${data.company}','${data.year}')`

     let experience3 = `INSERT INTO tb_experience-3 (jobtitle,company, year) VALUES ('${data.jobtitle}','${data.company}','${data.year}')`

     let experience4 = `INSERT INTO tb_experience-4 (jobtitle,company, year) VALUES ('${data.jobtitle}','${data.company}','${data.year}')`

    //  client.query(personaldata, function(err,result){
    //      done()
         
    //     })
     client.query(personaldata, function(err,result){
         done()
         
        })
    })
    
    res.redirect('home', {
        islogin:islogin
    })
 
})
app.get('/edit-personaldata', function(req,res){
    res.render('edit-personaldata',{
        islogin:req.session.islogin,
        user:req.session.user
    })
})
app.post('/edit-personaldata', function(req,res){
    let data = req.body


    console.log(data)
    res.render('edit-personaldata',{
        islogin:req.session.islogin,
        user:req.session.user
    })
})
app.get('/articles', function(req,res){

    let query = `SELECT tb_article.id,
    tb_article.title,
    tb_article.genre,
    tb_article.description,
    tb_article.poster,
    tb_user.name AS author FROM tb_article LEFT JOIN tb_user 
    ON tb_article.author_id = tb_user.id;`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query( query, function(err,result){
            done()
            let resulted=result.rows
            resulted = resulted.map(function(article){
                return {
                    ...article,
                    postAt: getTime(new Date()),
                    post: getDistanceTime(new Date()),
                    islogin:req.session.islogin,
                    poster:'/uploads/' + article.poster
                }
            })
            res.render('articles', {
                islogin:req.session.islogin,
                article:resulted,
                user:req.session.user
            })
        })
    })
})
app.post('/articles',upload.single('poster'), function(req,res){
   let data = req.body
    if(!req.session.islogin){
        req.flash('danger', 'please login')
        return res.redirect('add-article')
    }

   let authorId = req.session.user.id
   let poster = req.file.filename

   db.connect(function(err, client, done){
    if (err) throw err
    
    client.query(`INSERT INTO tb_article (title, genre, author, description, poster, author_id) VALUES ('${data.title}','${data.genre}','${data.author}','${data.description}','${poster}','${authorId}')`, function(err,result){
        done()
        
        res.redirect('articles')
            })
        })
        

})
app.get('/add-article', function(req,res){
    res.render('add-article',{
        islogin: req.session.islogin,
        user:req.session.user
    })
})
app.get('/article-detail/:id',function(req,res){
    let id = req.params.id

    
    let query = `SELECT tb_article.id,
    tb_article.title,
    tb_article.genre,
    tb_article.description,
    tb_article.poster,
    tb_user.name AS author FROM tb_article LEFT JOIN tb_user 
    ON tb_article.author_id = tb_user.id;`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query( query, function(err,result){
            done()
            let resulted=result.rows
            resulted = resulted.map(function(article){
                return {
                    ...article,
                    // postAt: getTime(new Date()),
                    // post: getDistanceTime(new Date()),
                    islogin:req.session.islogin,
                    poster:'/uploads/' + article.poster
                }
            })
            console.log(resulted)
            res.render('article-detail', {
                id:id,
                islogin:req.session.islogin,
                data:resulted,
                user:req.session.user
            })
        })
    })

    // db.connect(function(err, client, done){
    //     if (err) throw err
        
    //     client.query(`SELECT * FROM tb_article WHERE id = ${id}`, function(err,result){
    //         done()
    //         let resulted=result.rows[0]
            
    //         res.render('article-detail', {
    //             id:id,
    //             article:resulted,
    //             islogin:req.session.islogin,
    //             user:req.session.user
    //         })
    //     })
    // })
})
app.get('/edit-article/:id', function(req,res){
    let id = req.params.id
    const query = `SELECT * FROM tb_article WHERE id = ${id}`
    db.connect(function (err, conn) {
        if (err) throw err;
    
        conn.query(query, function (err, results) {
          if (err) throw err

          let data = {
                  ...results.rows[0],
                  postAt: getTime(new Date()),
                  post: getDistanceTime(new Date()),
                  islogin:req.session.islogin,
                  poster:'/uploads/' + results.rows[0].poster
              }
              res.render('edit-article',
              {
                id:id,
                article:data,
                islogin:req.session.islogin,
                user:req.session.user
                })
        })


    })
})
app.post('/edit-article/:id',upload.single('poster'), function(req,res){
    let { id, title, genre, author, description, poster } = req.body;

    let image = poster.replace(pathFile, '');
    
    const query = `UPDATE tb_article SET title = "${title}", genre = "${genre}", author = "${author}", description = "${description}", poster = "${image}", WHERE id = ${id}`;

    console.log(query)
    db.connect(function (err, conn) {
        if (err) throw err;
    
        conn.query(query, function (err, results) {
          if (err) throw err

          
              res.redirect(`article/${id}`,
              {
                id:id,
                islogin:req.session.islogin,
                user:req.session.user
                })
        })


    })
})
app.get('/delete-articles/:id', function(req,res){
    const id = req.params.id

    const query = `DELETE FROM tb_article WHERE id=${id}`
    db.connect(function (err, client, done) {
      if (err) throw err;
  
      client.query(query, function (err, results) {
        if (err) throw err
  
        res.redirect('/articles')
      })
    })
})
app.get('/form', function(req,res){
    res.render('form', {
        islogin:req.session.islogin,
        user:req.session.user
    })
})
app.listen(5000, function(){
    console.log(`server starting on port${port}` )
})

var static = require('node-static');
var file = new static.Server('index.js');

require('http').createServer(function(request, response) {
  request.addListener('end', function() {
    file.serve(request, response);
  }).resume();
}).listen(process.env.PORT || 5000);