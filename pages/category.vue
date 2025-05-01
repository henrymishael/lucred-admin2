<template>
  <div class="categories-dashboard">
    <!-- Header with search and add button -->
    <div class="header-section">
      <h1 class="text-h4 font-weight-bold mb-4">Product Categories</h1>
      <v-row align="center" class="mb-6">
        <v-col cols="12" sm="6" md="4">
          <v-card elevation="0" class="search-card">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Search categories"
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
            Add Category
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <!-- Main data table -->
    <v-card class="categories-table-card">
      <v-data-table
        :headers="headers"
        :items="Categories"
        :search="search"
        :loading="loading"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100],
          'items-per-page-text': 'Categories per page',
        }"
        class="elevation-0"
      >
        <template v-slot:top>
          <v-toolbar flat class="py-2">
            <v-toolbar-title class="text-h6 font-weight-bold"
              >Categories List</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined class="ml-2">
              <v-icon left>mdi-export</v-icon>
              Export
            </v-btn>
          </v-toolbar>
        </template>

        <!-- Category image -->
        <template v-slot:item.coverImage="{ item }">
          <v-avatar size="40" color="grey lighten-3" class="mr-2">
            <v-img
              v-if="item.coverImage"
              :src="item.coverImage"
              alt="Category image"
            ></v-img>
            <v-icon v-else color="grey darken-2">mdi-folder</v-icon>
          </v-avatar>
        </template>

        <!-- Format date -->
        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
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
              <span>Edit Category</span>
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
              <span>Delete Category</span>
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
            <span v-else>No categories found</span>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Category Details Dialog -->
    <v-dialog v-model="dialog" max-width="800px" scrollable persistent>
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
                <v-row>
                  <!-- ID and Date (view/edit mode only) -->
                  <v-col cols="12" md="6" v-if="!createMode">
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
                  <v-col cols="12" md="6" v-if="!createMode">
                    <v-text-field
                      :value="formatDate(editedItem.createdAt)"
                      label="Created Date"
                      outlined
                      dense
                      disabled
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>

                  <!-- Name -->
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Category Name"
                      outlined
                      dense
                      :disabled="viewMode"
                      :rules="[(v) => !!v || 'Name is required']"
                      hide-details="auto"
                      class="mb-4"
                    ></v-text-field>
                  </v-col>

                  <!-- Description -->
                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.description"
                      label="Description"
                      outlined
                      dense
                      :disabled="viewMode"
                      auto-grow
                      rows="3"
                      row-height="20"
                      hide-details="auto"
                      class="mb-4"
                    ></v-textarea>
                  </v-col>

                  <!-- SubCategories -->
                  <v-col cols="12">
                    <v-combobox
                      v-model="editedItem.subCategories"
                      label="Sub Categories"
                      outlined
                      dense
                      multiple
                      chips
                      small-chips
                      deletable-chips
                      :disabled="viewMode"
                      hide-details="auto"
                      class="mb-4"
                    ></v-combobox>
                  </v-col>
                </v-row>
              </v-col>

              <!-- Right column with image and options -->
              <v-col cols="12" md="6">
                <!-- Cover Image -->
                <div class="text-center mb-4">
                  <v-card
                    class="mx-auto image-upload-card"
                    :class="{ 'image-upload-disabled': viewMode }"
                    height="200"
                    width="200"
                    outlined
                    :ripple="!viewMode"
                    @click="!viewMode && $refs.imageInput.click()"
                  >
                    <v-img
                      v-if="coverImage || editedItem.coverImage"
                      :src="coverImage || editedItem.coverImage"
                      height="100%"
                      width="100%"
                      cover
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
                          {{ viewMode ? "No image" : "Click to upload image" }}
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
                    ref="imageInput"
                    type="file"
                    accept="image/*"
                    class="d-none"
                    @change="uploadProfilePhoto($event.target.files[0])"
                  />
                </div>
              </v-col>

              <!-- Options Section (Full width) -->
              <v-col cols="12">
                <v-card outlined class="mb-4">
                  <v-card-title class="subtitle-1 py-2">
                    <v-icon left color="primary">mdi-tune</v-icon>
                    Category Options
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <!-- Add new option -->
                    <v-row v-if="!viewMode" align="center" class="mb-4">
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model="type"
                          label="Option Type"
                          outlined
                          dense
                          placeholder="e.g. Size, Color"
                          hide-details="auto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="7">
                        <v-combobox
                          v-model="specs"
                          label="Specifications"
                          outlined
                          dense
                          multiple
                          chips
                          small-chips
                          deletable-chips
                          placeholder="e.g. Small, Medium, Large"
                          hide-details="auto"
                        ></v-combobox>
                      </v-col>
                      <v-col cols="12" md="2" class="text-center">
                        <v-btn
                          color="primary"
                          :disabled="!type || !specs || specs.length === 0"
                          @click="addToOptions"
                        >
                          <v-icon>mdi-plus</v-icon>
                          Add
                        </v-btn>
                      </v-col>
                    </v-row>

                    <!-- Existing options -->
                    <v-row
                      v-if="editedItem.options && editedItem.options.length > 0"
                    >
                      <v-col cols="12">
                        <v-list dense>
                          <v-list-item
                            v-for="(opt, index) in editedItem.options"
                            :key="index"
                            class="mb-2 rounded"
                            :class="index % 2 === 0 ? 'grey lighten-4' : ''"
                          >
                            <v-list-item-content>
                              <v-list-item-title class="font-weight-medium">
                                {{ opt.type }}
                              </v-list-item-title>
                              <v-list-item-subtitle>
                                <v-chip
                                  v-for="(spec, i) in opt.specifications"
                                  :key="i"
                                  x-small
                                  class="mr-1 my-1"
                                  color="primary"
                                  outlined
                                >
                                  {{ spec }}
                                </v-chip>
                              </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action v-if="!viewMode">
                              <v-btn icon small @click="removeOption(index)">
                                <v-icon small color="error">mdi-delete</v-icon>
                              </v-btn>
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </v-col>
                    </v-row>
                    <v-row v-else>
                      <v-col cols="12" class="text-center py-4 grey--text">
                        <v-icon large color="grey lighten-1">mdi-tune</v-icon>
                        <div class="mt-2">
                          No options defined for this category
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
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

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this category? This action cannot be
          undone and may affect products associated with this category.
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
  </div>
