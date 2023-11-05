const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
 //defint cognito pool details
 const poolData = {
    userPoolId: 'ap-southeast-2_rBmwZee9w',
    ClientId: '3o1mick3e1el8jeg8imisqtjh5'
 }
 const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

//create router to register user using aws cognito
module.exports.registerUser = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        if (!requestBody) {
            return {
                statusCode: 400,
                body: JSON.stringify({ msg: 'Please supply valid JSON data' })
            };
        }
       
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
          const signUpResponse = await userPool.signUp({
            Username: email,
            Password: password,
            UserAttributes: attributeList,
          }).promise();
          return {
            statusCode: 200,
            body: JSON.stringify({ message: `Sign up successful for ${signUpResponse.UserSub}`})
          }
        } catch(error){
            return {
                stausCode: 400,
                body: JSON.stringify({message: 'User sign up failed'})
            }
        }

    } catch(error) {
        return{
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" })
        }
    }

} 
//login lambda function using aws cognito
module.exports.logIn = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
        if (!requestBody) {
            return {
                statusCode: 400,
                body: JSON.stringify({ msg: 'Please supply valid JSON data' })
            };
        }
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
            statusCode: 200,
            body: JSON.stringify({user: userID, tokens: {accessToken:accessToken, idToken: idToken, refreshToken: refreshToken}})
        }
        
       } catch (error) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Login failed' })
        };
       }
    } catch (error) {
        return{
            statusCode: 500,
            body: JSON.stringify({ error: "Internal server error" })
        }
        
    }
}

//lambda function for sign out
module.exports.logOut = async (event) =>{
try {
    const requestBody = JSON.parse(event.body);
        if (!requestBody) {
            return {
                statusCode: 400,
                body: JSON.stringify({ msg: 'Please supply valid JSON data' })
            };
        }
        if(!requestBody.accessToken){
            return{
                statusCode: 404,
                body:JSON.stringify({message: 'please supply access token'})
            }
        }
        if(!requestBody.idToken){
            return{
                statusCode: 404,
                body:JSON.stringify({message: 'please supply ID token'})
            }
        }
        if(!requestBody.refreshToken){
            return{
                statusCode: 404,
                body:JSON.stringify({message: 'please supply refresh token'})
            }
        }

        const {accessToken, idToken, refreshToken, userId} = requestBody;
        const userData = {
            Username: userId,
            pool: userPool
        }
        // Create the session objects
       // Validate the tokens and ensure they are associated with the user
       const session = new AmazonCognitoIdentity.CognitoUserSession({
        IdToken: idToken,
        AccessToken: accessToken,
        RefreshToken: refreshToken
    });
        const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.setSignInUserSession(session)
        //sign out the user
        cognitoUser.globalSignOut({
            onSuccess: () => {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'User signed out successfully' })
                };
            },
            onFailure: (error) => {
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Failed to sign out the user' })
                };
        }
    })
    
} catch (error) {
    return{
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error" })
    }
    
}
}