import { it, describe, afterAll, beforeAll, beforeEach, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'


beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(async () => {
  execSync('npm run knex migrate:rollback --all') //limpa toda migrate
  execSync('npm run knex migrate:latest') //executa toda migrate
})

describe('create users',async() => {
  it('should create user', async () => {
    await request(app.server)
      .post('/users/create')
      .send({
        username: "Gabriel",
        password: "123456789"
      }) 
      .expect(200)
  })


  it('should auth user', async () => {
    await request(app.server)
      .post('/users/create')
      .send({
        username: "Gabriel",
        password: "123456789"
      }) 
    
    await request(app.server)
      .post('/users/auth')
      .send({
        username: "Gabriel",
        password: "123456789"
      })
      .expect(200)
  })

  it('should return metrics', async () => {
    const { body } = await request(app.server)
    .post('/users/create')
    .send({
      username: "Gabriels",
      password: "123456789"
    })


  const { id: idUser } = body
  await request(app.server)
    .post('/snacks/create')
    .send({
      name: 'Arroz com feijoada',
      idUser: idUser,
      description: 'Essa comida é muito típica',
      dateAndTime: new Date('2023-05-05 22:56:07'),
      diet: false
    })

    await request(app.server)
    .post('/snacks/create')
    .send({
      name: 'Arroz com s',
      idUser: idUser,
      description: 'Essa comida é sss muito típicas',
      dateAndTime: new Date('2023-05-05 22:56:07'),
      diet: true
    })

    await request(app.server)
    .post('/snacks/create')
    .send({
      name: 'Arroz com s',
      idUser: idUser,
      description: 'Essa comida é sss muito típicas',
      dateAndTime: new Date('2023-05-05 22:56:07'),
      diet: true
    })

    await request(app.server)
    .post('/snacks/create')
    .send({
      name: 'Arroz com s',
      idUser: idUser,
      description: 'Essa comida é sss muito típicas',
      dateAndTime: new Date('2023-05-05 22:56:07'),
      diet: true
    })

    await request(app.server)
    .post('/snacks/create')
    .send({
      name: 'Arroz com s',
      idUser: idUser,
      description: 'Essa comida é sss muito típicas',
      dateAndTime: new Date('2023-04-01T14:56:13Z'),
      diet: true
    })
  
 
  const resulteSnack = await request(app.server)
    .get(`/users/metrics/${idUser}`)

  expect(resulteSnack.body).toEqual(
    expect.objectContaining({
     "metrics": expect.objectContaining({
      "registeredMeal": 5,
      "outDiet": 1,
      "inDiet": 4,
      "aSnack": expect.objectContaining({
        "snackTheDay": expect.arrayContaining([
          expect.objectContaining({
            name: 'Arroz com s',
            idUser: idUser
          })
        ]
         
        )
      }
        
      )   
    })
    })
  )

})
  })





