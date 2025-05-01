<template>
  <div class="companies-dashboard">
    <!-- Header with search and add button -->
    <div class="header-section">
      <h1 class="text-h4 font-weight-bold mb-4">Companies Management</h1>
      <v-row align="center" class="mb-6">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="0" class="search-card">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search companies"
              hide-details
              outlined
              dense
              clearable
              class="search-field"
            />
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-btn color="primary" @click="createItem()" class="px-4">
            <v-icon left>mdi-plus</v-icon>
            Add Company
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Main data table -->
    <v-card class="companies-table-card">
      <v-data-table
        :headers="headers"
        :items="Companies"
        :search="search"
        :loading="loading"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100],
          'items-per-page-text': 'Companies per page',
        }"
        class="elevation-0"
      >
        <template v-slot:top>
          <v-toolbar flat class="py-2">
            <v-toolbar-title class="text-h6 font-weight-bold"
              >Companies List</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined class="ml-2">
              <v-icon left>mdi-export</v-icon>
              Export
            </v-btn>
          </v-toolbar>
        </template>

        <!-- Company logo -->
        <template v-slot:item.logo="{ item }">
          <v-avatar size="40" color="grey lighten-3" class="mr-2">
            <v-img v-if="item.logo" :src="item.logo" alt="Company logo"></v-img>
            <v-icon v-else color="grey darken-2">mdi-domain</v-icon>
          </v-avatar>
        </template>

        <!-- Format date -->
        <template v-slot:item.createdAt="{ item }">
          {{ timeConvert(item.createdAt) }}
        </template>

        <!-- Actions column -->
        <template v-slot:item.actions="{ item }">
          <div class="actions-container">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  @click="viewItem(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>View Details</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="success"
                  v-bind="attrs"
                  v-on="on"
                  @click="editItem(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit Company</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="info"
                  v-bind="attrs"
                  v-on="on"
                  @click="createHr(item.companyId)"
                >
                  <v-icon>mdi-account-plus</v-icon>
                </v-btn>
              </template>
              <span>Add HR</span>
            </v-tooltip>
          </div>
        </template>

        <!-- Loading state -->
        <template v-slot:no-data>
          <div class="d-flex justify-center align-center pa-4">
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="primary"
            ></v-progress-circular>
            <span v-else>No companies found</span>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Company Details Dialog -->
    <v-dialog v-model="dialog" max-width="900px" scrollable persistent>
      <v-card>
        <v-card-title class="primary darken-1 white--text">
          <span class="text-h5">{{ formTitle }}</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4">
          <v-form ref="form" v-model="formValid">
            <v-row>
              <!-- Left column with basic info -->
              <v-col cols="12" md="6">
                <!-- ID and Date (view/edit mode only) -->
                <v-row v-if="!createMode">
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem._id"
                      label="ID"
                      outlined
                      dense
                      disabled
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :value="timeConvert(editedItem.createdAt)"
                      @input="editedItem.createdAt = $event"
                      label="Created Date"
                      outlined
                      dense
                      disabled
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- Basic Information Section -->
                <div class="section-title mb-2">Company Information</div>

                <v-text-field
                  v-model="editedItem.name"
                  label="Company Name"
                  outlined
                  dense
                  :disabled="viewMode"
                  :rules="[(v) => !!v || 'Company name is required']"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.emailAddress"
                      label="Email Address"
                      outlined
                      dense
                      :disabled="viewMode"
                      :rules="[
                        (v) => !!v || 'Email is required',
                        (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                      ]"
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.phoneNumber"
                      label="Phone Number"
                      outlined
                      dense
                      :disabled="viewMode"
                      hide-details="auto"
                      class="mb-4"
                      placeholder="+234 900 000 0000"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-text-field
                  v-model="editedItem.cacNumber"
                  label="CAC Number"
                  outlined
                  dense
                  :disabled="viewMode"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.city"
                      label="City"
                      outlined
                      dense
                      :disabled="viewMode"
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.country"
                      label="Country"
                      outlined
                      dense
                      :disabled="viewMode"
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-textarea
                  v-model="editedItem.address"
                  label="Address"
                  outlined
                  dense
                  :disabled="viewMode"
                  auto-grow
                  rows="3"
                  hide-details="auto"
                  class="mb-4"
                ></v-textarea>
              </v-col>

              <!-- Right column with stats and logo -->
              <v-col cols="12" md="6">
                <!-- Company Stats Section -->
                <div class="section-title mb-2">Company Statistics</div>

                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="editedItem.totalEmployees"
                      label="Total Employees"
                      outlined
                      dense
                      :disabled="viewMode"
                      type="number"
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="editedItem.totalHR"
                      label="Total HR"
                      outlined
                      dense
                      :disabled="viewMode"
                      type="number"
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="editedItem.payDay"
                      label="Pay Day"
                      outlined
                      dense
                      :disabled="viewMode"
                      type="number"
                      hide-details="auto"
                      class="mb-4"
                      placeholder="e.g. 25"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- Logo Upload -->
                <div class="section-title mb-2 mt-4">Company Logo</div>
                <div class="text-center mb-4">
                  <v-card
                    class="mx-auto image-upload-card"
                    :class="{ 'image-upload-disabled': viewMode }"
                    height="150"
                    width="150"
                    outlined
                    :ripple="!viewMode"
                    @click="!viewMode && $refs.logoInput.click()"
                  >
                    <v-img
                      v-if="logo || editedItem.logo"
                      :src="logo || editedItem.logo"
                      height="100%"
                      width="100%"
                      contain
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                    <v-row
                      v-else
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <div class="text-center">
                        <v-icon size="48" color="grey lighten-1"
                          >mdi-image-plus</v-icon
                        >
                        <div class="caption mt-2 grey--text text--darken-1">
                          {{ viewMode ? "No logo" : "Click to upload logo" }}
                        </div>
                      </div>
                    </v-row>
                    <v-overlay
                      :value="profileUploading"
                      absolute
                      :opacity="0.7"
                    >
                      <v-progress-circular
                        indeterminate
                        size="64"
                      ></v-progress-circular>
                    </v-overlay>
                  </v-card>
                  <input
                    ref="logoInput"
                    type="file"
                    accept="image/*"
                    class="d-none"
                    @change="uploadProfilePhoto($event.target.files[0])"
                  />
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="close">
            {{ viewMode ? "Close" : "Cancel" }}
          </v-btn>
          <v-btn
            v-if="!viewMode"
            color="primary"
            :loading="loading"
            :disabled="!formValid"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create HR Dialog -->
    <v-dialog v-model="createHrMode" max-width="600px" persistent>
      <v-card>
        <v-card-title class="primary darken-1 white--text">
          <span class="text-h5">Create HR</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4">
          <v-form ref="hrForm" v-model="hrFormValid">
            <v-row>
              <v-col cols="12">
                <div class="section-title mb-2">HR Information</div>

                <v-text-field
                  v-model="HrItem.name"
                  label="HR Name"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Name is required']"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>

                <v-text-field
                  v-model="HrItem.emailAddress"
                  label="Email Address"
                  outlined
                  dense
                  :rules="[
                    (v) => !!v || 'Email is required',
                    (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                  ]"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>

                <v-text-field
                  v-model="HrItem.phoneNumber"
                  label="Phone Number"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Phone number is required']"
                  hide-details="auto"
                  class="mb-4"
                  placeholder="+234 900 000 0000"
                ></v-text-field>

                <v-text-field
                  v-model="HrItem.password"
                  label="Password"
                  outlined
                  dense
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  :rules="[
                    (v) => !!v || 'Password is required',
                    (v) =>
                      v.length >= 6 || 'Password must be at least 6 characters',
                  ]"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="close">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!hrFormValid"
            @click="saveHr"
          >
            Create HR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this company? This action cannot be
          undone and will remove all associated data.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn
            color="error"
            text
            :loading="loading"
            @click="deleteItemConfirm"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar"
      :timeout="6000"
      :color="snackbarColor"
      top
      right
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import moment from "moment";
import todos from "@/static/logic";

