import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "../menu/MenuItem";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
  // all we want to do is call the getMenu function which fetches data from a menu API (jonas' menu API)
  const menu = await getMenu();
  return menu;
  // all we want to do is return this data
}

function Menu() {
  const menu = useLoaderData();

  return (
    <ul className="px-2 divide-y divide-stone-200">
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}

export default Menu;
