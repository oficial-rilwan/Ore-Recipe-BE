import { Convert } from "easy-currencies";

export default async function convertCurrency(amount: number = 0, currency: string = "NGN") {
  try {
    const value = await Convert(amount).from(currency).to("USD");
    return value;
  } catch (error) {
    console.error("Currency conversion failed:", error);
  }
}
