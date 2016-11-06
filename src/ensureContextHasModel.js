export default (ctx) => {
  if (!ctx.model) {
    // TODO: Change error message if Redink is taken out of dependencies
    throw new Error(
      'The Redink \'model\' method must be passed in as a global context variable to GraphQL.'
    );
  }
};
