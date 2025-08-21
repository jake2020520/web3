import { currentUser } from "@clerk/nextjs/server";
import MenuLink from "./MenuLink";


const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  return (
    <div className="mt-4 text-sm">
      <MenuLink role={role}/>
    </div>
  );
};

export default Menu;
