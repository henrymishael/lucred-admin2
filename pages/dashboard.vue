<template>
  <div class="dashboard">
    <!-- Header with refresh button -->
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Lucred Dashboard</h1>
      </v-col>
      <v-spacer></v-spacer>
      <div class="page-header-right">
        <v-btn
          icon
          @click="fetchDashboardData"
          :loading="loading"
          :disabled="loading"
        >
          <v-icon class="text--secondary">mdi-refresh</v-icon>
        </v-btn>
      </div>
    </v-row>

    <!-- Loading state -->
    <v-row v-if="loading && !metrics">
      <v-col cols="12">
        <v-skeleton-loader
          type="card-heading, list-item-three-line@4"
          class="mb-4"
        ></v-skeleton-loader>
        <v-skeleton-loader type="table"></v-skeleton-loader>
      </v-col>
    </v-row>

    <!-- Error state -->
    <v-row v-else-if="error && !metrics">
      <v-col cols="12">
        <v-alert type="error" outlined border="left" prominent>
          <v-row align="center">
            <v-col class="grow">
              Failed to load dashboard data. {{ error }}
            </v-col>
            <v-col class="shrink">
              <v-btn color="error" @click="fetchDashboardData"> Retry </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>

    <template v-else>
      <v-row v-if="metrics">
        <v-col cols="12">
          <v-alert dense text type="success">
            Login Successfully! Welcome to <strong>Lucred Dashboard</strong>
          </v-alert>
        </v-col>
      </v-row>

      <!-- Key Metrics Summary -->
      <v-row v-if="metrics">
        <v-col cols="12" md="3" sm="6">
          <v-card class="metric-card">
            <v-card-text>
              <div class="d-flex">
                <div class="metric-content">
                  <div class="text-overline">Total Users</div>
                  <div class="text-h4 font-weight-bold">
                    {{ metrics.users.totalUsers }}
                  </div>
                  <div class="text-caption">
                    {{ metrics.users.totalBVNUsers }} BVN verified
                  </div>
                </div>
                <v-avatar size="50" color="indigo" class="white--text ml-auto">
                  <v-icon dark>mdi-account-group</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3" sm="6">
          <v-card class="metric-card">
            <v-card-text>
              <div class="d-flex">
                <div class="metric-content">
                  <div class="text-overline">Total Products</div>
                  <div class="text-h4 font-weight-bold">
                    {{ metrics.merchantMetrics.totalProducts }}
                  </div>
                  <div class="text-caption">
                    {{ metrics.category }} categories
                  </div>
                </div>
                <v-avatar size="50" color="cyan" class="white--text ml-auto">
                  <v-icon dark>mdi-package-variant-closed</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3" sm="6">
          <v-card class="metric-card">
            <v-card-text>
              <div class="d-flex">
                <div class="metric-content">
                  <div class="text-overline">Total Sales</div>
                  <div class="text-h4 font-weight-bold">
                    ₦{{ formatNumber(metrics.transactionMetrics.totalAmount) }}
                  </div>
                  <div class="text-caption">
                    {{ metrics.merchantMetrics.totalOrders }} orders
                  </div>
                </div>
                <v-avatar size="50" color="green" class="white--text ml-auto">
                  <v-icon dark>mdi-cash-register</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="3" sm="6">
          <v-card class="metric-card">
            <v-card-text>
              <div class="d-flex">
                <div class="metric-content">
                  <div class="text-overline">Credit Score</div>
                  <div class="text-h4 font-weight-bold">
                    {{
                      (metrics.walletMetrics.averageCreditScore * 100).toFixed(
                        2
                      )
                    }}%
                  </div>
                  <div class="text-caption">Average across users</div>
                </div>
                <v-avatar size="50" color="orange" class="white--text ml-auto">
                  <v-icon dark>mdi-chart-line</v-icon>
                </v-avatar>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- User Metrics Section -->
      <v-row v-if="metrics">
        <v-col cols="12">
          <v-card class="section-card">
            <v-card-title class="section-title">
              <v-icon left color="primary">mdi-account-multiple</v-icon>
              User Metrics
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Users
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.users.totalUsers }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      BVN Verified Users
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.users.totalBVNUsers }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Work Profiles
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.users.totalWorkProfiles }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Credit Cards
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.users.totalCreditCards }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Account Verified
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.users.totalAccountVerifiedUsers }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Active Users
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.users.totalActiveUsers }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Cart Items
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.users.totalCartItems }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Recurring Payments
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.users.totalRecurringPaymentStatus }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Credit Metrics Section -->
      <v-row v-if="metrics">
        <v-col cols="12">
          <v-card class="section-card">
            <v-card-title class="section-title">
              <v-icon left color="green">mdi-credit-card</v-icon>
              Credit Metrics
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" lg="4">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Credits Issued
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(metrics.creditMetrics.totalCreditsIssued)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="4">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Credit Arrears
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(metrics.creditMetrics.totalCreditArrears)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="4">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Amount Paid
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{ formatNumber(metrics.creditMetrics.totalAmountPaid) }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="4">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Credit Payment
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(metrics.creditMetrics.totalCreditPayment)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="4">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Interest Payment
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(metrics.creditMetrics.totalInterestPayment)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="4">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Monthly Payment
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(metrics.creditMetrics.totalMonthlyPayment)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="4">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Pending Applications
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.creditMetrics.pendingApplications }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="4">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Declined Credits
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.declinedCreditsMetrics }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Wallet Metrics Section -->
      <v-row v-if="metrics">
        <v-col cols="12">
          <v-card class="section-card">
            <v-card-title class="section-title">
              <v-icon left color="blue">mdi-wallet</v-icon>
              Wallet Metrics
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Wallet Count
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.walletMetrics.totalWalletCount }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Wallet Balance
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(metrics.walletMetrics.totalWalletBalance)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Spending Wallet Balance
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(
                          metrics.walletMetrics.totalSpendingWalletBalance
                        )
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Credit Line Requests
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(
                          metrics.walletMetrics.totalCreditLineRequest
                        )
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Approved Credits
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.walletMetrics.totalApprovedCredits }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Declined Credits
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.walletMetrics.totalDeclinedCredits }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Average Credit Score
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{
                        (
                          metrics.walletMetrics.averageCreditScore * 100
                        ).toFixed(2)
                      }}%
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Merchant Metrics Section -->
      <v-row v-if="metrics">
        <v-col cols="12">
          <v-card class="section-card">
            <v-card-title class="section-title">
              <v-icon left color="deep-purple">mdi-store</v-icon>
              Merchant Metrics
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Merchants
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.merchantMetrics.totalMerchants }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Orders
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.merchantMetrics.totalOrders }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Products
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.merchantMetrics.totalProducts }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Sales
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{ formatNumber(metrics.merchantMetrics.totalSales) }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Wallet Balance
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(metrics.merchantMetrics.totalWalletBalance)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Available Balance
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(
                          metrics.merchantMetrics.totalAvailableBalance
                        )
                      }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Transaction Metrics Section -->
      <v-row v-if="metrics">
        <v-col cols="12">
          <v-card class="section-card">
            <v-card-title class="section-title">
              <v-icon left color="amber darken-3">mdi-cash-multiple</v-icon>
              Transaction Metrics
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Total Amount
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(metrics.transactionMetrics.totalAmount)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Successful Transactions
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.transactionMetrics.successfulCount }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Failed Transactions
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.transactionMetrics.failedCount }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Pending Transactions
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{ metrics.transactionMetrics.pendingCount }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Available Balance
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(
                          metrics.transactionMetrics.totalAvailableBalance
                        )
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Ledger Balance
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(
                          metrics.transactionMetrics.totalLedgerBalance
                        )
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Checkout Amount
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(metrics.transactionMetrics.checkoutAmount)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Checkout Transactions
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{
                        formatNumber(metrics.transactionMetrics.checkoutCount)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Credit Deposit Transactions
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{
                        formatNumber(
                          metrics.transactionMetrics.creditDepositCount
                        )
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Credit Deposit Amount
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(
                          metrics.transactionMetrics.creditDepositAmount
                        )
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Credit Repayment Transactions
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{
                        formatNumber(
                          metrics.transactionMetrics.creditRepaymentCount
                        )
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Credit Repayment Amount
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(
                          metrics.transactionMetrics.creditRepaymentAmount
                        )
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Credit Swap Transactions
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{
                        formatNumber(metrics.transactionMetrics.creditSwapCount)
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Credit Swap Amount
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(
                          metrics.transactionMetrics.creditSwapAmount
                        )
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Spending Deposit Amount
                    </div>
                    <div class="text-h6 font-weight-bold">
                      ₦{{
                        formatNumber(
                          metrics.transactionMetrics.spendDepositAmount
                        )
                      }}
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" sm="6" lg="3">
                  <div class="metric-item">
                    <div class="text-subtitle-2 grey--text text--darken-1">
                      Spending Deposit Transactions
                    </div>
                    <div class="text-h6 font-weight-bold">
                      {{
                        formatNumber(
                          metrics.transactionMetrics.spendDepositCount
                        )
                      }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script>
export default {
  layout: "dashboard", // Keep the dashboard layout which includes the sidebar
  name: "Dashboard",
  data() {
    return {
      loading: false,
      error: null,
      metrics: null,
    };
  },
  computed: {
    token() {
      try {
        return JSON.parse(localStorage.getItem("admin_token"));
      } catch (e) {
        return null;
      }
    },
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    formatNumber(number) {
      return new Intl.NumberFormat().format(Math.round(number));
    },
    fetchDashboardData() {
      this.loading = true;
      this.error = null;

      // Check if token exists
      if (!this.token) {
        this.error = "Authentication token not found. Please login again.";
        this.loading = false;
        this.$router.push("/login");
        return;
      }

      // Get data from API with the specified header format
      this.$axios
        .get("admin/admin-metrics", {
          headers: {
            "x-admin-token": this.token,
          },
        })
        .then((res) => {
          const { data } = res;
          if (data?.statusCode === 200) {
            this.metrics = data.data;
            this.$store.commit("snackbar/show", {
              text: "Dashboard data loaded successfully",
              icon: "success",
            });
          } else {
            this.error = data.message || "Failed to load dashboard data";
            this.$store.commit("snackbar/show", {
              text: this.error,
              icon: "error",
            });
          }
        })
        .catch((err) => {
          const { response } = err;
          this.error = response?.data?.message || "Network error occurred";
          this.$store.commit("snackbar/show", {
            text: this.error,
            icon: "error",
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.dashboard {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20px;
}

.section-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
  transition: transform 0.3s, box-shadow 0.3s;
}

.section-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

.section-title {
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  font-weight: bold;
}

.metric-card {
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s;
  border-left: 4px solid transparent;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.metric-card:nth-child(1) {
  border-left-color: indigo;
}

.metric-card:nth-child(2) {
  border-left-color: cyan;
}

.metric-card:nth-child(3) {
  border-left-color: green;
}

.metric-card:nth-child(4) {
  border-left-color: orange;
}

.metric-content {
  flex: 1;
}

.metric-item {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  height: 100%;
  transition: background-color 0.3s;
}

.metric-item:hover {
  background-color: #f0f0f0;
}

/* Responsive styles */
@media (max-width: 960px) {
  .dashboard {
    padding: 16px;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .metric-item {
    padding: 12px;
    margin-bottom: 12px;
  }
}

@media (max-width: 600px) {
  .dashboard {
    padding: 12px;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .metric-item {
    padding: 10px;
  }

  .text-h4 {
    font-size: 1.5rem !important;
  }

  .text-h6 {
    font-size: 1rem !important;
  }

  .text-subtitle-2 {
    font-size: 0.8rem !important;
  }
}
</style>
