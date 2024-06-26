import React, {
  createContext,
  useMemo,
  useState,
  useContext,
} from "react";
import noop from "lodash/noop";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string } | {};

// Додати тип Menu Selected
type MenuSelected = {
  selectedMenu: Menu;
};

const MenuSelectedContext = createContext<MenuSelected>({
  selectedMenu: {},
});

// Додайте тип MenuAction
type MenuAction = {
  onSelectedMenu: (selectedMenu: Menu) => void;
};

const MenuActionContext = createContext<MenuAction>({
  onSelectedMenu: noop,
});

type PropsProvider = {
  children: React.ReactNode; // Додати тип для children
};

function MenuProvider({ children }: PropsProvider) {
  // Додати тип для SelectedMenu він повинен містити { id }
  type SelectedMenu = {
    id?: MenuIds;
    title?: string;
  };
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu | {}>(
    {}
  );

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[]; // Додайте вірний тип для меню
};

type PropsSelectedMenu = {
  id?: MenuIds;
  title?: string;
};

type SelectedMenu = {
  selectedMenu: Menu;
  id: MenuIds;
};

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useContext(MenuActionContext);
  const { selectedMenu } = useContext(MenuSelectedContext);

  return (
    <>
      {menus.map((menu: PropsSelectedMenu) => (
        <div
          key={menu.id}
          onClick={() => onSelectedMenu({ id: menu.id })}
        >
          {menu.title}{" "}
          {(selectedMenu as SelectedMenu).id === menu.id
            ? "Selected"
            : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
