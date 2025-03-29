import _ from "lodash";
import Repository from ".";
import Restaurant from "../models/restaurant.model";

class RestaurantRepository extends Repository {
  constructor() {
    super(Restaurant);
  }
}

export default RestaurantRepository;
