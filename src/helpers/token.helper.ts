import jwt from 'jsonwebtoken';

function decoded(token:string|string[]|undefined){
  if(!Array.isArray(token) && token){
      let tokenNormalize:string = normalizeToken(token);
      let secretPassword = process.env.SECRET_PASSWORD || "SECRET", email:string, password:string;
      return jwt.verify(tokenNormalize, secretPassword, function (error:any, decoded:any){
          if(error){
              console.error(error);
              return false
          }

          return decoded;
      });
  }else{
      return false
  }
}

function normalizeToken(token:string){
    let tempToken:string[] = token.split(" ");
    return tempToken[1];
}

export {decoded, normalizeToken}