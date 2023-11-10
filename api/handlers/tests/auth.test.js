const authLambda = require("../auth");
const lambdaTester = require('lambda-tester');


  jest.mock('amazon-cognito-identity-js', () => {
    const signUpResponse = {
        UserSub: '12345'
    };
    
    class CognitoUserAttribute {
        constructor(attributeData) {
            if(attributeData.email === 'error@example.com'){
                throw new Error('testing catch error response')
            }
          
            this.attributeData = attributeData;  
           
            
        }
      }
    class cognitoUserPool {
        signUp(email, password, attributeList, validationData, callback){
            if (email === 'newUser@example.com') {
              callback(null, { userSub: '12345' } );
            } else if (email === 'existingUser@example.com') {
              callback(new Error('existing user'), null);
            } else {
              callback(new Error('other error'), null);
            }
        };

    }
    class AuthenticationDetails {
        constructor(data){
            this.password = data.Password
            this.username = data.Username
        }
    }
    class CognitoUser {
        constructor(data){
        if(data === null || data.Username === null || data.Pool === null){
                throw new Error('Username and pool information are required.');
            }
            this.pool = data.Pool
            this.username = data.Username
        }
    authenticateUser(authenticationDetails, callback) {
            if(authenticationDetails.username === 'myemail@example.com'){
            return callback.onSuccess(new CognitoUserSession())
    } else{
        return callback.onFailure(new Error('log in failed'))
    }
}
    setSignInUserSession(signInUserSession){
        this.signInUserSession = signInUserSession
    }
    globalSignOut(callback) {
        if(this.username === "myID"){
        return callback.onSuccess()
    
    } else{
        return callback.onFailure()
    }
}
    }
    class CognitoUserSession {
        getIdToken() {
          return {
            payload: {
              sub: 'user-subject-id',
              // Other ID token claims
            },
            getJwtToken: () => 'id-token-JWT',
          };
        }
      
        getAccessToken() {
          return {
            getJwtToken: () => 'access-token-JWT',
          };
        }
      
        getRefreshToken() {
          return {
            getToken: () => 'refresh-token',
          };
        }
      }
    class CognitoAccessToken{
        constructor(token){
            this.token = token
        }

    }
    class CognitoIdToken{
        constructor(token){
            this.token = token
        }
    }
    class CognitoRefreshToken{
        constructor(token){
            this.token = token
        }
    }
    
    return {
        CognitoUserPool: cognitoUserPool,
        CognitoUserAttribute: CognitoUserAttribute,
        AuthenticationDetails: AuthenticationDetails,
        CognitoUser: CognitoUser,
        CognitoUserSession: CognitoUserSession,
        CognitoAccessToken:CognitoAccessToken,
        CognitoIdToken:CognitoIdToken,
        CognitoRefreshToken:CognitoRefreshToken
    };
})

     

       
describe('register user lambda function tests', () => {
   
  it('should return status code of 400 when auth lambda is invoked without body request', async () => {
    const event = {

    };
    const response = await lambdaTester(authLambda.registerUser).event(event).expectResult();
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify({message: 'Please supply valid JSON data' }));
  })
  it('should return status code of 400 when username/email already has an account', async () => {
    const event = {
        body: JSON.stringify({
            "first_name": "John",
            "last_name":"Doe",
            "email": "existingUser@example.com"
        })
    }
    const response = await lambdaTester(authLambda.registerUser).event(event).expectResult();
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toBe(JSON.stringify({message: 'existing user' }));
  })
  it('should return status code of 200 and UserSub when registration of user is successful', async () => {
    const event = {
        body: JSON.stringify({
            "first_name": "John",
            "last_name":"Doe",
            "email": "newUser@example.com"
        })
    }
    const response = await lambdaTester(authLambda.registerUser).event(event).expectResult();
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(JSON.stringify({message:`Sign up successful`}));
  })
  it('should return status code of 500 internal server error when invalid body', async () => {
    const event = {
        body: {
            "first_name": "John",
            "last_name":"Doe",
            "email": 'error@example.com'
        }
    }
    const response = await lambdaTester(authLambda.registerUser).event(event).expectResult();
    expect(response.statusCode).toBe(500);
    expect(response.body).toBe(JSON.stringify({ error: "Internal server error" }));
  })
  
})


