import prisma from '../tools/prisma.js';
import express from 'express';
var router = express.Router();

router.get('/', async function(req, res, next) {
  var users=[]
  switch (req.query.sort) {
    case 'name':
      users = await prisma.person.findMany({
        orderBy: [
          {
            name: 'asc',
          },
        ],
      })
      break;
    case 'email':
      users = await prisma.person.findMany({
        orderBy: [
          {
            email: 'asc',
          },
        ],
      })
      break;
    default:
      users = await prisma.person.findMany()
      break;
  }
  res.send(users)
  
  
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
    
    
});

router.post('/random', async function (req,res, next) {
  const user = await prisma.person.create({
    data: {
      email: req.body.email,
      name: req.body.name,
    },
  })
  res.send(user)
})



router.get('/:id', async function(req, res, next){
  const user = await prisma.person.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    })
  res.send(user)

});


 export default router;
