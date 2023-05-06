// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'
table.uuid('id').primary()
table.text('idUser').notNullable()
table.text('name').notNullable()
table.text('description').notNullable()
table.text('dateAndTime').notNullable()
table.boolean('diet').defaultTo(false)
table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      username: string
      password: string
      created_at: string
    },
    snacks: {
      id: string
      idUser: string
      name: string
      description: string
      dateAndTime: timestamp
      diet: boolean
      created_at: timestamp
    }
  }
}