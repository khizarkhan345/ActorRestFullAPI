This is a basic Node JS restful API for a simple movie tracking Database. Here we manage movies and actors. Here we are using MongoDB and Express. We are 
using POSTMAN for checking our routes. The movie table has the following attribues.

    i) name
    ii) genre
    iii) actors (Associated with Actor Table)
    iv) business_done
    v) reviews (Optional)
    vi) Rating (Optional)
    
    The Actor table has the following attributes.
    
     i) name
     ii) age
     iii) gender
    
 In order to run this program simply clone the project and go the root directory. Now install the following dependencies.
  
   i) bcrypt
   ii) body-parser
   iii) express
   iv) jsonwebtoken
   v) mongoose
   vi) morgan
   vii) nodemon
   
 Now run the command npm start to run the program.
 
 Following are the get, post, patch and delete routes that we can run and test.
 
 1) localhost:3000/movies/
 2) localhost:3000/actors/
 3) localhost:3000/users/login
 4) localhost:3000/users/signup
