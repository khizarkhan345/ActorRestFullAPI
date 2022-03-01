
 1) First, we have to clone the project. After that we would need to install node and npm as these are required to run the program. Go to the following site and download node.
  i) https://nodejs.org/en/
 
 2) After downloading the node installer, simply run it and install it. After the installation is complete, type the command node -v in the command prompt to verift it if its installed. If you see the version then it is installed. 

 3) Now, run the following command on command prompt and install npm

 npm install -g npm     

 4) To confirm it simply run the command npm -v in the command prompt.

 5) Now go to the project directory in the command prompt and install the following dependencies.

    i) bcrypt (npm install bcrypt@5.0.1)
   ii) body-parser (npm install body-parser@1.19.2)
   iii) express (npm install express@4.17.3)
   iv) jsonwebtoken (npm install jsonwebtoken@8.5.1)
   v) mongoose (npm install mongoose@6.2.3)
   vi) morgan (npm install morgan@1.10.0)
   vii) nodemon (npm install nodemon@2.0.15)


   
 Now run the command npm start to run the program.

 Refer to the PDF file Instructions.pdf to know how to test the API.

 
 Following are the get, post, patch and delete routes that we can run and test.
 
 1) localhost:3000/movies/
 2) localhost:3000/actors/
 3) localhost:3000/users/login
 4) localhost:3000/users/signup
