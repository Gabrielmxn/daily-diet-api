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
  it("Create snack", async () => {
    const { body } = await request(app.server)
    .post('/users/create')
    .send({
      username: "Gabriels",
      password: "123456789"
    }) 
    
    
    const { id } = body
    console.log(id)
    await request(app.server)
      .post('/snacks/create')
      .send({
        name: "Feijao", 
        idUser: id, 
        description: "Testando feijao" , 
        dateAndTime: "22023-05-01T14:56:13Z", 
        diet: true
      })
      .expect(200)
    

    
  })
})