export default {
  layout: "dashboard",
  name: "CompaniesManagement",

  data: () => ({
    loading: false,
    formValid: true,
    hrFormValid: true,
    search: null,
    dialog: false,
    dialogDelete: false,
    createHrMode: false,
    createMode: true,
    editMode: false,
    viewMode: false,
    showPassword: false,

    headers: [
      { text: "Logo", value: "logo", sortable: false, width: "80px" },
      { text: "Company Name", value: "name", sortable: true },
      { text: "Email", value: "emailAddress", sortable: true },
      { text: "Phone", value: "phoneNumber", sortable: true },
      { text: "Total Employees", value: "totalEmployees", sortable: true },
      { text: "Created Date", value: "createdAt", sortable: true },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "120px",
      },
    ],

    Companies: [],
    id: "",
    editedIndex: -1,

    editedItem: {
      _id: "",
      createdAt: "",
      name: "",
      address: "",
      city: "",
      country: "",
      payDay: "",
      emailAddress: "",
      totalEmployees: "",
      cacNumber: "",
      totalHR: "",
      phoneNumber: "",
      logo: null,
    },

    defaultItem: {
      _id: "",
      createdAt: "",
      name: "",
      address: "",
      city: "",
      country: "",
      payDay: "",
      emailAddress: "",
      totalEmployees: "",
      cacNumber: "",
      totalHR: "",
      phoneNumber: "",
      logo: null,
    },

    HrItem: {
      name: "",
      phoneNumber: "",
      emailAddress: "",
      password: "",
      companyId: "",
    },

    profileUploading: false,
    profileUploadError: false,
    logo: null,
    imageChanged: false,
    companyId: "",

    snackbar: false,
    snackbarColor: "success",
    snackbarText: "",
  }),

  computed: {
    token() {
      return this.$store.state.token;
    },
    formTitle() {
      if (this.editMode) return "Edit Company";
      if (this.createMode) return "Create Company";
      return "View Company";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    createHrMode(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    timeConvert(time) {
      if (!time) return "N/A";
      return moment(time).format("MMMM Do YYYY, h:mm:ss a");
    },

    showSnackbar(text, color = "success") {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.snackbar = true;
    },

    async initialize() {
      try {
        this.loading = true;
        const response = await this.$axios.get(
          "admin/companies?size=99999999999999",
          {
            headers: {
              "x-admin-token": this.token,
            },
          }
        );
        this.Companies = response.data.data;
      } catch (error) {
        this.showSnackbar("Failed to load companies data", "error");
        console.error("Error loading companies:", error);
      } finally {
        this.loading = false;
      }
    },

    createItem() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.createMode = true;
      this.viewMode = false;
      this.editMode = false;
      this.logo = null;
      this.imageChanged = false;
      this.dialog = true;
    },

    async editItem(item) {
      this.editedIndex = this.Companies.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.createMode = false;
      this.viewMode = false;
      this.editMode = true;
      this.logo = null;
      this.imageChanged = false;
      this.dialog = true;
    },

    async createHr(id) {
      this.HrItem = {
        name: "",
        phoneNumber: "",
        emailAddress: "",
        password: "",
        companyId: "",
      };
      this.companyId = id;
      this.createHrMode = true;
    },

    async viewItem(item) {
      this.editedIndex = this.Companies.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.createMode = false;
      this.editMode = false;
      this.viewMode = true;
      this.dialog = true;
    },

    deleteItem(item) {
      this.id = item._id;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        this.loading = true;
        const response = await this.$axios.delete(`categories/${this.id}`, {
          headers: {
            "x-admin-token": this.token,
          },
        });

        if (response.data.statusCode === 200) {
          this.showSnackbar(
            response.data.message || "Company deleted successfully"
          );
          this.initialize();
        } else {
          this.showSnackbar(
            response.data.message || "Failed to delete company",
            "error"
          );
        }
      } catch (error) {
        this.showSnackbar("Failed to delete company", "error");
        console.error("Error deleting company:", error);
      } finally {
        this.loading = false;
        this.closeDelete();
      }
    },

    close() {
      this.dialog = false;
      this.createHrMode = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.HrItem = {
          name: "",
          phoneNumber: "",
          emailAddress: "",
          password: "",
          companyId: "",
        };
      });
      this.createMode = true;
      this.imageChanged = false;
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async save() {
      try {
        this.loading = true;
        const formData = new FormData();

        formData.append("name", this.editedItem.name);
        formData.append("address", this.editedItem.address);
        formData.append("totalEmployees", this.editedItem.totalEmployees);
        formData.append("emailAddress", this.editedItem.emailAddress);
        formData.append("cacNumber", this.editedItem.cacNumber);
        formData.append("totalHR", this.editedItem.totalHR);
        formData.append("city", this.editedItem.city);
        formData.append("country", this.editedItem.country);
        formData.append("payDay", this.editedItem.payDay);
        formData.append("phoneNumber", this.editedItem.phoneNumber);

        let response;

        if (this.editMode) {
          if (this.imageChanged) {
            formData.append("logo", this.editedItem.logo);
          }
          response = await todos.put(
            `categories/${this.editedItem._id}`,
            formData
          );
        } else {
          formData.append("logo", this.editedItem.logo);
          response = await todos.upload("admin/create-company", formData);
        }

        if (response.data.statusCode === 200) {
          this.showSnackbar(
            this.editMode
              ? "Company updated successfully"
              : "Company created successfully"
          );
          this.initialize();
          this.close();
        } else {
          this.showSnackbar(
            response.data.message || "Operation failed",
            "error"
          );
        }
      } catch (error) {
        this.showSnackbar(
          "Operation failed. Please check your inputs and try again.",
          "error"
        );
        console.error("Error saving company:", error);
      } finally {
        this.loading = false;
      }
    },

    async saveHr() {
      try {
        this.loading = true;

        const payload = {
          name: this.HrItem.name,
          emailAddress: this.HrItem.emailAddress,
          phoneNumber: this.HrItem.phoneNumber,
          password: this.HrItem.password,
          companyId: this.companyId,
        };

        const response = await todos.post("admin/create-hr", payload);

        if (response.data.statusCode === 200) {
          this.showSnackbar("HR created successfully");
          this.initialize();
          this.close();
        } else {
          this.showSnackbar(
            response.data.message || "Failed to create HR",
            "error"
          );
        }
      } catch (error) {
        this.showSnackbar(
          "Failed to create HR. Please check your inputs and try again.",
          "error"
        );
        console.error("Error creating HR:", error);
      } finally {
        this.loading = false;
      }
    },

    uploadProfilePhoto(file) {
      if (!file) return;

      this.profileUploading = true;
      this.imageChanged = true;
      this.editedItem.logo = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.logo = e.target.result;
        this.profileUploading = false;
      };

      reader.onerror = () => {
        this.profileUploading = false;
        this.profileUploadError = true;
        this.showSnackbar("Failed to load image", "error");
      };

      reader.readAsDataURL(file);
    },
  },
};
</script>

<style scoped>
.companies-dashboard {
  padding: 24px;
}

.header-section {
  margin-bottom: 24px;
}

.search-card {
  background-color: transparent !important;
  box-shadow: none !important;
}

.companies-table-card {
  border-radius: 8px;
}

.actions-container {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.image-upload-card {
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.image-upload-card:hover:not(.image-upload-disabled) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

.image-upload-disabled {
  cursor: default;
}

/* Dark mode support */
.theme--dark .section-title {
  color: rgba(255, 255, 255, 0.7);
}
</style>
