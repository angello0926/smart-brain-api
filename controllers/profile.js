const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}


const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { name, pet, age } = req.body.formInput
  db('users')
    .where({ id })
    .update({ name })
    .then(resp => {
      if (res) {
        res.status(200).json("success")
      } else {
        res.status(400).json('Unable to update')
      }
    })
    .catch(err => 
      {
        console.log(err);
        res.status(400).json("error occurs")
      })
}

module.exports = {
  handleProfileGet,
  handleProfileUpdate
}