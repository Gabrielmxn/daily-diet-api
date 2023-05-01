import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snacks', (table) => {
    table.uuid('id').primary()
    table.text('idUser').notNullable()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.text('dateAndTime').notNullable()
    table.boolean('diet').defaultTo(false)
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snacks')
}

