const Menu = [
  { spacer: true },
  {
    title: "Dashboard",
    icon: "home-outline",
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Users",
    icon: "account-group-outline",
    name: "Users",
    href: "/users",
  },
  {
    title: "Product Category",
    icon: "shape-outline",
    name: "Category",
    href: "/category",
  },
  {
    title: "Merchants",
    icon: "shape",
    name: "Merchants",
    href: "/merchant",
  },
  {
    title: "Companies",
    icon: "shape-plus",
    name: "Companies",
    href: "/company",
  },
  {
    title: "Credit",
    icon: "credit-card",
    name: "Credit",
    href: "/credit",
  },
  { divider: true },
  { spacer: true },
  {
    title: "Logout",
    icon: "login",
    href: "/login",
  },
  {
    title: "Sign Up",
    icon: "account-circle",
    href: "/signup",
  },
];
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      let textA = x.title.toUpperCase();
      let textB = y.title.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }
});

export default Menu;
