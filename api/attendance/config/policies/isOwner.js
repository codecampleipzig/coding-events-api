module.exports = async(ctx, next) => {
  if (!ctx.state.user) {
    return ctx.forbidden();
  }
  const attendance = await strapi.services.attendance.findOne({ id: ctx.params.id });
  if (!attendance) {
    return ctx.notFound();
  }
  if (attendance.user.id != ctx.state.user.id) {
    return ctx.forbidden('You have to be the attendee to delete your attendance');
  }

  return await next();
};