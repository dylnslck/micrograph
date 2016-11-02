export default (ctx) => {
  if (!ctx.model) {
    throw new Error(
      'The Redink \'model\' method must be passed in as a global context variable to GraphQL.'
    );
  }
};
