module.exports = function softDeleteMiddleware(schema) {
  // Add a field to track deleted status
  schema.add({
    deleted: {
      type: Boolean,
      default: false,
    },
  })
  // Add a method to set the deleted flag
  schema.methods.softDelete = function () {
    this.deleted = true;
    return this.save();
  };
  // Add a static method to find non-deleted documents
  schema.statics.findNotDeleted = function (conditions = {}) {
    return this.find({ ...conditions, deleted: false });
  };
  // Add a static method to find all documents, including deleted ones
  schema.statics.findWithDeleted = function (conditions = {}) {
    return this.find(conditions);
  };
};

