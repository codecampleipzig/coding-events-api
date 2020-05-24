module.exports = async(ctx, next) => {
  if (!ctx.state.user) {
    return ctx.forbidden();
  }
  ctx.request.body.user = ctx.state.user.id;
  return await next();
};