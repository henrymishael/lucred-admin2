export const state = () => ({
  drawer: true,
  isSignedIn: false,
  admin: null,
  token: null,
});

export const mutations = {
  toggleDrawer(state) {
    state.drawer = !state.drawer;
  },
  drawer(state, val) {
    state.drawer = val;
  },
  setAdmin(state, admin) {
    state.admin = admin || null;
    state.isSignedIn = !!admin;
    state.token = admin.token;
  },
};

export const getters = {
  isSignedIn(state) {
    return state.isSignedIn;
  },
};
