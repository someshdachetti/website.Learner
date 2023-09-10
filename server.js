const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt =require('jsonwebtoken')
// Set EJS as the template engine
app.set('view engine', 'ejs');

// Specify the views directory
app.set('views', __dirname + '/viewsFolder');

const userInput =[]

app.use(express.urlencoded({extends:false}))

app.post('/register', async (request, response) => {
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        
        userInput.push({
            id: Date.now().toString(),
            name: request.body.name,
            email: request.body.email,
            password: hashedPassword,
        });

        console.log(userInput);

const findingUser = userInput.find(user => user.email === request.body.email);

        if (findingUser) {
            const payload = { name: findingUser.name };
            const secretKey = 'WebSiteLearn';
            const jwtToken = jwt.sign(payload, secretKey);

            // Redirect to the login page after registration and pass JWT token as a query parameter
            response.redirect(`/login`);
            console.log(jwtToken);
        } else {
            console.log('User not Found');
            response.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        response.redirect('/register');
    }
});


app.post('/login', async(request,response)=>{
    try {
        const email = request.body.email;
        const password = request.body.password;
        

const verifyUser = userInput.find(eachvalue => eachvalue.email === email);
        

        if (verifyUser) {
            const jwtTOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMSIsImlhdCI6MTY5NDI2NDkyNn0.4Dg4FFIdpg73ZHEZ9k1D0qqDl8zwCbimprMzQTiDcGY'// Get JWT token from query parameter
            
            if (jwtTOKEN) {
            jwt.verify(jwtTOKEN, 'WebSiteLearn', async (error, decode) => {
                    if (error) {
                        // JWT token is Invalid
                        response.redirect('/login');
                    } else {
                        // JWT token is  Valid
                        console.log('jwtToken is Valid', decode.name);
                        response.redirect('/');
                    }
                });
            } else {
                // JWT token is not  Found
                console.log('jwtToken is Not Found');
                response.redirect('/login');
            }
        } else {
            // User is not Found
            console.log('User is Not found');
            response.redirect('/register');
        }
    } catch (error) {
        console.error(error);
        response.redirect('/login');
    }
});


 app.get('/', (request, response) => {
     response.render('index.ejs');
 });
 
 app.get('/login', (request, response) => {
     response.render('login.ejs');
 });
 
 app.get('/register', (request, response) => {
     response.render('register.ejs');
 });
 

app.get('/', (request,response)=>{
    response.render('index.ejs')
})

app.get('/login',(request,response)=>{
    response.render('login.ejs')
})

app.get('/register',(request,response)=>{
    response.render('register.ejs')
})



app.listen(3000, ()=>{
    console.log('port is Listening  Started')
})




