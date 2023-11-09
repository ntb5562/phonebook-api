import prisma from '../tools/prisma.js';
import express from 'express';
var router = express.Router();

// url?key=value ---- req.query.key

// url/mydata  ---- url/:myVar ---- req.params.myVar

// POST BODY - JSON data sent to the API

router.get('/', async function(req, res, next) {

  const users = await prisma.person.findMany()
  var user_return = []
  for (var i =0; i<users.length; i++){
    user_return.push(users[i].name)
  }
  res.send(user_return)
});


router.post('/', async function(req, res, next){
    
    const user = await prisma.person.create({
        data: {
          email: req.query.email,
          name: req.query.name,
        },
      })
      res.send(user)

});

router.delete('/:id', async function(req, res, next){
    
  const deleteUser = await prisma.person.delete({
    where: {
      id: parseInt(req.params.id),
    },
  })
    res.send(deleteUser)

});
router.patch('/:id', async function(req, res, next){
  const updateInfo = {

    address: req.query.address,
  };
  if (req.query.name !== '') {
    updateInfo.name = req.query.name;
  }
  if (req.query.email !== '') {
    updateInfo.email = req.query.email;
  }

  if (req.query.number.length>=10){
    updateInfo.number = req.query.number;
  }else{
    res.status(400).send({
      message: 'must enter number greater than 10 digits'
    });
    return;
  }

  const updateUser = await prisma.person.update({
    where: {
      id: parseInt(req.params.id),
      
    },
    data: updateInfo,
  })
    res.send(updateUser)
    // 2 things - status 200, sends back info as JSON

    // different status, a message instead
    
});

// using the post body
router.post('/random', async function (req,res, next) {
  const user = await prisma.person.create({
    data: {
      email: req.body.email,
      name: req.body.name,
    },
  })
  res.send(user)
})

// http://localhost:3001/person?sort=name

// HTTP methods everywhere, change to using post body,
// endpoint for get all users in db alphabatetically by name
router.get('/namesort', async function (req,res,next){

  // try native prisma sorting - https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting#sorting
  
  const users = await prisma.person.findMany()
  var user_name = []
  for (var i =0; i<users.length; i++){
    user_name.push(users[i])
  }
  function compare(a,b){
    if (a.name < b.name) return -1;
    if (a.name>b.name) return 1;
    return 0;
  }
  user_name = user_name.sort(compare)
  res.send(user_name)
  users.sort((a,b) => {
    return a.name > b.name;
  })
  
})
// // endpoint for gertting all users alphabetically by email
router.get('/emailsort', async function (req,res,next){
  const users = await prisma.person.findMany()
  var user_email = []
  for (var i =0; i<users.length; i++){
    user_email.push(users[i])
  }
  function compare(a,b){
    if (a.email<b.email)return -1;
    if (a.email>b.email)return 1;
    return 0;
  }
  res.send(user_email.sort(compare))
  
})
router.get('/:id', async function(req, res, next){
  const user = await prisma.person.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    })
  res.send(user)

});
// Test everything in postman


 export default router;
