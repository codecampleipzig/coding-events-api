'use strict';
const { sanitizeEntity, parseMultipartData } = require('strapi-utils');


module.exports = {

  async create(ctx) {
    const host = ctx.state.user.id;
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.event.create({...data, host}, { files });
    } else {
      entity = await strapi.services.event.create({...ctx.request.body, host});
    }
    return sanitizeEntity(entity, { model: strapi.models.event });
  },

  async random(ctx) {
    const events = await strapi.services.event.find({}, ['attendees.user']);
    if (events.length == 0) {
      ctx.notFound();
      return null;
    }
    else {
      const randomIndex = Math.floor(Math.random() * events.length);
      return sanitizeEntity(events[randomIndex], {model: strapi.models.event});
    }
  },
  async find(ctx) {
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.event.search(ctx.query);
    } else {
      entities = await strapi.services.event.find(ctx.query);
    }

    for(const event of entities) {
      event.attendees = (await strapi.services.attendance.find({event: event.id})).map(attendance => {delete attendance.event; return attendance;});
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.event }));
  },
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.event.findOne({ id }, ['attendees.user']);
    return sanitizeEntity(entity, { model: strapi.models.event });
  },
};
