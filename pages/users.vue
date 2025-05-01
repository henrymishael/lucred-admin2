<template>
  <div class="users-dashboard">
    <!-- Header with search -->
    <div class="header-section">
      <h1 class="text-h4 font-weight-bold mb-4">Users Management</h1>
      <v-card elevation="0" class="search-card mb-6">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search users by name, email or phone"
          hide-details
          outlined
          dense
          clearable
          class="search-field"
        />
      </v-card>
    </div>

    <!-- Main data table -->
    <v-card class="users-table-card">
      <v-data-table
        :headers="headers"
        :items="Users"
        :search="search"
        :loading="loading"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100],
          'items-per-page-text': 'Users per page',
        }"
        class="elevation-0"
      >
        <template v-slot:top>
          <v-toolbar flat class="py-2">
            <v-toolbar-title class="text-h6 font-weight-bold"
              >Users List</v-toolbar-title
            >
            <v-spacer></v-spacer>
            <v-btn color="primary" outlined class="ml-2">
              <v-icon left>mdi-export</v-icon>
              Export
            </v-btn>
          </v-toolbar>
        </template>

        <!-- Status chip -->
        <template v-slot:item.accountVerified="{ item }">
          <v-chip
            small
            :color="item.accountVerified ? 'success' : 'error'"
            text-color="white"
          >
            {{ item.accountVerified ? "Verified" : "Unverified" }}
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
                  color="success"
                  v-bind="attrs"
                  v-on="on"
                  @click="creditItem(item)"
                >
                  <v-icon>mdi-credit-card</v-icon>
                </v-btn>
              </template>
              <span>Credit User</span>
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
              <span>Delete User</span>
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
            <span v-else>No users found</span>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- User Details Dialog -->
    <v-dialog v-model="dialog" max-width="900px" scrollable>
      <v-card>
        <v-card-title class="primary darken-1 white--text">
          <span class="text-h5">{{ formTitle }}</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-0">
          <v-tabs
            v-model="activeTab"
            background-color="transparent"
            color="primary"
            grow
            slider-size="3"
          >
            <v-tab v-for="tab in tabs" :key="tab.id">
              <v-icon left>{{ tab.icon }}</v-icon>
              {{ tab.name }}
            </v-tab>

            <!-- BVN Data Tab -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-row v-if="editedItem.bvnData">
                    <v-col cols="12">
                      <div class="d-flex align-center mb-4">
                        <v-avatar color="primary" size="64" class="mr-4">
                          <span class="white--text text-h5">{{
                            getInitials(editedItem.bvnData)
                          }}</span>
                        </v-avatar>
                        <div>
                          <h3 class="text-h5 mb-1">
                            {{ editedItem.bvnData.firstName }}
                            {{ editedItem.bvnData.lastName }}
                          </h3>
                          <p class="text-subtitle-1 grey--text">
                            BVN: {{ editedItem.bvnData.bvn }}
                          </p>
                        </div>
                        <v-spacer></v-spacer>
                        <v-chip
                          :color="
                            editedItem.bvnData.watchListed ? 'error' : 'success'
                          "
                          text-color="white"
                          class="ml-2"
                        >
                          {{
                            editedItem.bvnData.watchListed
                              ? "Watchlisted"
                              : "Clear"
                          }}
                        </v-chip>
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-divider class="mb-4"></v-divider>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">{{
                          editedItem.bvnData.email
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Phone</span>
                        <span class="detail-value">{{
                          editedItem.bvnData.phoneNumber1
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Gender</span>
                        <span class="detail-value">{{
                          editedItem.bvnData.gender
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Date of Birth</span>
                        <span class="detail-value">{{
                          formatDate(editedItem.bvnData.dateofBirth)
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">NIN</span>
                        <span class="detail-value">{{
                          editedItem.bvnData.nin || "Not provided"
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Enrollment Bank</span>
                        <span class="detail-value">{{
                          editedItem.bvnData.enrollmentBank
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-divider class="my-4"></v-divider>
                      <h3 class="text-subtitle-1 font-weight-bold mb-3">
                        Location Information
                      </h3>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">State of Origin</span>
                        <span class="detail-value">{{
                          editedItem.bvnData.stateOfOrigin
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">LGA of Origin</span>
                        <span class="detail-value">{{
                          editedItem.bvnData.lgaOfOrigin
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">State of Residence</span>
                        <span class="detail-value">{{
                          editedItem.bvnData.stateOfResidence
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">LGA of Residence</span>
                        <span class="detail-value">{{
                          editedItem.bvnData.lgaOfResidence
                        }}</span>
                      </div>
                    </v-col>
                  </v-row>
                  <div v-else class="pa-4 text-center">
                    <v-icon size="64" color="grey lighten-1"
                      >mdi-account-question</v-icon
                    >
                    <p class="mt-2 text-subtitle-1 grey--text">
                      No BVN data available for this user
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!-- Phone Lookup Data Tab -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-row v-if="editedItem.phoneLookupData">
                    <v-col cols="12">
                      <div class="d-flex align-center mb-4">
                        <v-avatar color="primary" size="64" class="mr-4">
                          <span class="white--text text-h5">{{
                            getInitialsFromPhone(editedItem.phoneLookupData)
                          }}</span>
                        </v-avatar>
                        <div>
                          <h3 class="text-h5 mb-1">
                            {{ editedItem.phoneLookupData.firstName }}
                            {{ editedItem.phoneLookupData.middleName }}
                            {{ editedItem.phoneLookupData.surname }}
                          </h3>
                          <p class="text-subtitle-1 grey--text">
                            MSISDN: {{ editedItem.phoneLookupData.msisdn }}
                          </p>
                        </div>
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-divider class="mb-4"></v-divider>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">NIN</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.nin || "Not provided"
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Gender</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.gender
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Birth Date</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.birthDate
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Marital Status</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.maritalStatus
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Profession</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.profession
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Educational Level</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.educationalLevel
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Employment Status</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.employmentStatus
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <v-divider class="my-4"></v-divider>
                      <h3 class="text-subtitle-1 font-weight-bold mb-3">
                        Location Information
                      </h3>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Birth State</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.birthState
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Birth LGA</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.birthLga
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Residence Address</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.residenceAddressLine1
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Residence State</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.residenceState
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="4">
                      <div class="detail-item">
                        <span class="detail-label">Residence LGA</span>
                        <span class="detail-value">{{
                          editedItem.phoneLookupData.residenceLga
                        }}</span>
                      </div>
                    </v-col>
                  </v-row>
                  <div v-else class="pa-4 text-center">
                    <v-icon size="64" color="grey lighten-1"
                      >mdi-cellphone-off</v-icon
                    >
                    <p class="mt-2 text-subtitle-1 grey--text">
                      No phone lookup data available for this user
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!-- Location Tab -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-row v-if="editedItem.location">
                    <v-col cols="12">
                      <v-card outlined class="mb-4">
                        <v-card-text>
                          <div class="d-flex align-center">
                            <v-icon color="primary" size="36" class="mr-4"
                              >mdi-map-marker</v-icon
                            >
                            <div>
                              <h3 class="text-h6 mb-1">
                                {{ editedItem.location.address1 }}
                              </h3>
                              <p class="text-subtitle-2 grey--text">
                                {{ editedItem.location.city }},
                                {{ editedItem.location.state }},
                                {{ editedItem.location.country }}
                                {{ editedItem.location.zipCode }}
                              </p>
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="detail-item">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">{{
                          editedItem.location.address1
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="detail-item">
                        <span class="detail-label">City</span>
                        <span class="detail-value">{{
                          editedItem.location.city
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="detail-item">
                        <span class="detail-label">State</span>
                        <span class="detail-value">{{
                          editedItem.location.state
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="detail-item">
                        <span class="detail-label">Country</span>
                        <span class="detail-value">{{
                          editedItem.location.country
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="detail-item">
                        <span class="detail-label">Zip Code</span>
                        <span class="detail-value">{{
                          editedItem.location.zipCode
                        }}</span>
                      </div>
                    </v-col>
                  </v-row>
                  <div v-else class="pa-4 text-center">
                    <v-icon size="64" color="grey lighten-1"
                      >mdi-map-marker-off</v-icon
                    >
                    <p class="mt-2 text-subtitle-1 grey--text">
                      No location data available for this user
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!-- Bank Account Information Tab -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <div
                    v-if="
                      editedItem.bankAccountInfo &&
                      editedItem.bankAccountInfo.length > 0
                    "
                  >
                    <v-row
                      v-for="(bank, i) in editedItem.bankAccountInfo"
                      :key="i"
                      class="mb-4"
                    >
                      <v-col cols="12">
                        <v-card outlined class="mb-4">
                          <v-card-text>
                            <div class="d-flex align-center">
                              <v-icon color="primary" size="36" class="mr-4"
                                >mdi-bank</v-icon
                              >
                              <div>
                                <h3 class="text-h6 mb-1">
                                  {{ bank.bankName }}
                                </h3>
                                <p class="text-subtitle-2 grey--text">
                                  {{ bank.accountNumber }} •
                                  {{ bank.accountType }}
                                </p>
                              </div>
                              <v-spacer></v-spacer>
                              <v-chip color="primary" outlined>{{
                                bank.currency
                              }}</v-chip>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>

                      <v-col cols="12" md="6">
                        <div class="detail-item">
                          <span class="detail-label">Account Name</span>
                          <span class="detail-value">{{
                            bank.accountName
                          }}</span>
                        </div>
                      </v-col>

                      <v-col cols="12" md="6">
                        <div class="detail-item">
                          <span class="detail-label">Account Number</span>
                          <span class="detail-value">{{
                            bank.accountNumber
                          }}</span>
                        </div>
                      </v-col>

                      <v-col cols="12" md="6">
                        <div class="detail-item">
                          <span class="detail-label">Account Type</span>
                          <span class="detail-value">{{
                            bank.accountType
                          }}</span>
                        </div>
                      </v-col>

                      <v-col cols="12" md="6">
                        <div class="detail-item">
                          <span class="detail-label">Bank Account Type</span>
                          <span class="detail-value">{{
                            bank.bankAccountType
                          }}</span>
                        </div>
                      </v-col>

                      <v-col cols="12" md="6">
                        <div class="detail-item">
                          <span class="detail-label">Bank Code</span>
                          <span class="detail-value">{{ bank.bankCode }}</span>
                        </div>
                      </v-col>

                      <v-col cols="12" md="6">
                        <div class="detail-item">
                          <span class="detail-label">Mono Account ID</span>
                          <span class="detail-value">{{
                            bank.monoAccountId
                          }}</span>
                        </div>
                      </v-col>

                      <v-col cols="12">
                        <v-divider
                          v-if="i < editedItem.bankAccountInfo.length - 1"
                          class="my-4"
                        ></v-divider>
                      </v-col>
                    </v-row>
                  </div>
                  <div v-else class="pa-4 text-center">
                    <v-icon size="64" color="grey lighten-1"
                      >mdi-bank-off</v-icon
                    >
                    <p class="mt-2 text-subtitle-1 grey--text">
                      No bank account information available for this user
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!-- Wallet Swap History Tab -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <div
                    v-if="
                      editedItem.walletSwapHistory &&
                      editedItem.walletSwapHistory.length > 0
                    "
                  >
                    <v-timeline dense>
                      <v-timeline-item
                        v-for="(history, i) in editedItem.walletSwapHistory"
                        :key="i"
                        color="primary"
                        small
                      >
                        <div class="d-flex justify-space-between align-center">
                          <div>
                            <div class="text-subtitle-1 font-weight-medium">
                              Wallet Swap
                            </div>
                            <div class="text-caption grey--text">
                              {{ formatDate(history.date) }}
                            </div>
                          </div>
                          <v-chip color="primary" outlined>
                            {{ formatCurrency(history.amount) }}
                          </v-chip>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </div>
                  <div v-else class="pa-4 text-center">
                    <v-icon size="64" color="grey lighten-1"
                      >mdi-wallet-off</v-icon
                    >
                    <p class="mt-2 text-subtitle-1 grey--text">
                      No wallet swap history available for this user
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!-- Spending History Tab -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <div
                    v-if="
                      editedItem.spendingHistory &&
                      editedItem.spendingHistory.length > 0
                    "
                  >
                    <v-data-table
                      :headers="spendingHeaders"
                      :items="editedItem.spendingHistory"
                      hide-default-footer
                      class="elevation-0"
                    >
                      <template v-slot:item.amount="{ item }">
                        <span class="font-weight-medium">{{
                          formatCurrency(item.amount)
                        }}</span>
                      </template>
                    </v-data-table>
                  </div>
                  <div v-else class="pa-4 text-center">
                    <v-icon size="64" color="grey lighten-1"
                      >mdi-cash-off</v-icon
                    >
                    <p class="mt-2 text-subtitle-1 grey--text">
                      No spending history available for this user
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!-- Cart Details Tab -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <div
                    v-if="
                      editedItem.cartDetails &&
                      editedItem.cartDetails.length > 0
                    "
                  >
                    <v-expansion-panels>
                      <v-expansion-panel
                        v-for="(cart, i) in editedItem.cartDetails"
                        :key="i"
                      >
                        <v-expansion-panel-header>
                          <div class="d-flex align-center">
                            <div>
                              <span
                                class="text-subtitle-1 font-weight-medium"
                                >{{ cart.productName }}</span
                              >
                              <div class="text-caption grey--text">
                                {{ cart.companyName }}
                              </div>
                            </div>
                            <v-spacer></v-spacer>
                            <v-chip color="primary" small>
                              {{ formatCurrency(cart.totalPrice) }}
                            </v-chip>
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <v-row>
                            <v-col cols="12" md="6">
                              <div class="detail-item">
                                <span class="detail-label">Product ID</span>
                                <span class="detail-value">{{
                                  cart.productId
                                }}</span>
                              </div>
                            </v-col>
                            <v-col cols="12" md="6">
                              <div class="detail-item">
                                <span class="detail-label">Quantity</span>
                                <span class="detail-value">{{
                                  cart.quantity
                                }}</span>
                              </div>
                            </v-col>
                            <v-col cols="12" md="6">
                              <div class="detail-item">
                                <span class="detail-label">Initial Price</span>
                                <span class="detail-value">{{
                                  formatCurrency(cart.initialPrice)
                                }}</span>
                              </div>
                            </v-col>
                            <v-col cols="12" md="6">
                              <div class="detail-item">
                                <span class="detail-label">Total Price</span>
                                <span class="detail-value">{{
                                  formatCurrency(cart.totalPrice)
                                }}</span>
                              </div>
                            </v-col>
                            <v-col cols="12" md="6">
                              <div class="detail-item">
                                <span class="detail-label">Merchant ID</span>
                                <span class="detail-value">{{
                                  cart.merchantId
                                }}</span>
                              </div>
                            </v-col>
                            <v-col cols="12" md="6">
                              <div class="detail-item">
                                <span class="detail-label">Company Name</span>
                                <span class="detail-value">{{
                                  cart.companyName
                                }}</span>
                              </div>
                            </v-col>
                          </v-row>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>
                  <div v-else class="pa-4 text-center">
                    <v-icon size="64" color="grey lighten-1"
                      >mdi-cart-off</v-icon
                    >
                    <p class="mt-2 text-subtitle-1 grey--text">
                      No cart details available for this user
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!-- Credits Tab -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <div
                    v-if="editedItem.credits && editedItem.credits.length > 0"
                  >
                    <v-card
                      v-for="(credit, i) in editedItem.credits"
                      :key="i"
                      outlined
                      class="mb-4"
                    >
                      <v-card-text>
                        <v-row>
                          <v-col cols="12">
                            <div
                              class="d-flex justify-space-between align-center mb-4"
                            >
                              <div>
                                <span class="text-h6 font-weight-bold">{{
                                  formatCurrency(credit.creditAmount)
                                }}</span>
                                <div class="text-caption grey--text"></div>
                                <div class="text-caption grey--text">
                                  {{ formatDate(credit.startDate) }} -
                                  {{ formatDate(credit.endDate) }}
                                </div>
                              </div>
                              <v-chip
                                :color="
                                  getCreditStatusColor(
                                    credit.creditRepaymentStatus
                                  )
                                "
                                text-color="white"
                              >
                                {{ credit.creditRepaymentStatus }}
                              </v-chip>
                            </div>
                          </v-col>

                          <v-col cols="12" md="4">
                            <div class="detail-item">
                              <span class="detail-label">Credit Duration</span>
                              <span class="detail-value"
                                >{{ credit.creditDuration }} months</span
                              >
                            </div>
                          </v-col>

                          <v-col cols="12" md="4">
                            <div class="detail-item">
                              <span class="detail-label"
                                >Monthly Repayment</span
                              >
                              <span class="detail-value">{{
                                formatCurrency(credit.monthlyRepayment)
                              }}</span>
                            </div>
                          </v-col>

                          <v-col cols="12" md="4">
                            <div class="detail-item">
                              <span class="detail-label">Borrower ID</span>
                              <span class="detail-value">{{
                                credit.borrowerId
                              }}</span>
                            </div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </div>
                  <div v-else class="pa-4 text-center">
                    <v-icon size="64" color="grey lighten-1"
                      >mdi-credit-card-off</v-icon
                    >
                    <p class="mt-2 text-subtitle-1 grey--text">
                      No credits available for this user
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>

            <!-- Other Basic Information Tab -->
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <v-card class="mb-4" outlined>
                        <v-card-text>
                          <div class="d-flex align-center">
                            <div>
                              <h3 class="text-h6 mb-1">Account Status</h3>
                              <div class="d-flex flex-wrap">
                                <v-chip
                                  class="mr-2 mb-2"
                                  :color="
                                    editedItem.accountVerified
                                      ? 'success'
                                      : 'error'
                                  "
                                  small
                                  label
                                >
                                  {{
                                    editedItem.accountVerified
                                      ? "Account Verified"
                                      : "Account Not Verified"
                                  }}
                                </v-chip>
                                <v-chip
                                  class="mr-2 mb-2"
                                  :color="
                                    editedItem.emailVerified
                                      ? 'success'
                                      : 'error'
                                  "
                                  small
                                  label
                                >
                                  {{
                                    editedItem.emailVerified
                                      ? "Email Verified"
                                      : "Email Not Verified"
                                  }}
                                </v-chip>
                                <v-chip
                                  class="mr-2 mb-2"
                                  :color="
                                    editedItem.phoneVerified
                                      ? 'success'
                                      : 'error'
                                  "
                                  small
                                  label
                                >
                                  {{
                                    editedItem.phoneVerified
                                      ? "Phone Verified"
                                      : "Phone Not Verified"
                                  }}
                                </v-chip>
                                <v-chip
                                  class="mr-2 mb-2"
                                  :color="
                                    editedItem.bvnVerified ? 'success' : 'error'
                                  "
                                  small
                                  label
                                >
                                  {{
                                    editedItem.bvnVerified
                                      ? "BVN Verified"
                                      : "BVN Not Verified"
                                  }}
                                </v-chip>
                                <v-chip
                                  class="mr-2 mb-2"
                                  :color="
                                    editedItem.isActive ? 'success' : 'error'
                                  "
                                  small
                                  label
                                >
                                  {{
                                    editedItem.isActive ? "Active" : "Inactive"
                                  }}
                                </v-chip>
                              </div>
                            </div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card outlined class="mb-4">
                        <v-card-text>
                          <h3 class="text-subtitle-1 font-weight-bold mb-3">
                            Wallet Information
                          </h3>
                          <div
                            class="d-flex justify-space-between align-center mb-2"
                          >
                            <span>Wallet Balance</span>
                            <span class="text-h6 font-weight-bold">{{
                              formatCurrency(editedItem.walletBalance)
                            }}</span>
                          </div>
                          <div
                            class="d-flex justify-space-between align-center"
                          >
                            <span>Spending Wallet Balance</span>
                            <span class="text-h6 font-weight-bold">{{
                              formatCurrency(editedItem.spendingWalletBalance)
                            }}</span>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-card outlined class="mb-4">
                        <v-card-text>
                          <h3 class="text-subtitle-1 font-weight-bold mb-3">
                            Credit Information
                          </h3>
                          <div
                            class="d-flex justify-space-between align-center mb-2"
                          >
                            <span>Approved Credits</span>
                            <span class="text-h6 font-weight-bold">{{
                              editedItem.approvedCredits || 0
                            }}</span>
                          </div>
                          <div
                            class="d-flex justify-space-between align-center"
                          >
                            <span>Declined Credits</span>
                            <span class="text-h6 font-weight-bold">{{
                              editedItem.declinedCredits || 0
                            }}</span>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="detail-item">
                        <span class="detail-label">User ID</span>
                        <span class="detail-value">{{
                          editedItem.userId
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="detail-item">
                        <span class="detail-label">Created At</span>
                        <span class="detail-value">{{
                          formatDate(editedItem.createdAt)
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="detail-item">
                        <span class="detail-label">Date of Birth</span>
                        <span class="detail-value">{{
                          formatDate(editedItem.dob)
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="detail-item">
                        <span class="detail-label">Credit Request Status</span>
                        <span class="detail-value">{{
                          editedItem.creditRequestStatus || "N/A"
                        }}</span>
                      </div>
                    </v-col>

                    <v-col cols="12" md="6">
                      <div class="detail-item">
                        <span class="detail-label">Notification ID</span>
                        <span class="detail-value">{{
                          editedItem.notificationId || "N/A"
                        }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="close">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Credit User Dialog -->
    <v-dialog v-model="dialogCredit" max-width="600px">
      <v-card>
        <v-card-title class="primary darken-1 white--text">
          <span class="text-h5">Credit User</span>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeCredit">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="creditForm" v-model="creditFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="amount"
                  label="Amount"
                  prefix="₦"
                  type="number"
                  outlined
                  dense
                  :rules="[
                    (v) => !!v || 'Amount is required',
                    (v) => v > 0 || 'Amount must be greater than 0',
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="creditDuration"
                  label="Credit Duration (months)"
                  type="number"
                  outlined
                  dense
                  :rules="[
                    (v) => !!v || 'Duration is required',
                    (v) => v > 0 || 'Duration must be greater than 0',
                  ]"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="startDate"
                      label="Start Date"
                      readonly
                      outlined
                      dense
                      prepend-icon="mdi-calendar"
                      v-bind="attrs"
                      v-on="on"
                      :rules="[(v) => !!v || 'Start date is required']"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    :active-picker.sync="activePicker"
                    :max="maxDate"
                    min="1950-01-01"
                    @change="$refs.menu.save(startDate)"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="paymentTypeProvider"
                  :items="paymentProviders"
                  label="Payment Type Provider"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'Payment provider is required']"
                ></v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pb-4 px-4">
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="closeCredit">Cancel</v-btn>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!creditFormValid"
            @click="saveCredit"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this user? This action cannot be
          undone.
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

    <!-- Suspend Confirmation Dialog -->
    <v-dialog v-model="dialogSuspend" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">
          {{ editedItem.is_suspended ? "Revoke Suspension" : "Suspend User" }}
        </v-card-title>
        <v-card-text>
          Are you sure you want to
          {{
            editedItem.is_suspended ? "revoke suspension for" : "suspend"
          }}
          this user?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="closeSuspend">Cancel</v-btn>
          <v-btn
            :color="editedItem.is_suspended ? 'success' : 'error'"
            text
            :loading="loading"
            @click="suspendItemConfirm"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from "moment";

export default {
  layout: "dashboard",
  name: "UsersManagement",

  data: () => ({
    loading: true,
    search: null,
    dialog: false,
    dialogDelete: false,
    dialogSuspend: false,
    dialogCredit: false,
    activeTab: 0,
    creditFormValid: false,

    headers: [
      { text: "Email", value: "email", sortable: true },
      { text: "First Name", value: "firstname", sortable: true },
      { text: "Last Name", value: "lastname", sortable: true },
      { text: "Phone", value: "phone", sortable: true },
      { text: "Status", value: "accountVerified", sortable: true },
      { text: "Actions", value: "actions", sortable: false, align: "center" },
    ],

    spendingHeaders: [
      { text: "ID", value: "_id", sortable: true },
      { text: "Amount", value: "amount", sortable: true },
      { text: "Checkout ID", value: "checkoutId", sortable: true },
    ],

    tabs: [
      { id: "bvn", name: "BVN Data", icon: "mdi-card-account-details" },
      { id: "phone", name: "Phone Data", icon: "mdi-cellphone" },
      { id: "location", name: "Location", icon: "mdi-map-marker" },
      { id: "bank", name: "Bank Accounts", icon: "mdi-bank" },
      { id: "wallet", name: "Wallet History", icon: "mdi-wallet" },
      { id: "spending", name: "Spending", icon: "mdi-cash" },
      { id: "cart", name: "Cart Details", icon: "mdi-cart" },
      { id: "credits", name: "Credits", icon: "mdi-credit-card" },
      { id: "info", name: "Basic Info", icon: "mdi-information" },
    ],

    Users: [],
    id: "",
    editedIndex: -1,
    editedItem: {
      email: "",
      firstname: "",
      lastname: "",
      phone: "",
      accountVerified: false,
      emailVerified: false,
      phoneVerified: false,
      bvnVerified: false,
      isActive: false,
      _id: "",
      is_suspended: false,
      walletBalance: 0,
      spendingWalletBalance: 0,
    },

    defaultItem: {
      email: "",
      firstname: "",
      lastname: "",
      phone: "",
      accountVerified: false,
      emailVerified: false,
      phoneVerified: false,
      bvnVerified: false,
      isActive: false,
      _id: "",
      is_suspended: false,
      walletBalance: 0,
      spendingWalletBalance: 0,
    },

    // Credit form data
    activePicker: null,
    menu: false,
    amount: 0,
    creditDuration: 0,
    startDate: null,
    paymentTypeProvider: "",
    paymentProviders: ["MONO", "PAYSTACK"],
  }),

  computed: {
    token() {
      return this.$store.state.token;
    },
    formTitle() {
      const userName = this.getUserName();
      return `User Details${userName ? ": " + userName : ""}`;
    },
    maxDate() {
      return new Date().toISOString().substr(0, 10);
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    dialogCredit(val) {
      val || this.closeCredit();
    },
    menu(val) {
      val && setTimeout(() => (this.activePicker = "YEAR"));
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      try {
        this.loading = true;
        const response = await this.$axios.get("users?size=99999999999999", {
          headers: {
            "x-admin-token": this.token,
          },
        });
        this.Users = response.data.data;
      } catch (error) {
        this.$store.commit("snackbar/show", {
          text: "Failed to load users data",
          icon: "error",
        });
        console.error("Error loading users:", error);
      } finally {
        this.loading = false;
      }
    },

    getUserName() {
      if (this.editedItem.bvnData) {
        return `${this.editedItem.bvnData.firstName} ${this.editedItem.bvnData.lastName}`;
      } else if (this.editedItem.firstname && this.editedItem.lastname) {
        return `${this.editedItem.firstname} ${this.editedItem.lastname}`;
      }
      return this.editedItem.email;
    },

    getInitials(data) {
      if (!data) return "U";
      return `${data.firstName?.charAt(0) || ""}${
        data.lastName?.charAt(0) || ""
      }`;
    },

    getInitialsFromPhone(data) {
      if (!data) return "U";
      return `${data.firstName?.charAt(0) || ""}${
        data.surname?.charAt(0) || ""
      }`;
    },

    formatDate(date) {
      if (!date) return "N/A";
      return moment(date).format("MMM DD, YYYY");
    },

    formatCurrency(amount) {
      if (amount === undefined || amount === null) return "₦0.00";
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(amount);
    },

    getCreditStatusColor(status) {
      if (!status) return "grey";

      const statusMap = {
        PAID: "success",
        PENDING: "warning",
        OVERDUE: "error",
        ACTIVE: "info",
      };

      return statusMap[status.toUpperCase()] || "grey";
    },

    async deleteUser(id) {
      try {
        const response = await this.$axios.delete(`users/${id}`, {
          headers: {
            "x-admin-token": this.token,
          },
        });
        return response;
      } catch (error) {
        throw error;
      }
    },

    async viewItem(item) {
      this.editedIndex = this.Users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    async creditItem(item) {
      this.editedIndex = this.Users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.amount = 0;
      this.creditDuration = 0;
      this.startDate = new Date().toISOString().substr(0, 10);
      this.paymentTypeProvider = this.paymentProviders[0];
      this.dialogCredit = true;
    },

    deleteItem(item) {
      this.id = item._id;
      this.dialogDelete = true;
    },

    suspendItem(item) {
      this.editedIndex = this.Users.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.id = item._id;
      this.dialogSuspend = true;
    },

    async deleteItemConfirm() {
      try {
        this.loading = true;
        const response = await this.deleteUser(this.id);
        this.$store.commit("snackbar/show", {
          text: response.data.message || "User deleted successfully",
          icon: "success",
        });
        this.initialize();
      } catch (error) {
        this.$store.commit("snackbar/show", {
          text: error.response?.data?.message || "Failed to delete user",
          icon: "error",
        });
      } finally {
        this.loading = false;
        this.closeDelete();
      }
    },

    async suspendItemConfirm() {
      try {
        this.loading = true;
        const response = await this.suspendUser(this.id);
        this.$store.commit("snackbar/show", {
          text: response.data.message,
          icon: "success",
        });
        this.initialize();
      } catch (error) {
        this.$store.commit("snackbar/show", {
          text: error.response?.data?.message || "Operation failed",
          icon: "error",
        });
      } finally {
        this.loading = false;
        this.closeSuspend();
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.activeTab = 0;
      });
    },

    closeCredit() {
      this.dialogCredit = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.amount = 0;
        this.creditDuration = 0;
        this.startDate = null;
        this.paymentTypeProvider = "";
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeSuspend() {
      this.dialogSuspend = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async saveCredit() {
      try {
        this.loading = true;
        const data = {
          amount: this.amount,
          creditDuration: this.creditDuration,
          startDate: this.startDate,
          paymentTypeProvider: this.paymentTypeProvider,
        };

        const response = await this.$axios.put(
          `/admin/credit-user/${this.editedItem._id}`,
          data,
          {
            headers: {
              "x-admin-token": this.token,
            },
          }
        );

        this.$store.commit("snackbar/show", {
          text: response.data.message || "User credited successfully",
          icon: "success",
        });

        this.initialize();
      } catch (error) {
        this.$store.commit("snackbar/show", {
          text: error.response?.data?.message || "Failed to credit user",
          icon: "error",
        });
      } finally {
        this.loading = false;
        this.closeCredit();
      }
    },
  },
};
</script>

<style scoped>
.users-dashboard {
  padding: 24px;
}

.header-section {
  margin-bottom: 24px;
}

.search-card {
  background-color: transparent !important;
  box-shadow: none !important;
}

.search-field {
  max-width: 400px;
}

.users-table-card {
  border-radius: 8px;
}

.actions-container {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.detail-label {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1rem;
  font-weight: 500;
}

/* Dark mode support */
.theme--dark .detail-label {
  color: rgba(255, 255, 255, 0.7);
}
</style>

<!-- <Actions>
  <Action name="Add user filtering" description="Add advanced filtering options for users by status, date, etc." />
  <Action name="Add user export" description="Implement functionality to export user data to CSV or Excel" />
  <Action name="Add user statistics" description="Create a dashboard with user statistics and charts" />
  <Action name="Implement batch actions" description="Add ability to perform actions on multiple users at once" />
  <Action name="Add user activity log" description="Create a detailed activity log for each user" />
</Actions> -->