describe('log in lambda function tests', () => {
    it('should return status code of 400 if post to /login has no event.body', async () =>{
        const event = {

        };
        const response = await lambdaTester(authLambda.logIn).event(event).expectResult();
        expect(response.statusCode).toBe(400);
        expect(response.body).toBe(JSON.stringify({message: 'Please supply valid JSON data' }));
      }) 
      it('should return status code of 200 with user tokens object for successful authentication', async () =>{
        const event = {
           body: JSON.stringify({
            email: 'myemail@example.com',
            password: 'password'
           } )
           
        };
       
        const response = await lambdaTester(authLambda.logIn).event(event).expectResult();
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe(JSON.stringify({user: 'user-subject-id', tokens: {accessToken: 'access-token-JWT', idToken:  'id-token-JWT', refreshToken: 'refresh-token'}}));
      }) 
      it('should return status code of 200 with user tokens object for successful autehntication', async () =>{
        const event = {
           body: JSON.stringify({
            email: 'myemail1@example.com',
          
           } )
           
        };
       
        const response = await lambdaTester(authLambda.logIn).event(event).expectResult();
        expect(response.statusCode).toBe(401);
        
        expect(response.body).toBe(JSON.stringify({ message: 'log in failed' }));
      }) 
      it('should return status code of 200 with user tokens object for successful autehntication', async () =>{
        const event = {
           body: JSON.stringify({
            email: 'myemail1@example.com',
          
           } )
           
        };
       
        const response = await lambdaTester(authLambda.logIn).event(event).expectResult();
        expect(response.statusCode).toBe(401);
        
        expect(response.body).toBe(JSON.stringify({ message: 'log in failed' }));
      }) 
      it('should return status code of 500 internal server error when invalid body', async () => {
        const event = {
            body: {
             email: 'myemail1@example.com',
           
            }
            
         };
        const response = await lambdaTester(authLambda.logIn).event(event).expectResult();
        expect(response.statusCode).toBe(500);
        expect(response.body).toBe(JSON.stringify({ error: "Internal server error" }));
      })
    }) 
    describe('log out lambda function tests', () => {
       
        it('should return status code of 400 if post to /login has no event.body', async () =>{
            const event = {
    
            };
            const response = await lambdaTester(authLambda.logOut).event(event).expectResult();
            expect(response.statusCode).toBe(400);
            expect(response.body).toBe(JSON.stringify({message: 'Please supply valid JSON data' }));
          }) 
          it('should return status code of 404 with please supply acccess token json message when no access token is in body', async () =>{
            const event = {
               body: JSON.stringify({ idToken:  'id-token-JWT', refreshToken: 'refresh-token',  userId: 'myID'} )
               
            };
          
            const response = await lambdaTester(authLambda.logOut).event(event).expectResult();
            expect(response.statusCode).toBe(404);
            expect(response.body).toBe(JSON.stringify({message: 'Please supply access token'}));
          }) 
          it('should return status code of 404 with with please supply id token json message when no id token is in body', async () =>{
            const event = {
               body: JSON.stringify({accessToken: 'access-token-JWT',  refreshToken: 'refresh-token',  userId: 'myID'})
               
            };
           
            const response = await lambdaTester(authLambda.logOut).event(event).expectResult();
            expect(response.statusCode).toBe(404);
            
            expect(response.body).toBe(JSON.stringify({message: 'Please supply ID token'}));
          }) 
          it('should return status code of 404 with with please supply refresh token json message when no refresh token is in body', async () =>{
            const event = {
               body: JSON.stringify({accessToken: 'access-token-JWT', idToken:  'id-token-JWT',  userId: 'myID'} )
               
            };
           
            const response = await lambdaTester(authLambda.logOut).event(event).expectResult();
            expect(response.statusCode).toBe(404);
            
            expect(response.body).toBe(JSON.stringify({message: 'Please supply refresh token'}));
          }) 
          it('should return status code of 404 with with please supply id token json message when no id token is in body', async () =>{
            const event = {
               body: JSON.stringify({accessToken: 'access-token-JWT', refreshToken: 'refresh-token', userId: 'myID'}  )
               
            };
           
            const response = await lambdaTester(authLambda.logOut).event(event).expectResult();
            
            expect(response.statusCode).toBe(404);
            
            expect(response.body).toBe(JSON.stringify({message: 'Please supply ID token'}));
          }) 
          it('should return status code of 404 with with please supply valid user id token json message when no user Id is in body', async () =>{
            const event = {
               body: JSON.stringify({accessToken: 'access-token-JWT', idToken:  'id-token-JWT',userId: 'myID' }  )
               
            };
           
            const response = await lambdaTester(authLambda.logOut).event(event).expectResult();
            expect(response.statusCode).toBe(404);
           
            expect(response.body).toBe(JSON.stringify({message: 'Please supply refresh token'}));
          }) 
          it('should return status code of 200 with user signed out successfully message', async () =>{
            const event = {
               body: JSON.stringify({accessToken: 'access-token-JWT', idToken:  'id-token-JWT', refreshToken: 'refresh-token',  userId: 'myID'} )
               
            };
           
            const response = await lambdaTester(authLambda.logOut).event(event).expectResult();
            
            expect(response.statusCode).toBe(200);
            
            expect(response.body).toBe(JSON.stringify({message: "User signed out successfully"}));
          }) 
          it('should return status code of 400 message failed to sign out user when globalsign out fails', async () =>{
            const event = {
               body: JSON.stringify({accessToken: 'access-token-JWT', idToken:  'id-token-JWT', refreshToken: 'refresh-token',  userId: 'myID1'} )
               
            };
           
            const response = await lambdaTester(authLambda.logOut).event(event).expectResult();
        
            expect(response.statusCode).toBe(400);
        
            expect(response.body).toBe(JSON.stringify({ error: 'Failed to sign out the user' }));
          }) 
          


          it('should return status code of 500 internal server error when invalid body', async () => {
            const event = {
                body: {
                 email: 'myemail1@example.com',
               
                }
                
             };
            const response = await lambdaTester(authLambda.logOut).event(event).expectResult();
            expect(response.statusCode).toBe(500);
            expect(response.body).toBe(JSON.stringify({ error: "Internal server error" }));
          })
          
        }) 

        