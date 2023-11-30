const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

 //defint cognito pool details
 const poolData = {
    UserPoolId: 'ap-southeast-2_rBmwZee9w',
    ClientId: '3o1mick3e1el8jeg8imisqtjh5'
 }
 const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

//create router to register user using aws cognito
module.exports.registerUser = async (event) => {
    try {
        if (!event.body) {
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 400,
                body: JSON.stringify({ message: 'Please supply valid JSON data' })
            };
        }
        const requestBody = JSON.parse(event.body);
        const {first_name, last_name, email, password} = requestBody
         //attribute list for aws cognito
        const attributeList = [
            new AmazonCognitoIdentity.CognitoUserAttribute({
              Name: 'given_name',
              Value: first_name
            }),
            new AmazonCognitoIdentity.CognitoUserAttribute({
              Name: 'family_name',
              Value: last_name,
            }),
            new AmazonCognitoIdentity.CognitoUserAttribute({
                Name: 'email',
                Value: email
            })
          ];
          try{
            function signUp(userPool, email, password, attributeList) {
                return new Promise((resolve, reject) => {
                  userPool.signUp(email, password, attributeList, null, (err, result) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                    resolve(result);
                  });
                });
              }
             await signUp( userPool, email, password, attributeList)
              
       
          return {
            headers: {
            'Access-Control-Allow-Origin': '*',
           
          },
            statusCode: 200,
            body: JSON.stringify({ message: `Sign up successful`})
          }
        } catch(error){
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 400,
                body: JSON.stringify({message: error.message})
            }
        }

    } catch(error) {
        return{
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error"})
        }
    }

} 
//login lambda function using aws cognito
module.exports.logIn = async (event) => {
    try {
        
        if (!event.body) {
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 400,
                body: JSON.stringify({ message: 'Please supply valid JSON data' })
            };
        }
        const requestBody = JSON.parse(event.body);
       const {email, password} = requestBody;
        const authenticationData = {
            Username: email,
            Password: password
        }
       //authenticate user with cognito if user is authenticate log user in and start a session
       const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
       const userData = {
        Username: email,
        Pool: userPool
       }
       const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
       try {
       
        const session = await new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (session) => {
                    // User is authenticated, you can resolve the session here.
                    resolve(session);
                    
                },
                onFailure: (err) => {
                    // Authentication failed, handle the error here.
                    reject(err);
                },
            });
        });
        
        //user is logged in and authenticated get user ID, access token, refresh token, id token
        const userID = session.getIdToken().payload.sub
        const accessToken = session.getAccessToken().getJwtToken();
        const idToken = session.getIdToken().getJwtToken();
        const refreshToken = session.getRefreshToken().getToken()
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 200,
            body: JSON.stringify({user: userID, tokens: {accessToken:accessToken, idToken: idToken, refreshToken: refreshToken}})
        }
        
       } catch (error) {
        
        return {
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 401,
            body: JSON.stringify({ message: error.message }) //change to login failed
        };
       }
    } catch (error) {
        
        return{
            headers: {
                'Access-Control-Allow-Origin': '*',
               
              },
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" })
        }
        
    }
}

//lambda function for sign out
module.exports.logOut = async (event) =>{
try {
    
        if (!event.body) {
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 400,
                body: JSON.stringify({ message: 'Please supply valid JSON data' })
            };
        }
        const requestBody = JSON.parse(event.body);
        if(!requestBody.accessToken){
            return{
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 404,
                body:JSON.stringify({message: 'Please supply access token'})
            }
        }
        if(!requestBody.idToken){
            return{
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 404,
                body:JSON.stringify({message: 'Please supply ID token'})
            }
        }
        if(!requestBody.refreshToken){
            return{
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 404,
                body:JSON.stringify({message: 'Please supply refresh token'})
            }
        }
        if(!requestBody.userId){
            return{
                headers: {
                    'Access-Control-Allow-Origin': '*',
                   
                  },
                statusCode: 404,
                body:JSON.stringify({message: 'Please supply valid user id'})
            }
        }

        const {accessToken, idToken, refreshToken, userId} = requestBody;
        const userData = {
            Username: userId,
            Pool: userPool
        }
        //create access token
        const AccessToken = new AmazonCognitoIdentity.CognitoAccessToken({AccessToken: accessToken});
        const IdToken = new  AmazonCognitoIdentity.CognitoIdToken({IdToken: idToken})
        const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: refreshToken});
       const session = new AmazonCognitoIdentity.CognitoUserSession({
        IdToken: IdToken,
        AccessToken: AccessToken,
        RefreshToken: RefreshToken
    });
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.setSignInUserSession(session)
        //sign out the user
       let statusCode;
       let responseBody;
       await new Promise((resolve, reject) => {
        cognitoUser.globalSignOut({
            onSuccess: () => {
                statusCode = 200;
                responseBody = { message: 'User signed out successfully' };
                resolve();
            },
            onFailure: (error) => {
                statusCode = 400;
                responseBody = { error: 'Failed to sign out the user' };
                resolve();
            }
        });
    });
    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
           
          },
            statusCode,
            body: JSON.stringify(responseBody)
        };
} catch (error) {

    return{
        headers: {
            'Access-Control-Allow-Origin': '*',
           
          },
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" })
    }
    
}
}
//lambda function to automatically verify users
module.exports.autoConfirmUsers = (event, context, callback) => {
    if (event.request.userAttributes && event.request.userAttributes.email) {
      event.response.autoConfirmUser = true;
      event.response.autoVerifyEmail = true;
    }
    callback(null, event);
  };