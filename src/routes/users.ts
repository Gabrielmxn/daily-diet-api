import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken"
import { knex } from '../knex/database'
import { z } from "zod";
import { randomUUID } from "crypto";
import { env } from "../env";
import { checkSessionIdExists } from "../middlewares/check-sessio-id-exists";

export async function usersRoutes(app: FastifyInstance){
  app.post('/', async (request, reply) => {
    //const { sessionId } = request.cookies

    const createUsersBodySchema = z.object({ 
      username: z.string(),
      password: z.string(),
    })
    
    const { username, password} = createUsersBodySchema.parse(
      request.body
    )

    const passwordJwt = jwt.sign(password, env.JWT_SECRET)
  
    const users = await knex('users')
      .insert({
        id: randomUUID(),
        username,
        password: passwordJwt
      })
      .returning('*')

      console.log(users)
    return {
      users,
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
      const sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }
    
    
   

    return reply.status(201).send()
  })
}