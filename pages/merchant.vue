<template>
  <div class="merchants-dashboard">
    <!-- Header with search and add button -->
    <div class="header-section">
      <h1 class="text-h4 font-weight-bold mb-4">Merchants Management</h1>
      <v-row align="center" class="mb-6">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="0" class="search-card">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search merchants"
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
            Add Merchant
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Main data table -->
    <v-card class="merchants-table-card">
      <v-data-table
        :headers="headers"
        :items="Merchants"
        :search="search"
        :loading="loading"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100],
          'items-per-page-text': 'Merchants per page',
        }"
        class="elevation-0"
      >
        <template v-slot:top>
          <v-toolbar flat class="py-2">
            <v-toolbar-title class="text-h6 font-weight-bold"
              >Merchants List</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined class="ml-2">
              <v-icon left>mdi-export</v-icon>
              Export
            </v-btn>
          </v-toolbar>
        </template>

        <!-- Merchant logo -->
        <template v-slot:item.logo="{ item }">
          <v-avatar size="40" color="grey lighten-3" class="mr-2">
            <v-img
              v-if="item.logo"
              :src="item.logo"
              alt="Merchant logo"
            ></v-img>
            <v-icon v-else color="grey darken-2">mdi-store</v-icon>
          </v-avatar>
        </template>

        <!-- Account status chip -->
        <template v-slot:item.accountStatus="{ item }">
          <v-chip
            small
            :color="getStatusColor(item.accountStatus)"
            text-color="white"
          >
            {{ item.accountStatus || "Pending" }}
          </v-chip>
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
                  color="info"
                  v-bind="attrs"
                  v-on="on"
                  @click="sendNotificationItem(item)"
                >
                  <v-icon>mdi-bell</v-icon>
                </v-btn>
              </template>
              <span>Send Notification</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="error"
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteItem(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete Merchant</span>
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
            <span v-else>No merchants found</span>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Merchant Details Dialog -->
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
                <!-- ID (view/edit mode only) -->
                <v-text-field
                  v-if="!createMode"
                  v-model="editedItem._id"
                  label="Merchant ID"
                  outlined
                  dense
                  disabled
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>

                <!-- Basic Information Section -->
                <div class="section-title mb-2">Basic Information</div>

                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.firstname"
                      label="First Name"
                      outlined
                      dense
                      :disabled="viewMode"
                      :rules="[(v) => !!v || 'First name is required']"
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="editedItem.lastname"
                      label="Last Name"
                      outlined
                      dense
                      :disabled="viewMode"
                      :rules="[(v) => !!v || 'Last name is required']"
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-text-field
                  v-model="editedItem.email"
                  label="Email"
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

                <v-text-field
                  v-if="createMode"
                  v-model="editedItem.password"
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

                <v-text-field
                  v-model="editedItem.phone"
                  label="Phone"
                  outlined
                  dense
                  :disabled="viewMode"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>

                <!-- Company Information Section -->
                <div class="section-title mb-2 mt-4">Company Information</div>

                <v-text-field
                  v-model="editedItem.companyName"
                  label="Company Name"
                  outlined
                  dense
                  :disabled="viewMode"
                  :rules="[(v) => !!v || 'Company name is required']"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.cacNumber"
                  label="CAC Number"
                  outlined
                  dense
                  :disabled="viewMode"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>

                <v-text-field
                  v-model="editedItem.currentRevenue"
                  label="Current Revenue"
                  outlined
                  dense
                  :disabled="viewMode"
                  prefix="₦"
                  type="number"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>

                <v-select
                  v-model="editedItem.categories"
                  :items="categories"
                  label="Categories"
                  outlined
                  dense
                  multiple
                  chips
                  small-chips
                  :disabled="viewMode"
                  @change="handleSelect"
                  :rules="[
                    (v) => v.length <= 2 || 'Maximum 2 categories allowed',
                  ]"
                  hide-details="auto"
                  class="mb-4"
                ></v-select>
              </v-col>

              <!-- Right column with stats, logo and documents -->
              <v-col cols="12" md="6">
                <!-- Stats cards (view mode only) -->
                <v-row v-if="viewMode">
                  <v-col cols="12">
                    <div class="section-title mb-2">Merchant Statistics</div>
                    <v-row>
                      <v-col cols="12" md="4">
                        <v-card outlined class="stat-card">
                          <v-card-text class="text-center pa-2">
                            <div class="subtitle-2 grey--text">
                              Wallet Balance
                            </div>
                            <div class="text-h5 font-weight-bold primary--text">
                              {{ formatCurrency(editedItem.walletBalance) }}
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-card outlined class="stat-card">
                          <v-card-text class="text-center pa-2">
                            <div class="subtitle-2 grey--text">
                              Total Products
                            </div>
                            <div class="text-h5 font-weight-bold primary--text">
                              {{ editedItem.totalProducts || 0 }}
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-card outlined class="stat-card">
                          <v-card-text class="text-center pa-2">
                            <div class="subtitle-2 grey--text">
                              Total Orders
                            </div>
                            <div class="text-h5 font-weight-bold primary--text">
                              {{ editedItem.totalOrders || 0 }}
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
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
                  </v-card>
                  <input
                    ref="logoInput"
                    type="file"
                    accept="image/*"
                    class="d-none"
                    @change="uploadProfilePhoto($event.target.files[0])"
                  />
                </div>

                <!-- CAC Documents -->
                <div
                  v-if="
                    editedItem.cacDocuments &&
                    editedItem.cacDocuments.length > 0
                  "
                >
                  <div class="section-title mb-2 mt-4">CAC Documents</div>
                  <v-row>
                    <v-col
                      cols="4"
                      v-for="(doc, index) in editedItem.cacDocuments"
                      :key="index"
                    >
                      <v-card outlined class="doc-card">
                        <v-img
                          :src="doc.url"
                          height="100"
                          contain
                          @click="openImagePreview(doc.url)"
                          class="cursor-pointer"
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
                        <v-card-text class="pa-2 text-center">
                          <span class="caption">Document {{ index + 1 }}</span>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
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
            :loading="saving"
            :disabled="!formValid"
            @click="save"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Send Notification Dialog -->
    <v-dialog v-model="notificationDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="primary darken-1 white--text">
          <span class="text-h5">Send Notification</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeNotification">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4">
          <v-form ref="notificationForm" v-model="notificationFormValid">
            <v-row>
              <v-col cols="12">
                <div class="mb-4 d-flex align-center">
                  <v-avatar size="40" color="grey lighten-3" class="mr-3">
                    <v-img
                      v-if="editedItem.logo"
                      :src="editedItem.logo"
                      alt="Merchant logo"
                    ></v-img>
                    <v-icon v-else color="grey darken-2">mdi-store</v-icon>
                  </v-avatar>
                  <div>
                    <div class="subtitle-1 font-weight-medium">
                      {{ editedItem.companyName }}
                    </div>
                    <div class="caption grey--text">{{ editedItem.email }}</div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="item.title"
                  label="Notification Title"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Title is required']"
                  hide-details="auto"
                  class="mb-4"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="item.message"
                  label="Notification Message"
                  outlined
                  auto-grow
                  rows="4"
                  :rules="[(v) => !!v || 'Message is required']"
                  hide-details="auto"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="closeNotification"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            :loading="sendingNotification"
            :disabled="!notificationFormValid"
            @click="sendNotification"
          >
            Send Notification
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this merchant? This action cannot be
          undone and will remove all associated data.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn
            color="error"
            text
            :loading="deleting"
            @click="deleteItemConfirm"
            >Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Image Preview Dialog -->
    <v-dialog v-model="imagePreviewDialog" max-width="800px">
      <v-card>
        <v-card-title class="grey darken-3 white--text">
          <span>Document Preview</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="imagePreviewDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-img :src="previewImageUrl" max-height="600" contain></v-img>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar" :timeout="6000" :color="color" top right>
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import todos from "@/static/logic";

