import { it, describe, afterAll, beforeAll, beforeEach, expect, afterEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'


beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(async () => {
  execSync('npm run knex -- migrate:rollback --all') //limpa toda migrate
  execSync('npm run knex -- migrate:latest') //executa toda migrate
})



describe('Snacks routes', async () => {

  it("Should create snack related user", async () => {
    const { body } = await request(app.server)
      .post('/users/create')
      .send({
        username: "Gabriels",
        password: "123456789"
      })


    const { id } = body

    await request(app.server)
      .post('/snacks/create')
      .send({
        name: "Feijao",
        idUser: id,
        description: "Testando feijao",
        dateAndTime: new Date("2023-05-05 22:56:07"),
        diet: true
      })
      .expect(204)



  })

  it("Should list snacks related user", async () => {
    const { body } = await request(app.server)
      .post('/users/create')
      .send({
        username: "Gabriels",
        password: "123456789"
      })


    const { id } = body

    await request(app.server)
      .post('/snacks/create')
      .send({
        name: 'Feijao',
        idUser: id,
        description: 'Testando feijao',
        dateAndTime: new Date('2023-05-05 22:56:07'),
        diet: false
      })

    await request(app.server)
      .post('/snacks/create')
      .send({
        name: 'Feijao 2',
        idUser: id,
        description: 'Testando feijao 2',
        dateAndTime: new Date('2023-05-05 22:56:07'),
        diet: true
      })

    await request(app.server)
      .post('/snacks/create')
      .send({
        name: 'Arroz',
        idUser: randomUUID(),
        description: 'Arroz do japão',
        dateAndTime: new Date('2023-05-05 22:56:07'),
        diet: true
      })

    const listSnacksByIdUser = await request(app.server)
      .get(`/snacks/${id}/list`)
      .expect(200)

    expect(listSnacksByIdUser.body.listAllSnacksFromId).toEqual([
      expect.objectContaining({
        name: 'Feijao',
        description: 'Testando feijao',
        dateAndTime: new Date('2023-05-05 22:56:07'),
      }),
      expect.objectContaining({
        name: 'Feijao 2',
        description: 'Testando feijao 2',
        dateAndTime: new Date('2023-05-05 22:56:07'),
      })
    ])



  })

  it("Should edit snacks by id", async () => {
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
        name: 'Feijao',
        idUser: idUser,
        description: 'Testando feijao',
        dateAndTime: new Date('2023-05-05 22:56:07'),
        diet: false
      })
    const { body: snackBody } = await request(app.server)
      .get(`/snacks/${idUser}/list`)

    const resulteSnack = await request(app.server)
      .put(`/snacks/${idUser}/edit/${snackBody.listAllSnacksFromId[0].id}`)
      .send({
        name: 'Arroz',
        description: 'Beterraba',
        dateAndTime: new Date('2023-05-05 22:56:07'),
        diet: true
      })

    expect(resulteSnack.body.snack).toEqual(1)

    const { body: snackUpdate } = await request(app.server)
      .get(`/snacks/${idUser}/list`)

    expect(snackUpdate.listAllSnacksFromId).toEqual([
      expect.objectContaining({
        name: 'Arroz',
        description: 'Beterraba',
      })
    ])



  })

  it("Should delete snacks by id", async () => {
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
        name: 'Feijao',
        idUser: idUser,
        description: 'Testando feijao',
        dateAndTime: new Date('2023-05-05 22:56:07'),
        diet: false
      })
    const { body: snackBody } = await request(app.server)
      .get(`/snacks/${idUser}/list`)

    const resulteSnack = await request(app.server)
      .delete(`/snacks/${idUser}/delete/${snackBody.listAllSnacksFromId[0].id}`)

    expect(resulteSnack.status).toEqual(200)

  })

  it("Should visualize one snacks by id", async () => {
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
    const { body: snackBody } = await request(app.server)
      .get(`/snacks/${idUser}/list`)

    const resulteSnack = await request(app.server)
      .get(`/snacks/${idUser}/list/${snackBody.listAllSnacksFromId[0].id}`)

    expect(resulteSnack.body.snack).toEqual(
      expect.objectContaining({
        name: 'Arroz com feijoada',
        description: 'Essa comida é muito típica',
      })
    )

  })

  it("Should metrics users", async () => {
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
        dateAndTime: '2023-05-05T14:56:13Z',
        diet: true
      })

      await request(app.server)
      .post('/snacks/create')
      .send({
        name: 'Arroz com s',
        idUser: idUser,
        description: 'Essa comida é sss muito típicas',
        dateAndTime: new Date('2023-05-05T14:56:13Z'),
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
        name: 'Arroz com feijoada',
        description: 'Essa comida é muito típica',
      })
    )

  })

})
