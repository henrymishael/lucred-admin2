import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    token: window.localStorage.getItem("admin_token")
  })(store);
};