export default {
  layout: "dashboard",
  name: "MerchantsManagement",

  data: () => ({
    loading: true,
    saving: false,
    deleting: false,
    sendingNotification: false,
    formValid: true,
    notificationFormValid: true,
    search: null,
    dialog: false,
    dialogDelete: false,
    notificationDialog: false,
    imagePreviewDialog: false,
    previewImageUrl: "",
    showPassword: false,
    createMode: true,
    editMode: false,
    viewMode: false,

    headers: [
      { text: "Logo", value: "logo", sortable: false, width: "80px" },
      { text: "Company Name", value: "companyName", sortable: true },
      { text: "Email", value: "email", sortable: true },
      { text: "Name", value: "firstname", sortable: true },
      { text: "Phone", value: "phone", sortable: true },
      { text: "Status", value: "accountStatus", sortable: true },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "120px",
      },
    ],

    Merchants: [],
    categories: [],
    selectedCategories: [],
    allCategories: [],
    id: "",
    editedIndex: -1,

    item: {
      title: "",
      message: "",
    },

    editedItem: {
      _id: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      companyName: "",
      walletBalance: 0,
      totalProducts: 0,
      totalOrders: 0,
      currentRevenue: "",
      accountStatus: "",
      cacDocuments: [],
      logo: "",
      categories: [],
      phone: "",
      notificationId: "",
    },

    defaultItem: {
      _id: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      companyName: "",
      walletBalance: 0,
      totalProducts: 0,
      totalOrders: 0,
      currentRevenue: "",
      accountStatus: "",
      cacDocuments: [],
      logo: "",
      categories: [],
      phone: "",
      notificationId: "",
    },

    snackbar: false,
    color: "success",
    text: "",
    logo: null,
  }),

  computed: {
    token() {
      return this.$store.state.token;
    },
    formTitle() {
      if (this.editMode) return "Edit Merchant";
      if (this.createMode) return "Create Merchant";
      return "View Merchant";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    notificationDialog(val) {
      val || this.closeNotification();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    formatCurrency(amount) {
      if (amount === undefined || amount === null) return "₦0.00";
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(amount);
    },

    getStatusColor(status) {
      if (!status) return "grey";

      const statusMap = {
        ACTIVE: "success",
        PENDING: "warning",
        SUSPENDED: "error",
        INACTIVE: "grey",
      };

      return statusMap[status.toUpperCase()] || "grey";
    },

    openImagePreview(url) {
      this.previewImageUrl = url;
      this.imagePreviewDialog = true;
    },

    handleSelect(value) {
      if (value.length > 2) {
        this.showSnackbar(
          "You can only add a maximum of 2 categories",
          "error"
        );
        // Remove the last selected item to keep only 2
        this.editedItem.categories.pop();
        return;
      }

      this.selectedCategories = [];

      // Find the full category objects for the selected names
      value.forEach((categoryName) => {
        const category = this.allCategories.find(
          (c) => c.name === categoryName
        );
        if (category) {
          this.selectedCategories.push(category);
        }
      });
    },

    showSnackbar(message, color = "success") {
      this.text = message;
      this.color = color;
      this.snackbar = true;
    },

    async initialize() {
      try {
        this.loading = true;
        const response = await this.$axios.get(
          "merchants/all?size=99999999999999",
          {
            headers: {
              "x-admin-token": this.token,
            },
          }
        );
        this.Merchants = response.data.data;
        await this.getCategories();
      } catch (error) {
        this.showSnackbar("Failed to load merchants data", "error");
        console.error("Error loading merchants:", error);
      } finally {
        this.loading = false;
      }
    },

    async getCategories() {
      try {
        const response = await todos.get("categories?size=99999999999999");
        this.allCategories = response.data.data.map(({ _id, name }) => ({
          id: _id,
          name: name,
        }));
        this.categories = this.allCategories.map((e) => e.name);
      } catch (error) {
        this.showSnackbar("Failed to load categories", "error");
        console.error("Error loading categories:", error);
      }
    },

    createItem() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.createMode = true;
      this.viewMode = false;
      this.editMode = false;
      this.logo = null;
      this.selectedCategories = [];
      this.dialog = true;
    },

    async editItem(item) {
      this.editedIndex = this.Merchants.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.createMode = false;
      this.viewMode = false;
      this.editMode = true;
      this.logo = null;
      this.selectedCategories = [];

      // Set the selected categories based on the item's categories
      if (item.categories && Array.isArray(item.categories)) {
        this.editedItem.categories = item.categories.map(
          (cat) => cat.name || cat
        );
        this.handleSelect(this.editedItem.categories);
      }

      this.dialog = true;
    },

    async viewItem(item) {
      this.editedIndex = this.Merchants.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.createMode = false;
      this.editMode = false;
      this.viewMode = true;

      // Set the selected categories based on the item's categories
      if (item.categories && Array.isArray(item.categories)) {
        this.editedItem.categories = item.categories.map(
          (cat) => cat.name || cat
        );
      }

      this.dialog = true;
    },

    async sendNotificationItem(item) {
      this.editedIndex = this.Merchants.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.item = {
        title: "",
        message: "",
      };
      this.notificationDialog = true;
    },

    async sendNotification() {
      try {
        this.sendingNotification = true;

        const data = {
          title: this.item.title,
          message: this.item.message,
          notificationId: this.editedItem.notificationId,
        };

        const response = await this.$axios.post(
          "/admin/push/notification",
          data,
          {
            headers: {
              "x-admin-token": this.token,
            },
          }
        );

        if (response.data.statusCode === 200) {
          this.showSnackbar(
            response.data.message || "Notification sent successfully",
            "success"
          );
        } else {
          this.showSnackbar(
            response.data.message || "Failed to send notification",
            "error"
          );
        }

        this.closeNotification();
      } catch (error) {
        this.showSnackbar(
          error.response?.data?.message || "Failed to send notification",
          "error"
        );
      } finally {
        this.sendingNotification = false;
      }
    },

    deleteItem(item) {
      this.id = item._id;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        this.deleting = true;

        const response = await this.$axios.delete(`merchants/${this.id}`, {
          headers: {
            "x-admin-token": this.token,
          },
        });

        if (response.data.statusCode === 200) {
          this.showSnackbar(
            response.data.message || "Merchant deleted successfully",
            "success"
          );
          this.initialize();
        } else {
          this.showSnackbar(
            response.data.message || "Failed to delete merchant",
            "error"
          );
        }
      } catch (error) {
        this.showSnackbar(
          error.response?.data?.message || "Failed to delete merchant",
          "error"
        );
      } finally {
        this.deleting = false;
        this.closeDelete();
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.logo = null;
        this.selectedCategories = [];
        this.createMode = true;
      });
    },

    closeNotification() {
      this.notificationDialog = false;
      this.$nextTick(() => {
        this.item = {
          title: "",
          message: "",
        };
      });
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
        this.saving = true;
        const formData = new FormData();

        formData.append("firstname", this.editedItem.firstname);
        formData.append("lastname", this.editedItem.lastname);
        formData.append("email", this.editedItem.email);

        if (this.createMode && this.editedItem.password) {
          formData.append("password", this.editedItem.password);
        }

        formData.append("companyName", this.editedItem.companyName);
        formData.append("cacNumber", this.editedItem.cacNumber);
        formData.append("categories", JSON.stringify(this.selectedCategories));
        formData.append("phone", this.editedItem.phone);
        formData.append("currentRevenue", this.editedItem.currentRevenue);

        if (this.editedItem.logo && typeof this.editedItem.logo !== "string") {
          formData.append("logo", this.editedItem.logo);
        }

        let response;
        if (this.editMode) {
          response = await todos.put(
            `merchants/${this.editedItem._id}`,
            formData
          );
        } else {
          response = await todos.upload("merchants", formData);
        }

        if (response.data.statusCode === 200) {
          this.showSnackbar(
            this.editMode
              ? "Merchant updated successfully"
              : "Merchant created successfully",
            "success"
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
          error.response?.data?.message || "Operation failed",
          "error"
        );
      } finally {
        this.saving = false;
      }
    },

    uploadProfilePhoto(file) {
      if (!file) return;

      this.editedItem.logo = file;
      const reader = new FileReader();

      reader.onload = (e) => {
        this.logo = e.target.result;
      };

      reader.onerror = () => {
        this.showSnackbar("Failed to load image", "error");
      };

      reader.readAsDataURL(file);
    },
  },
};
</script>

<style scoped>
.merchants-dashboard {
  padding: 24px;
}

.header-section {
  margin-bottom: 24px;
}

.search-card {
  background-color: transparent !important;
  box-shadow: none !important;
}

.merchants-table-card {
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

.stat-card {
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

.doc-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.doc-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.cursor-pointer {
  cursor: pointer;
}

/* Dark mode support */
.theme--dark .section-title {
  color: rgba(255, 255, 255, 0.7);
}
</style>
