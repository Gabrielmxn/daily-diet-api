import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken"
import { knex } from '../knex/database'
import { z } from "zod";
import { randomUUID } from "crypto";
import { env } from "../env";
import { checkSessionIdExists } from "../middlewares/check-sessio-id-exists";

export async function snacksRoutes(app: FastifyInstance){ 
  app.post('/create', async (request, reply) => {
    const createSnacksBodySchema = z.object({ 
      name: z.string(),
      idUser: z.string(),
      description: z.string(),
      dateAndTime: z.string(),
      diet: z.boolean()
    })


    const { name, idUser, description, dateAndTime, diet } = createSnacksBodySchema.parse(
      request.body
    )
    
    const user = await knex('users').select().where('id', idUser).first()

    if (!user){
      throw new Error('Usuário não existe')
    }

    const createDiet = await knex('snacks').insert({
      id: randomUUID(), name, idUser: user.id, description, dateAndTime, diet
    })

    reply.status(200).send(createDiet)
  })

  app.get('/:idUser/list', async (request, reply) => {
    
    const listSnacksParamsSchema = z.object({
      idUser: z.string()
    })

    const { idUser } = listSnacksParamsSchema.parse(request.params)

    const listAllSnacksFromId = await knex('snacks').select().where('idUser', idUser)

    return {
      listAllSnacksFromId
    }
  })

  app.put('/:idUser/edit/:idSnack', async (request, reply) => {
    const editSnackParamsSchema = z.object({
      idUser: z.string(),
      idSnack: z.string(),
    })

    const editSnackBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      dateAndTime: z.string(),
      diet: z.boolean(),
    })

    const { idUser, idSnack } = editSnackParamsSchema.parse(request.params);

    const user = await knex('users').where('id', idUser).first()

    if (!user){
      throw new Error('user not found');
    }

    const { name, description, dateAndTime, diet } = editSnackBodySchema.parse(request.body)
    

    const snack = await knex('snacks').where({
      id: idSnack,
      idUser
    }).update({ name: name, description: description, dateAndTime: dateAndTime, diet: diet })
    
    return { snack}
  })
}
