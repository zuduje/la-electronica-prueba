import bcrypt from "bcrypt";

function verifyPassword(password:string, hashPassword:string) {
    return bcrypt.compare(password, hashPassword)
                 .then((isMatch:boolean) => {
                     return isMatch;
                  })
                 .catch((error) =>{
                    console.error(error);
                    return false;
                 });
};

export {verifyPassword}