</template>

<script>
import moment from "moment";
import todos from "@/static/logic";

export default {
  layout: "dashboard",
  name: "ProductCategories",

  data: () => ({
    loading: true,
    saving: false,
    deleting: false,
    formValid: true,
    search: null,
    dialog: false,
    dialogDelete: false,
    createMode: true,
    editMode: false,
    viewMode: false,

    headers: [
      { text: "Image", value: "coverImage", sortable: false, width: "80px" },
      { text: "Category Name", value: "name", sortable: true },
      { text: "Description", value: "description", sortable: true },
      { text: "Created Date", value: "createdAt", sortable: true },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "120px",
      },
    ],

    Categories: [],
    id: "",
    editedIndex: -1,
    editedItem: {
      name: "",
      description: "",
      createdAt: "",
      _id: "",
      options: [],
      subCategories: [],
      coverImage: null,
    },
    defaultItem: {
      name: "",
      description: "",
      createdAt: "",
      _id: "",
      options: [],
      subCategories: [],
      coverImage: null,
    },

    profileUploading: false,
    profileUploadError: false,
    coverImage: null,
    imageChanged: false,

    type: "",
    specs: [],
  }),

  computed: {
    token() {
      return this.$store.state.token;
    },
    formTitle() {
      if (this.editMode) return "Edit Product Category";
      if (this.createMode) return "Create Product Category";
      return "View Product Category";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    formatDate(date) {
      if (!date) return "N/A";
      return moment(date).format("MMM DD, YYYY");
    },

    addToOptions() {
      if (!this.editedItem.options) {
        this.editedItem.options = [];
      }

      this.editedItem.options.push({
        type: this.type,
        specifications: this.specs,
      });

      this.type = "";
      this.specs = [];

      this.$store.commit("snackbar/show", {
        text: "Option added successfully",
        icon: "success",
      });
    },

    removeOption(index) {
      this.editedItem.options.splice(index, 1);
      this.$store.commit("snackbar/show", {
        text: "Option removed",
        icon: "info",
      });
    },

    async initialize() {
      try {
        this.loading = true;
        const response = await this.$axios.get(
          "categories?size=99999999999999",
          {
            headers: {
              "x-admin-token": this.token,
            },
          }
        );
        this.Categories = response.data.data;
      } catch (error) {
        this.$store.commit("snackbar/show", {
          text: "Failed to load categories",
          icon: "error",
        });
        console.error("Error loading categories:", error);
      } finally {
        this.loading = false;
      }
    },

    async getAProductCategory(id) {
      try {
        const response = await this.$axios.get(`categories/${id}`, {
          headers: {
            "x-admin-token": this.token,
          },
        });
        return response.data.data;
      } catch (error) {
        this.$store.commit("snackbar/show", {
          text: "Failed to load category details",
          icon: "error",
        });
        console.error("Error loading category:", error);
        return null;
      }
    },

    createItem() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.createMode = true;
      this.viewMode = false;
      this.editMode = false;
      this.coverImage = null;
      this.imageChanged = false;
      this.dialog = true;
    },

    async editItem(item) {
      this.editedIndex = this.Categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.createMode = false;
      this.viewMode = false;
      this.editMode = true;
      this.coverImage = null;
      this.imageChanged = false;
      this.dialog = true;
    },

    async viewItem(item) {
      this.editedIndex = this.Categories.indexOf(item);
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
        this.deleting = true;
        const response = await this.$axios.delete(`categories/${this.id}`, {
          headers: {
            "x-admin-token": this.token,
          },
        });

        if (response.data.statusCode === 200) {
          this.$store.commit("snackbar/show", {
            text: response.data.message || "Category deleted successfully",
            icon: "success",
          });
          this.initialize();
        }
      } catch (error) {
        this.$store.commit("snackbar/show", {
          text: error.response?.data?.message || "Failed to delete category",
          icon: "error",
        });
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
        this.type = "";
        this.specs = [];
        this.coverImage = null;
        this.imageChanged = false;
        this.createMode = true;
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

        formData.append("name", this.editedItem.name);
        formData.append("description", this.editedItem.description);
        formData.append(
          "subCategories",
          JSON.stringify(this.editedItem.subCategories || [])
        );
        formData.append(
          "options",
          JSON.stringify(this.editedItem.options || [])
        );

        if (this.editMode) {
          if (this.imageChanged && this.editedItem.coverImage) {
            formData.append("coverImage", this.editedItem.coverImage);
          }

          const response = await todos.put(
            `categories/${this.editedItem._id}`,
            formData
          );

          if (response.data.statusCode === 200) {
            this.$store.commit("snackbar/show", {
              text: "Category updated successfully",
              icon: "success",
            });
            this.initialize();
            this.close();
          }
        } else {
          if (this.editedItem.coverImage) {
            formData.append("coverImage", this.editedItem.coverImage);
          }

          const response = await todos.upload("categories", formData);

          if (response.data.statusCode === 200) {
            this.$store.commit("snackbar/show", {
              text: "Category created successfully",
              icon: "success",
            });
            this.initialize();
            this.close();
          }
        }
      } catch (error) {
        this.$store.commit("snackbar/show", {
          text: error.response?.data?.message || "Operation failed",
          icon: "error",
        });
      } finally {
        this.saving = false;
      }
    },

    uploadProfilePhoto(file) {
      if (!file) return;

      this.profileUploading = true;
      this.imageChanged = true;
      this.editedItem.coverImage = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverImage = e.target.result;
        this.profileUploading = false;
      };

      reader.onerror = () => {
        this.profileUploading = false;
        this.profileUploadError = true;
        this.$store.commit("snackbar/show", {
          text: "Failed to load image",
          icon: "error",
        });
      };

      reader.readAsDataURL(file);
    },
  },
};
</script>

<style scoped>
.categories-dashboard {
  padding: 24px;
}

.header-section {
  margin-bottom: 24px;
}

.search-card {
  background-color: transparent !important;
  box-shadow: none !important;
}

.categories-table-card {
  border-radius: 8px;
}

.actions-container {
  display: flex;
  justify-content: center;
  gap: 8px;
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
</style>
