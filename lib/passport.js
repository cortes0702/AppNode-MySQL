const passport =  require("passport")
const localStrategy = require("passport-local").Strategy
const pool = require("../database")
const helpers = require("./helpers")

passport.use("local.signin",new localStrategy({
    usernameField:"username",
    passwordField:"password",
    passReqToCallback:true
},async(req, username, password, done) => {

    const rows = await pool.query("SELECT * FROM  users WHERE username = ?", [username])
    console.log(rows)

    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        console.log(validPassword)
        if(validPassword){
            done(null, user, req.flash("success", "Bienvenido " + user.username));
        } else {
            done(null, false, req.flash("message", "Contraseña incorrecta"));
        }

    }else{
        return done(null, false, req.flash("message", "El usuario no existe"));
    }
}))

passport.use("local.signup", new localStrategy({
    usernameField:"username",
    passwordField:"password",
    passReqToCallback:true
},async(req, username, password, done) => {

    console.log(req.body)
    const {fullname, email} = req.body

    const newuser = {
        username,
        password,
        fullname,
        email
    }

    newuser.password = await helpers.encryptPassword(password)

    const result = await pool.query("INSERT INTO users SET ?", [newuser])
    console.log(result)

    newuser.id = result.insertId

    return done(null, newuser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async(id, done) => { 
    const rows = await pool.query("SELECT * FROM users WHERE id = ?", [id])
    done(null, rows[0])
})