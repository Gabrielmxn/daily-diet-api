import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken"
import { knex } from '../knex/database'
import { z } from "zod";
import { randomUUID } from "crypto";
import { env } from "../env";
import { checkSessionIdExists } from "../middlewares/check-sessio-id-exists";

export async function usersRoutes(app: FastifyInstance){
  app.post('/create', async (request, reply) => {
    const createUsersBodySchema = z.object({ 
      username: z.string(),
      password: z.string(),
    })
    
    const { username, password} = createUsersBodySchema.parse(
      request.body
    )

    const user = await knex('users').select().where('username', username).first()
    console.log(user)

    if(user){
      throw new Error('Não é possível utilizar esse username.')
    }

    const passwordJwt = jwt.sign(password, env.JWT_SECRET)
  
    const idUser  = await knex('users')
      .insert({
        id: randomUUID(),
        username,
        password: passwordJwt
      })
      .returning('id')
      
      return {
        id: idUser[0].id
      }
  },)

  app.post('/auth', async (request, reply) =>{
    const usersAuthBodySchema = z.object({
      username: z.string(),
      password: z.string(),
    })

    const { username, password } = usersAuthBodySchema.parse(request.body)

    const user = await knex('users').where('username', username).first()

    if(!user){
      throw new Error()
    }

    const jwtViryfi = jwt.sign(password, env.JWT_SECRET) === user.password

    if(!jwtViryfi){
      throw new Error('Username or password do not match')
    }else{
      const sessionId = jwt.sign({username: username}, env.JWT_SECRET, {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      })

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }
    
    
   

    return reply.status(201).send()
  })
}