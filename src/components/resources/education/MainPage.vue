<template>
  <div>
    <div class="left-margin">
      <h2>Education Resources </h2>
    </div>

    <div class="left-margin">
      <h6>Some of the educational resources recommended from our network of student
        entrepreneurs, investors, and advisors. </h6>
    </div>

    <div class="flex-row top-margin">
      <div class="form-group input-group w-80">
                <input type="text" class="form-control" placeholder="Search for..." v-model="resourceQuery" @keyup.enter="queryEducationResources()">
                <div class="input-group-append ml-4">
                  <button class="btn btn-primary" type="button" @click.prevent="queryEducationResources()" >Search</button>
                </div>
      </div>
    </div>
    <div class="flex-content"> <img src="../../../../static/assets/img/algolia/search-by-algolia-light.svg"> </div>

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
    <div class = "row left-margin right-margin">
      <div v-for="resource in paginatedData" class = "col-md-6 top-margin">
        <div class="card border bg-primary white-text h-100 w-100">
            <div class="card-body">
              <h4 class="white-text">{{resource.title}}</h4>
              <span class="badge badge-pill badge-warning">{{resource.topic}}</span>
              <a v-bind:href="resource.link" target="_blank">
                <button type="button" class="btn btn-md read-more display-block top-margin">Read More</button>
              </a>
            </div>
        </div>
      </div>
    </div>
    <div>
    <button :disabled="pageNumber === 0"  class="btn btn-primary float-l" @click.prevent="prevPage()"><i class="fa fa-arrow-left"></i>Previous </button>
    <button :disabled="pageNumber >= pageCount -1"  class="btn btn-primary float-r" @click.prevent="nextPage()">Next <i class="fa fa-arrow-right"></i></button>
  </div>
  </div>

</template>
<script>
import EducationResourceService from '../../../services/educationResourceService.js'
import { SemipolarSpinner } from 'epic-spinners'
export default {
  name: 'EducationResources',
  components: {
    SemipolarSpinner
  },
  data () {
    return {
      resources: [],
      showSpinner: true,
      resourceQuery: '',
      pageNumber: 0,
      size: 20
    }
  },
  mounted () {
    var self = this
    EducationResourceService.getResources().then(function (querySnapshot) {
      self.resources = querySnapshot.docs.map(doc => doc.data())
      self.showSpinner = false
    })
  },
  computed: {
    pageCount () {
      let l = this.resources.length,
        s = this.size
      return Math.floor(l / s)
    },
    paginatedData () {
      const start = this.pageNumber * this.size,
        end = start + this.size
      return this.resources
        .slice(start, end)
    }
  },
  methods: {
    queryEducationResources () {
      let self = this
      EducationResourceService.queryResources(this.resourceQuery).then(function (hits) {
        self.resources = hits
        console.log(hits.length, 'hits')
        self.resourceQuery = ''
      })
    },
    nextPage () {
      this.pageNumber++
    },
    prevPage () {
      this.pageNumber--
    }
  }
}
</script>
<style scoped>

.ask-color{
  background-color: #FF420E;
  color: white;
}

.black-background{
  background-color: black;
  color:black;
}
.display-block{
  display: block;
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
.read-more{
  background-color: white;
  /* primary */
  color:#50a1ff;
}
.right-margin{
  margin-right: 5%;
}
.top-margin{
  margin-top: 2.5%;
}
.top-margin-5{
  margin-top: 5%
}
.top-margin-shrunk{
  margin-top: .5%;
}

.white-text{
  color: white;
}

</style>
