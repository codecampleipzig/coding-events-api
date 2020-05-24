module.exports = async(ctx, next) => {
  if (!ctx.state.user) {
    return ctx.forbidden();
  }
  const event = await strapi.services.event.findOne({ id: ctx.params.id });
  if (!event) {
    return ctx.notFound();
  }
  if (event.host.id != ctx.state.user.id) {
    return ctx.forbidden('You have to be the owner of this event');
  }

  return await next();
};