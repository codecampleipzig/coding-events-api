module.exports = async(ctx, next) => {
  const attendance = await strapi.services.attendance.findOne({ user: ctx.request.body.user, event: ctx.request.body.event });
  if (attendance) {
    return ctx.forbidden('You can only attend once');
  }

  return await next();
};