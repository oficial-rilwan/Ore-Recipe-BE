export type UserProps = {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
};

export type RecipeProps = {
  _id: string;
  name: string;
  imageURL: string;
  ingredients: [{ name: string; price: number; quantity: string }];
  price: number;
  categories: string[];
  calories: number;
};
export type RestaurantProps = {
  _id: string;
  name: string;
  imageURL: string;
  location: number;
};
