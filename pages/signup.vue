<template>
  <v-app id="login" class="primary">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center mb-9">
                  <img src="../static/m2.png" alt="Lucred Admin" width="200" />
                  <!-- <h1 class="flex my-4 primary--text">Material Admin Template</h1> -->
                </div>
                <v-form>
                  <v-text-field
                    append-icon="mail"
                    name="email"
                    label="Email"
                    type="text"
                    v-model="model.email"
                  ></v-text-field>
                  <v-text-field
                    append-icon="lock"
                    name="password"
                    label="Password"
                    id="password"
                    type="password"
                    v-model="model.password"
                  ></v-text-field>
                  <v-text-field
                    append-icon="person"
                    name="fullname"
                    label="Fullname"
                    id="fullname"
                    type="text"
                    v-model="model.fullname"
                  ></v-text-field>
                  <v-select
                    name="gender"
                    label="Gender"
                    id="gender"
                    type="text"
                    v-model="model.gender"
                    :items="['MALE', 'FEMALE']"
                  ></v-select>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#66AC4C" @click="signup" :loading="loading"
                  >Sign Up</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  layout: "default",
  data: () => ({
    loading: false,
    model: {
      email: "",
      password: "",
    },
  }),

  methods: {
    signup() {
      this.loading = true;
      const obj = {
        email: this.model.email.toLowerCase(),
        password: this.model.password,
        fullname: this.model.fullname,
        gender: this.model.gender,
      };
      this.$axios
        .post("admin", obj)
        .then((res) => {
          // console.log(res);
          const { data } = res;
          this.loading = false;
    // console.log(data);
          if (data?.statusCode === 200) {
            this.$router.push("/login");
            this.$store.commit("snackbar/show", {
              text: data.message,
              icon: "success",
            });
          } else if (data?.state === "ERROR") {
            this.$store.commit("snackbar/show", {
              text: data.message,
              icon: "success",
            });
            return;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          const { response } = err;
    // console.log(err, response);
          this.$store.commit("snackbar/show", {
            text: response.data.message,
            icon: "error",
          });
        });
    },
  },
};
</script>
<style scoped lang="css">
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
</style>
