import _ from "lodash";
import Repository from ".";
import Restaurant from "../models/restaurant.model";
import RestaurantSearch from "../models/restaurant-search.model";

class RestaurantRepository extends Repository {
  constructor() {
    super(Restaurant);
  }
}

export class RestaurantSearchRepository extends Repository {
  constructor() {
    super(RestaurantSearch);
  }
}

export default RestaurantRepository;
