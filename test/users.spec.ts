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
      .expect(201)
  })
})




