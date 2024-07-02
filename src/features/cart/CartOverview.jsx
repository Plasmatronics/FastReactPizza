import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getTotalCartQuantity } from "./cartSlice";
import { getTotalCartPrice } from "./cartSlice";

function CartOverview() {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);

  if (!totalCartQuantity) return null;

  return (
    <div className="flex items-center justify-between px-4 py-4 uppercase sm:px-6 bg-stone-800 text-stone-200 text-sm:px-6 md:text-base">
      <p className="space-x-4 font-semibold sm:space-x-6 text-stone-300">
        <span>{totalCartQuantity} Pizzas</span>
        <span>${totalCartPrice}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
