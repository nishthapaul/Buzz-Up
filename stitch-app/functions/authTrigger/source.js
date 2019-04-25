exports = function(authEvent){
  // Only run if this event is for a newly created user.
  if (authEvent.operationType !== "CREATE") { return }

  // Get the internal `user` document
  const { user } = authEvent;

  const users = context.services.get("mongodb-atlas")
    .db("mongohack")
    .collection("users");

  const isLinkedUser = user.identities.length > 1;

  if(isLinkedUser) {
    const { identities } = user;
    return users.updateOne(
      { id: user.id },
      { $set: { identities } }
    )

  } else {
    return users.insertOne({ _id: user.id, ...user })
     .catch(console.error)
  }
};