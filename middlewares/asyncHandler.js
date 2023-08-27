// This function creates an async handler.
// The async handler takes a controller function as an argument.
// The async handler calls the controller function and then resolves the promise
// with the result of the controller function.
// If the controller function throws an error, the async handler
// catches the error and passes it to the next middleware in the chain.

const asyncHandler = (controllerFunction) => (req, res, next) => {
   // This line resolves the promise with the result of the controller function.
   Promise.resolve(controllerFunction(req, res, next)).catch(next);
 };
 
 // This line exports the asyncHandler function.
 module.exports = asyncHandler;
