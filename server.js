// global.debug to help with debuging

global.DEBUG = true;

// syntax for including the file system and http module

const http = require("http");
const fs = require("fs");
const { parse } = require("querystring");

// getting functions from token.js

const {
  newToken,
  countToken,
  checkExpiryDate,
  listToken,
} = require("./scripts/token");
const { tr } = require("date-fns/locale");

// creating function to set up http server with a swtich statement to gather all html files / routes

const server = http.createServer(async (request, response) => {
  var path = "./scripts/views/";

  switch (request.url) {
    case "/":
      response.statusCode = 200;
      path += "home.html";
      fetchFile(path);
      break;
    case "/adminmenu":
      response.statusCode = 200;
      path += "adminMenu.html";
      fetchFile(path);
      break;
    case "/newtoken":
      if (request.method === "POST") {
        getRequestedData(request, (result) => {
          var theNewToken = newToken(result.username);
          fs.readFile(
            __dirname + "/scripts/json/tokens.json",
            "utf-8",
            (error, data) => {
              if (error) throw error;

              let tokens = JSON.parse(data);

              let userMatch = false;

              for (x of tokens) {
                if (x.username === result.username) {
                  userMatch = true;
                }
              }
              if (DEBUG) console.log("Username already taken: " + userMatch);

              if (!userMatch) {
                response.write(`
                <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Create Token</title>
    <style>
      /* Font Import */
      @import url("https://fonts.googleapis.com/css2?family=Golos+Text&family=Montserrat:wght@300&display=swap");

      /* General Styling */
      * {
        border: 0;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      a {
        color: inherit;
        font-size: inherit;
        text-decoration: none;
        font-family: "Montserrat", sans-serif;
      }

      html {
        height: 100%;
      }

      body {
        background: #ffbf00;
        background: linear-gradient(180deg, #ffd5df91, #ffc0d6c2);
        font-family: 'Golos Text', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin-top: 5.3em;
        background-repeat: no-repeat;
        background-attachment: fixed;
    }

      /* Token Page */
      .create-token {
        width: 28em;
        padding: 8% 0 0;
        margin: auto;
        height: 100%;
      }

      .form {
        position: relative;
        z-index: 1;
        background: #ffffff;
        max-width: 28em;
        margin: 0 auto 1em;
        padding: 3em;
        text-align: center;
        box-shadow: 0 0 1em 0 rgba(154, 51, 75, 0.066),
          0 0.3em 0.3em 0 rgba(154, 51, 75, 0.24);
      }

      .form input {
        font-family: "Golos Text", sans-serif;
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 0 0 1em;
        padding: 1em;
        box-sizing: border-box;
        font-size: 1em;
      }

      .form button {
        text-transform: uppercase;
        outline: 0;
        background: #ff99bd;
        width: 100%;
        height: 4em;
        border: 0;
        color: #ffffff;
        font-size: 1em;
        -webkit-transition: all 0.25 ease;
        transition: all 0.25 ease;
        cursor: pointer;
        transition-duration: 0.25s;
        font-family: "Montserrat", sans-serif;
        letter-spacing: 0.053em;
        transition-duration: 1s;
        display: block;
        text-align: center;
      }

      .form button:hover,
      .form button:active,
      .form button:focus {
        background: #ff6198;
      }

      h1 {
        color: #282324;
        font-family: "Montserrat", sans-serif;
        font-weight: 500;
        margin-top: 0em;
        margin-bottom: 1em;
        font-size: 1.4em;
        transition-duration: 0.5s;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
      }

      h1:hover {
        color: #3e3c3d;
      }

      .button {
        width: 100%;
        line-height: 4em;
        display: block;
      }

      button:hover {
        letter-spacing: 0.09em;
      }

      /* Navbar */
      #navbar {
        background: #ffffff;
        color: #282324;
        position: fixed;
        top: 0;
        height: 3.75em;
        line-height: 3.75em;
        width: 100vw;
        z-index: 10;
      }

      .navwrap {
        margin: auto;
        text-align: center;
        width: 90%;
      }

      @media (max-width: 48em) {
        .nav-wrap {
          width: 90%;
        }
      }

      @media (max-width: 39.8em) {
        .nav-wrap {
          width: 100%;
        }
      }

      .title {
        float: left;
        margin-left: 1.75em;
        font-size: 1.5em;
        height: 3.75em;
        letter-spacing: 0.06em;
        font-family: "Golos Text", sans-serif;
        text-transform: uppercase;
        font-weight: 100;
        transition-duration: 0.4s;
      }

      .title:hover {
        letter-spacing: 0.09em;
      }

      #navbar ul {
        display: inline-block;
        float: right;
        list-style: none;
        text-align: right;
        transition: transform 0.5s ease-out;
        -webkit-transition: transform 0.5s ease-out;
      }

      @media (max-width: 40em) {
        #navbar ul {
          display: none;
        }
      }

      @media (orientation: landscape) {
        #navbar ul {
          display: inline-block;
        }
      }

      #navbar li {
        display: inline-block;
      }

      #navbar li a {
        color: #282324;
        display: block;
        font-size: 0.7em;
        height: 50em;
        letter-spacing: 0.06em;
        margin: 0 1.25em;
        padding: 0 0.25em;
        position: relative;
        text-decoration: none;
        text-transform: uppercase;
        transition: all 0.5s ease;
        -webkit-transition: all 0.5s ease;
      }

      #navbar li a:hover {
        color: #ff6198;
        letter-spacing: 0.05em;
      }
    </style>
  </head>

  <body>
    <!-- Navbar -->
    <nav id="navbar" class="">
      <div class="navwrap">
        <div class="title">
          <a href="http://localhost:3000"
            ><i class="fa fa-angellist"></i>Sprint</a
          >
        </div>
        <!-- Navigation -->
        <ul id="menu">
          <li><a href="http://localhost:3000">Home</a></li>
          <li><a href="http://localhost:3000/newtoken">New User</a></li>
        </ul>
      </div>
    </nav>
    <!-- Create Token -->
    <div class="create-token">
      <div class="form">
    <form>
      <h1>${result.username}'s token is ${theNewToken}. <br /></h1>
      <button><a class="button" href="http://localhost:3000/newtoken">create another token</a></button>
    </form>
  </div>
  </div>
  </body>
</html>

            `);

                response.end();
              } else {
                response.write(`
                <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Create Token</title>
    <style>
      /* Font Import */
      @import url("https://fonts.googleapis.com/css2?family=Golos+Text&family=Montserrat:wght@300&display=swap");

      /* General Styling */
      * {
        border: 0;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      a {
        color: inherit;
        font-size: inherit;
        text-decoration: none;
        font-family: "Montserrat", sans-serif;
      }

      html {
        height: 100%;
      }

      body {
        background: #ffbf00;
        background: linear-gradient(180deg, #ffd5df91, #ffc0d6c2);
        font-family: 'Golos Text', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin-top: 5.3em;
        background-repeat: no-repeat;
        background-attachment: fixed;
    }

      /* Token Page */
      .create-token {
        width: 28em;
        padding: 8% 0 0;
        margin: auto;
        height: 100%;
      }

      .form {
        position: relative;
        z-index: 1;
        background: #ffffff;
        max-width: 28em;
        margin: 0 auto 1em;
        padding: 3em;
        text-align: center;
        box-shadow: 0 0 1em 0 rgba(154, 51, 75, 0.066),
          0 0.3em 0.3em 0 rgba(154, 51, 75, 0.24);
      }

      .form input {
        font-family: "Golos Text", sans-serif;
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 0 0 1em;
        padding: 1em;
        box-sizing: border-box;
        font-size: 1em;
      }

      .form button {
        text-transform: uppercase;
        outline: 0;
        background: #ff99bd;
        width: 100%;
        height: 4em;
        border: 0;
        color: #ffffff;
        font-size: 1em;
        -webkit-transition: all 0.25 ease;
        transition: all 0.25 ease;
        cursor: pointer;
        transition-duration: 0.25s;
        font-family: "Montserrat", sans-serif;
        letter-spacing: 0.053em;
        transition-duration: 1s;
        display: block;
        text-align: center;
      }

      .form button:hover,
      .form button:active,
      .form button:focus {
        background: #ff6198;
      }

      h1 {
        color: #282324;
        font-family: "Montserrat", sans-serif;
        font-weight: 500;
        margin-top: 0em;
        margin-bottom: 1em;
        font-size: 1.4em;
        transition-duration: 0.5s;
        -webkit-transition: all 0.3 ease;
        transition: all 0.3 ease;
      }

      h1:hover {
        color: #3e3c3d;
      }

      .button {
        width: 100%;
        line-height: 4em;
        display: block;
      }

      button:hover {
        letter-spacing: 0.09em;
      }

      /* Navbar */
      #navbar {
        background: #ffffff;
        color: #282324;
        position: fixed;
        top: 0;
        height: 3.75em;
        line-height: 3.75em;
        width: 100vw;
        z-index: 10;
      }

      .navwrap {
        margin: auto;
        text-align: center;
        width: 90%;
      }

      @media (max-width: 48em) {
        .nav-wrap {
          width: 90%;
        }
      }

      @media (max-width: 39.8em) {
        .nav-wrap {
          width: 100%;
        }
      }

      .title {
        float: left;
        margin-left: 1.75em;
        font-size: 1.5em;
        height: 3.75em;
        letter-spacing: 0.06em;
        font-family: "Golos Text", sans-serif;
        text-transform: uppercase;
        font-weight: 100;
        transition-duration: 0.4s;
      }

      .title:hover {
        letter-spacing: 0.09em;
      }

      #navbar ul {
        display: inline-block;
        float: right;
        list-style: none;
        text-align: right;
        transition: transform 0.5s ease-out;
        -webkit-transition: transform 0.5s ease-out;
      }

      @media (max-width: 40em) {
        #navbar ul {
          display: none;
        }
      }

      @media (orientation: landscape) {
        #navbar ul {
          display: inline-block;
        }
      }

      #navbar li {
        display: inline-block;
      }

      #navbar li a {
        color: #282324;
        display: block;
        font-size: 0.7em;
        height: 50em;
        letter-spacing: 0.06em;
        margin: 0 1.25em;
        padding: 0 0.25em;
        position: relative;
        text-decoration: none;
        text-transform: uppercase;
        transition: all 0.5s ease;
        -webkit-transition: all 0.5s ease;
      }

      #navbar li a:hover {
        color: #ff6198;
        letter-spacing: 0.05em;
      }
    </style>
  </head>

  <body>
    <!-- Navbar -->
    <nav id="navbar" class="">
      <div class="navwrap">
        <div class="title">
          <a href="http://localhost:3000"
            ><i class="fa fa-angellist"></i>Sprint</a
          >
        </div>
        <!-- Navigation -->
        <ul id="menu">
          <li><a href="http://localhost:3000">Home</a></li>
          <li><a href="http://localhost:3000/newtoken">New User</a></li>
        </ul>
      </div>
    </nav>
    <!-- Create Token -->
    <div class="create-token">
      <div class="form">
    <form>
      <h1>${result.username}'s token is taken. Please try again. <br /></h1>
      <button><a class="button" href="http://localhost:3000/newtoken">create another token</a></button>
    </form>
  </div>
  </div>
  </body>
</html>  
            `);
              }
            }
          );
        });
        break;
      } else {
        response.statusCode = 200;
        path += "createToken.html";
        fetchFile(path);
      }
      break;
    case "/count":
      var count = await countToken();
      response.end(`
      <!doctype html>
      <html>
      <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Home</title>
          <style>
              /* Font Import */
              @import url('https://fonts.googleapis.com/css2?family=Golos+Text&family=Montserrat:wght@300&display=swap');
      
              h2 {
                color: inherit;
                font-size: inherit;
                text-decoration: none;
                font-family: 'Montserrat', sans-serif;
                font-size: 1em;
                margin-bottom: 1em;
                word-wrap: break-word;
              }
      
              /* General Styling */

              html {
                height: 100%
              }

              * {
                  border: 0;
                  box-sizing: border-box;
                  margin: 0;
                  padding: 0;
              }
      
              body {
                background: #ffbf00;
                background: linear-gradient(180deg, #ffd5df91, #ffc0d6c2);
                font-family: 'Golos Text', sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                margin-top: 5.3em;
                background-repeat: no-repeat;
                background-attachment: fixed;
            }
      
              a {
                  color: inherit;
                  font-size: inherit;
                  text-decoration: none;
                  font-family: 'Montserrat', sans-serif;
              }
      
              /* Navbar */
              #navbar {
                  background: #ffffff;
                  color: #282324;
                  position: fixed;
                  top: 0;
                  height: 3.75em;
                  line-height: 3.75em;
                  width: 100vw;
                  z-index: 10;
              }
      
              .navwrap {
                  margin: auto;
                  text-align: center;
                  width: 90%;
              }
      
              @media(max-width: 48em) {
                  .nav-wrap {
                      width: 90%;
                  }
              }
      
              @media(max-width: 39.8em) {
                  .nav-wrap {
                      width: 100%;
                  }
              }
      
              .title {
                  float: left;
                  margin-left: 1.75em;
                  font-size: 1.5em;
                  height: 3.75em;
                  letter-spacing: 0.06em;
                  font-family: 'Golos Text', sans-serif;
                  text-transform: uppercase;
                  font-weight: 100;
                  transition-duration: 0.4s;
              }
      
              .title:hover {
                  letter-spacing: 0.09em;
              }
      
              #navbar ul {
                  display: inline-block;
                  float: right;
                  list-style: none;
                  text-align: right;
                  transition: transform 0.5s ease-out;
                  -webkit-transition: transform 0.5s ease-out;
              }
      
              @media(max-width: 40em) {
                  #navbar ul {
                      display: none;
                  }
              }
      
              @media(orientation: landscape) {
                  #navbar ul {
                      display: inline-block;
                  }
              }
      
              #navbar li {
                  display: inline-block;
              }
      
              #navbar li a {
                  color: #282324;
                  display: block;
                  font-size: 0.7em;
                  height: 50em;
                  letter-spacing: 0.06em;
                  margin: 0 1.25em;
                  padding: 0 0.25em;
                  position: relative;
                  text-decoration: none;
                  text-transform: uppercase;
                  transition: all 0.5s ease;
                  -webkit-transition: all 0.5s ease;
              }
      
              #navbar li a:hover {
                  color: #ff6198;
                  letter-spacing: 0.05em;
              }
      
              /* Token Page */
              .create-token {
                  width: 28em;
                  padding: 8% 0 0;
                  margin: auto;
                  height: 100%;
              }
      
              .form {
                  position: relative;
                  z-index: 1;
                  background: #FFFFFF;
                  max-width: 28em;
                  margin: 0 auto 1em;
                  padding: 3em;
                  text-align: center;
                  box-shadow: 0 0 1em 0 rgba(154, 51, 75, 0.066), 0 0.3em 0.3em 0 rgba(154, 51, 75, 0.24);
              }
      
              .form input {
                  font-family: 'Golos Text', sans-serif;
                  outline: 0;
                  background: #f2f2f2;
                  width: 100%;
                  border: 0;
                  margin: 0 0 1em;
                  padding: 1em;
                  box-sizing: border-box;
                  font-size: 1em;
              }
      
              .form button {
                text-transform: uppercase;
                outline: 0;
                background: #ff99bd;
                width: 100%;
                height: 4em;
                border: 0;
                color: #FFFFFF;
                font-size: 1em;
                -webkit-transition: all 0.25 ease;
                transition: all 0.25 ease;
                cursor: pointer;
                transition-duration: 0.25s;
                font-family: 'Montserrat', sans-serif;
                letter-spacing: 0.053em;
                transition-duration: 1s;
                display: block;
                text-align: center;
              }
      
              .form button:hover,
              .form button:active,
              .form button:focus {
                  background: #ff6198;
              }
      
              h1 {
                  color: #282324;
                  font-family: 'Montserrat', sans-serif;
                  font-weight: 500;
                  margin-top: 0em;
                  margin-bottom: 1em;
                  font-size: 1.4em;
                  transition-duration: 0.5s;
                  -webkit-transition: all 0.3 ease;
                  transition: all 0.3 ease;
              }
      
              h1:hover {
                  color: #3e3c3d;
              }
      
              .button {
                width: 100%;
                line-height: 4em;
                display: block;
              }
      
              button:hover {
                  letter-spacing: 0.09em;
              }
          </style>
      </head>
      
      <body>
          <!-- Navbar -->
          <nav id="navbar" class="">
              <div class="navwrap">
                  <div class="title">
                      <a href="http://localhost:3000"><i class="fa fa-angellist"></i>Sprint</a>
                  </div>
                  <!-- Navigation -->
                  <ul id="menu">
                      <li><a href="http://localhost:3000">Home</a></li>
                      <li><a href="http://localhost:3000/newtoken">New User</a></li>
                  </ul>
              </div>
          </nav>
          <!-- Admin Login -->
          <div class="create-token">
              <div class="form">
                  <form>
                      <h1>token count:</h1>
                      <h2>Token count is ${count}. <br /></h2>
                      <!-- not working -->
                      <button><a class="button" href="http://localhost:3000/adminmenu">admin menu</a></button>
                  </form>
              </div>
          </div>
      </body>
      
      </html>`);
      break;

    case "/expire":
      var expiredList = await checkExpiryDate();
      response.end(`
      <!doctype html>
      <html>
      <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Home</title>
          <style>
              /* Font Import */
              @import url('https://fonts.googleapis.com/css2?family=Golos+Text&family=Montserrat:wght@300&display=swap');
      
              /* General Styling */

              html {
                height: 100%
              }

              h2 {
                  color: inherit;
                  font-size: inherit;
                  text-decoration: none;
                  font-family: 'Montserrat', sans-serif;
                  font-size: 1em;
                  margin-bottom: 1em;
                  word-wrap: break-word;
              }
      
              * {
                  border: 0;
                  box-sizing: border-box;
                  margin: 0;
                  padding: 0;
              }
      
              body {
                background: #ffbf00;
                background: linear-gradient(180deg, #ffd5df91, #ffc0d6c2);
                font-family: 'Golos Text', sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                margin-top: 5.3em;
                background-repeat: no-repeat;
                background-attachment: fixed;
            }
      
              a {
                  color: inherit;
                  font-size: inherit;
                  text-decoration: none;
                  font-family: 'Montserrat', sans-serif;
              }
      
              /* Navbar */
              #navbar {
                  background: #ffffff;
                  color: #282324;
                  position: fixed;
                  top: 0;
                  height: 3.75em;
                  line-height: 3.75em;
                  width: 100vw;
                  z-index: 10;
              }
      
              .navwrap {
                  margin: auto;
                  text-align: center;
                  width: 90%;
              }
      
              @media(max-width: 48em) {
                  .nav-wrap {
                      width: 90%;
                  }
              }
      
              @media(max-width: 39.8em) {
                  .nav-wrap {
                      width: 100%;
                  }
              }
      
              .title {
                  float: left;
                  margin-left: 1.75em;
                  font-size: 1.5em;
                  height: 3.75em;
                  letter-spacing: 0.06em;
                  font-family: 'Golos Text', sans-serif;
                  text-transform: uppercase;
                  font-weight: 100;
                  transition-duration: 0.4s;
              }
      
              .title:hover {
                  letter-spacing: 0.09em;
              }
      
              #navbar ul {
                  display: inline-block;
                  float: right;
                  list-style: none;
                  text-align: right;
                  transition: transform 0.5s ease-out;
                  -webkit-transition: transform 0.5s ease-out;
              }
      
              @media(max-width: 40em) {
                  #navbar ul {
                      display: none;
                  }
              }
      
              @media(orientation: landscape) {
                  #navbar ul {
                      display: inline-block;
                  }
              }
      
              #navbar li {
                  display: inline-block;
              }
      
              #navbar li a {
                  color: #282324;
                  display: block;
                  font-size: 0.7em;
                  height: 50em;
                  letter-spacing: 0.06em;
                  margin: 0 1.25em;
                  padding: 0 0.25em;
                  position: relative;
                  text-decoration: none;
                  text-transform: uppercase;
                  transition: all 0.5s ease;
                  -webkit-transition: all 0.5s ease;
              }
      
              #navbar li a:hover {
                  color: #ff6198;
                  letter-spacing: 0.05em;
              }
      
              /* Token Page */
              .create-token {
                  width: 28em;
                  padding: 8% 0 0;
                  margin: auto;
                  height: 100%;
              }
      
              .form {
                  position: relative;
                  z-index: 1;
                  background: #FFFFFF;
                  max-width: 28em;
                  margin: 0 auto 1em;
                  padding: 3em;
                  text-align: center;
                  box-shadow: 0 0 1em 0 rgba(154, 51, 75, 0.066), 0 0.3em 0.3em 0 rgba(154, 51, 75, 0.24);
              }
      
              .form input {
                  font-family: 'Golos Text', sans-serif;
                  outline: 0;
                  background: #f2f2f2;
                  width: 100%;
                  border: 0;
                  margin: 0 0 1em;
                  padding: 1em;
                  box-sizing: border-box;
                  font-size: 1em;
              }
      
              .form button {
                text-transform: uppercase;
                outline: 0;
                background: #ff99bd;
                width: 100%;
                height: 4em;
                border: 0;
                color: #FFFFFF;
                font-size: 1em;
                -webkit-transition: all 0.25 ease;
                transition: all 0.25 ease;
                cursor: pointer;
                transition-duration: 0.25s;
                font-family: 'Montserrat', sans-serif;
                letter-spacing: 0.053em;
                transition-duration: 1s;
                display: block;
                text-align: center;
              }
      
              .form button:hover,
              .form button:active,
              .form button:focus {
                  background: #ff6198;
              }
      
              h1 {
                  color: #282324;
                  font-family: 'Montserrat', sans-serif;
                  font-weight: 500;
                  margin-top: 0em;
                  margin-bottom: 1em;
                  font-size: 1.4em;
                  transition-duration: 0.5s;
                  -webkit-transition: all 0.3 ease;
                  transition: all 0.3 ease;
              }
      
              h1:hover {
                  color: #3e3c3d;
              }
      
              .button {
                width: 100%;
                line-height: 4em;
                display: block;
              }
      
              button:hover {
                  letter-spacing: 0.09em;
              }
          </style>
      </head>
      
      <body>
          <!-- Navbar -->
          <nav id="navbar" class="">
              <div class="navwrap">
                  <div class="title">
                      <a href="http://localhost:3000"><i class="fa fa-angellist"></i>Sprint</a>
                  </div>
                  <!-- Navigation -->
                  <ul id="menu">
                      <li><a href="http://localhost:3000">Home</a></li>
                      <li><a href="http://localhost:3000/newtoken">New User</a></li>
                  </ul>
              </div>
          </nav>
          <!-- Admin Login -->
          <div class="create-token">
              <div class="form">
                  <form>
                      <h1>expired tokens:</h1>
      
                      <h2>
                          ${JSON.stringify(expiredList)} <br /> <br /></h2>
                      <button><a class="button" href="http://localhost:3000/adminmenu">admin menu</a></button>
                  </form>
              </div>
          </div>
      </body>
      
      </html>
        `);
      break;
    case "/allTokens":
      var tokenList = await listToken();
      response.end(`
      <!doctype html>
      <html>
      <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Home</title>
          <style>
              /* Font Import */
              @import url('https://fonts.googleapis.com/css2?family=Golos+Text&family=Montserrat:wght@300&display=swap');
      
              /* General Styling */

              html {
                height: 100%
              }

              * {
                  border: 0;
                  box-sizing: border-box;
                  margin: 0;
                  padding: 0;
              }
      
              h2 {
                  color: inherit;
                  font-size: inherit;
                  text-decoration: none;
                  font-family: 'Montserrat', sans-serif;
                  font-size: 1em;
                  margin-bottom: 1em;
                  word-wrap: break-word;
              }
      
              body {
                background: #ffbf00;
                background: linear-gradient(180deg, #ffd5df91, #ffc0d6c2);
                font-family: 'Golos Text', sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                margin-top: 5.3em;
                background-repeat: no-repeat;
                background-attachment: fixed;
            }
      
              a {
                  color: inherit;
                  font-size: inherit;
                  text-decoration: none;
                  font-family: 'Montserrat', sans-serif;
              }
      
              /* Navbar */
              #navbar {
                  background: #ffffff;
                  color: #282324;
                  position: fixed;
                  top: 0;
                  height: 3.75em;
                  line-height: 3.75em;
                  width: 100vw;
                  z-index: 10;
              }
      
              .navwrap {
                  margin: auto;
                  text-align: center;
                  width: 90%;
              }
      
              @media(max-width: 48em) {
                  .nav-wrap {
                      width: 90%;
                  }
              }
      
              @media(max-width: 39.8em) {
                  .nav-wrap {
                      width: 100%;
                  }
              }
      
              .title {
                  float: left;
                  margin-left: 1.75em;
                  font-size: 1.5em;
                  height: 3.75em;
                  letter-spacing: 0.06em;
                  font-family: 'Golos Text', sans-serif;
                  text-transform: uppercase;
                  font-weight: 100;
                  transition-duration: 0.4s;
              }
      
              .title:hover {
                  letter-spacing: 0.09em;
              }
      
              #navbar ul {
                  display: inline-block;
                  float: right;
                  list-style: none;
                  text-align: right;
                  transition: transform 0.5s ease-out;
                  -webkit-transition: transform 0.5s ease-out;
              }
      
              @media(max-width: 40em) {
                  #navbar ul {
                      display: none;
                  }
              }
      
              @media(orientation: landscape) {
                  #navbar ul {
                      display: inline-block;
                  }
              }
      
              #navbar li {
                  display: inline-block;
              }
      
              #navbar li a {
                  color: #282324;
                  display: block;
                  font-size: 0.7em;
                  height: 50em;
                  letter-spacing: 0.06em;
                  margin: 0 1.25em;
                  padding: 0 0.25em;
                  position: relative;
                  text-decoration: none;
                  text-transform: uppercase;
                  transition: all 0.5s ease;
                  -webkit-transition: all 0.5s ease;
              }
      
              #navbar li a:hover {
                  color: #ff6198;
                  letter-spacing: 0.05em;
              }
      
              /* Token Page */
              .create-token {
                  width: 28em;
                  padding: 8% 0 0;
                  margin: auto;
                  height: 100%;
              }
      
              .form {
                  position: relative;
                  z-index: 1;
                  background: #FFFFFF;
                  max-width: 28em;
                  margin: 0 auto 1em;
                  padding: 3em;
                  text-align: center;
                  box-shadow: 0 0 1em 0 rgba(154, 51, 75, 0.066), 0 0.3em 0.3em 0 rgba(154, 51, 75, 0.24);
              }
      
              .form input {
                  font-family: 'Golos Text', sans-serif;
                  outline: 0;
                  background: #f2f2f2;
                  width: 100%;
                  border: 0;
                  margin: 0 0 1em;
                  padding: 1em;
                  box-sizing: border-box;
                  font-size: 1em;
              }
      
              .form button {
                text-transform: uppercase;
                outline: 0;
                background: #ff99bd;
                width: 100%;
                height: 4em;
                border: 0;
                color: #FFFFFF;
                font-size: 1em;
                -webkit-transition: all 0.25 ease;
                transition: all 0.25 ease;
                cursor: pointer;
                transition-duration: 0.25s;
                font-family: 'Montserrat', sans-serif;
                letter-spacing: 0.053em;
                transition-duration: 1s;
                display: block;
                text-align: center;
              }
      
              .form button:hover,
              .form button:active,
              .form button:focus {
                  background: #ff6198;
              }
      
              h1 {
                  color: #282324;
                  font-family: 'Montserrat', sans-serif;
                  font-weight: 500;
                  margin-top: 0em;
                  margin-bottom: 1em;
                  font-size: 1.4em;
                  transition-duration: 0.5s;
                  -webkit-transition: all 0.3 ease;
                  transition: all 0.3 ease;
              }
      
              h1:hover {
                  color: #3e3c3d;
              }
      
              .button {
                width: 100%;
                line-height: 4em;
                display: block;
              }
      
              button:hover {
                  letter-spacing: 0.09em;
              }
          </style>
      </head>
      
      <body>
          <!-- Navbar -->
          <nav id="navbar" class="">
              <div class="navwrap">
                  <div class="title">
                      <a href="http://localhost:3000"><i class="fa fa-angellist"></i>Sprint</a>
                  </div>
                  <!-- Navigation -->
                  <ul id="menu">
                      <li><a href="http://localhost:3000">Home</a></li>
                      <li><a href="http://localhost:3000/newtoken">New User</a></li>
                  </ul>
              </div>
          </nav>
          <!-- Admin Login -->
          <div class="create-token">
              <div class="form">
                  <form>
                      <h1>all tokens:</h1>
                      <h2>${JSON.stringify(tokenList)}<br /> <br /></h2>
                      <button><a class="button" href="http://localhost:3000/adminmenu">admin menu</a></button>
                  </form>
              </div>
          </div>
      </body>
      
      </html>
        `);
      break;
    default:
      response.statusCode = 404;
      path += "404.html";
      fetchFile(path);
      break;
  }

  // function to fetch the html data

  function fetchFile(path) {
    fs.readFile(path, function (err, data) {
      if (err) {
        console.log(err);
        response.end();
      } else {
        if (DEBUG) console.log("file was served.");
        response.writeHead(response.statusCode, {
          "Content-Type": "text/html",
        });
        response.write(data);
        response.end();
      }
    });
  }
});

//function to set up a port and let the user know the program is working and servers are running.

server.listen(3000, "localhost", () => {
  console.log(
    "listening on port 3000, Visit http://localhost:3000/ to view the page."
  );
  console.log("Press Ctrl C to terminate...");
});

// function for gather the info from the above switch statements and turning them into an html page

function getRequestedData(request, callback) {
  const FORM_URLENCODED = "application/x-www-form-urlencoded";
  if (request.headers["content-type"] === FORM_URLENCODED) {
    var body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      callback(parse(body));
    });
  } else {
    callback(null);
  }
}
