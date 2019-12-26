const jwt = require('jsonwebtoken');
const redis = require('redis')

//set up redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      console.log(data);
        if (data[0]) {
          const isValid = bcrypt.compareSync(password, data[0].hash);
          if (isValid) {
            return db.select('*').from('users')
              .where('email', '=', email)
              .then(user => user[0])
              .catch(err => {
                console.log(err); 
                Promise.reject('unable to get user');
              })
          } else {
            Promise.reject('wrong credentials')
          }
      }else{
        Promise.reject('no such an user');
      }
      
    })
    .catch( err => {
      console.log(err);
      Promise.reject('wrong credentials')
    })
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply){
      return res.status(401).json('Unauthorized');
    }
    return res.json({id: reply})
  })
}

const setToken = (key, value) =>{
  return Promise.resolve(redisClient.set(key, value))
}

const createSession = (user) => {
  //JWT token, return user data
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
          .then(() =>  {
            return { success: 'true', id, token}
          })
          .catch(err => console.log(err));
}

const signToken = (email) => {
  const jwtPayload = { email }
  //secret should go as a process.env variable
  return jwt.sign(jwtPayload, 'JWT-secret', { expiresIn: '2 days'});
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res) : 
  handleSignin(db, bcrypt, req, res)
    .then(data => {
        if(data){
          return data.id && data.email ? createSession(data) : Promise.reject(data)
        }else{
          res.status(400).json(data)
        }
    })
    .then( session => res.json(session))
    .catch(err => {
      console.log(err)
      res.status(400).json('error occur')
    });
}
module.exports = {
  handleSignin,
  signinAuthentication,
  redisClient
}