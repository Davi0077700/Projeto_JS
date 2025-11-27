exports.up = async function(knex) {
  await knex.schema.createTable('agendamento', (table) => {
    table.increments('id').primary();
    table.string('patient_name', 255).notNullable();
    table.string('service', 255).notNullable();
    table.dateTime('date').notNullable();
    table.string('status', 50).notNullable().defaultTo('agendada');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('agendamento');
};
