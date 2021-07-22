<template>
  <div>
    <div class="left-margin">
      <h2>Investors </h2>
    </div>

    <div v-if="showSpinner" class="top-margin-5">
      <div class="flex-content">
        <semipolar-spinner
          :animation-duration="2000"
          :size="65"
          color="black"
  />
      </div>
      <h4 class="text-center"> Loading... </h4>
    </div>

    <div v-if="!showSpinner">

    <div class="flex-row top-margin">
      <div class="form-group input-group w-80">
                <input type="text" class="form-control" placeholder="Search for investors..." v-model="investorQuery" @keyup.enter="queryInvestors()">
                <div class="input-group-append ml-4">
                  <button class="btn btn-primary" type="button" @click ="queryInvestors()">Go!</button>
                </div>
      </div>
    </div>
    <div class="flex-content"> <img src="../../../../static/assets/img/algolia/search-by-algolia-light.svg"> </div>

    <div class = "row left-margin right-margin mb-2">
      <div v-for="investor in paginatedInvestors"  class = "col-lg-4 col-md-6 col-sm-6 top-margin flex-fill">
        <div class="card border">
            <div class="card-body investor-profile">
              <div class="card-img flex-content" :style="{ backgroundImage: 'url(' + investor.profile_img_add + ')' }">
                <!--<img :src="student.profile_img_add" alt="..." class="rounded-circle img-restricted">-->
              </div>
              <h4 class="card-title text-center">{{investor.first_name}} {{investor.last_name}}</h4>
              <h6 class="text-center mb-7"> {{truncateHeadline(investor.headline)}} </h6>
              <div class="flex-content">
                <button type="button" class="btn btn-md btn-primary" @click="goToInvestor(investor.userId)"> View {{investor.first_name}}'s Profile </button>
              </div>
            </div>
        </div>
      </div>
    </div>
    <div>
    <button :disabled="pageNumber === 0"  class="btn btn-primary float-l" @click.prevent="prevPage()"><i class="fa fa-arrow-left"></i>Previous </button>
    <button :disabled="pageNumber >= pageCount -1"  class="btn btn-primary float-r" @click.prevent="nextPage()">Next <i class="fa fa-arrow-right"></i></button>
    </div>
  </div>
</div>

</template>
<script>
import InvestorService from '../../../services/investorService.js'
import UserService from '../../../services/userService.js'
import { SemipolarSpinner } from 'epic-spinners'
export default {
  name: 'QAMain',
  components: {
    SemipolarSpinner
  },
  data () {
    return {
      userHasQuestion: false,
      investorQuery: '',
      investors: [],
      showSpinner: true,
      pageNumber: 0,
      size: 15
    }
  },
  computed: {
    pageCount () {
      let l = this.investors.length,
        s = this.size
      return Math.floor(l / s)
    },
    paginatedInvestors () {
      const start = this.pageNumber * this.size,
        end = start + this.size
      return this.investors
        .slice(start, end)
    }
  },
  methods: {
    queryInvestors () {
      console.log('investor query')
      let self = this
      UserService.queryInvestors(this.investorQuery).then(function (hits) {
        self.pageNumber = 0 // reset page number
        self.investors = hits
        self.investorQuery = ''
      })
    },
    goToInvestor (id) {
      this.$router.push({ name: 'OtherInvestorProfilePage', params: { id }})
    },
    getInvestors () {
      var self = this
      InvestorService.getInvestors().then(function (hits) {
        self.investors = hits
        self.showSpinner = false
      })
    },
    nextPage () {
      this.pageNumber++
    },
    prevPage () {
      this.pageNumber--
    },
    truncateHeadline (headline) {
      if (headline.length < 100) return headline
      let result = headline.substr(0, 100) + '...'
      return result
    }
  },
  mounted () {
    this.getInvestors()
  }
}
</script>
<style scoped>

.ask-color{
  background-color: #FF420E;
  color: white;
}

.card {
  height: 100%;
}
 @media only screen and (max-width: 768px) {
  .card {
    width: 240px;
    margin: 0 auto;
  }
}

.card .mb-7 {
    margin-bottom: 1rem !important;
}

.card-img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-size: cover;
  margin: 0 auto;
  background-position: center;
}

.form-control {
    padding: 6px 12px;
}

.flex-content{
  display: flex;
  justify-content: center;
}

.flex-row{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}
.float-l{
  float: left;
  margin-left: 0px;
}
.float-r{
  float: right;
  margin-right: 0px;
}
.float-right{
  float:right;
}

.img-restricted{
  height: 200px;
  width: 200px;
  object-fit: cover;
}

.left-margin{
  margin-left: 5%;
}
.margin-top{
  margin-top: 5%;
}
.no-left-margin{
  margin-left: 0 !important;
}

.no-left-padding{
  padding-left: 0 !important;
}

@media (max-width:400px){
  .center-mobile{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.right-margin{
  margin-right: 5%;
}

.investor-profile{
  flex-direction: column;
}

.top-margin{
  margin-top: 2.5%;
}

</style>
