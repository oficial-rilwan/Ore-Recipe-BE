import Repository from ".";
import User from "../models/user.model";

class UserRepository extends Repository {
  constructor() {
    super(User);
  }
}

export default UserRepository;
