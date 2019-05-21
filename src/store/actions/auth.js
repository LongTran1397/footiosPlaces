import { TRY_AUTH } from './actionTypes';

export const tryAuth = (authData) => {
    return dispatch => {
        dispatch(authSignup(authData));
    };
};

export const authSignup = (authData) => {
    return dispatch => {
        fetch("https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyD2TLX0tvJFrydRcAfrmiVKiSSij0i3nz4", {
            method: "POST",
            body: JSON.stringify({
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .catch(err => {
            console.log(err);
            alert("Authentication failed, please try again!");
        })
        .then(res => res.json())
        .then(parsedRes => {
            console.log(parsedRes);
        });
    };
};

// AIzaSyD2TLX0tvJFrydRcAfrmiVKiSSij0i3nz4