import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('snacks', function (table){
    table.timestamp('dateAndTime').notNullable().alter()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('snacks', function (table){
    table.text('dateAndTime').notNullable().alter()
  })
}

