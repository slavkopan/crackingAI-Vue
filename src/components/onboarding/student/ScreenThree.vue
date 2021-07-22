<template>
  <div>
    <div class="margin-20">
      <form class="input-line">
      <div>
        <div>
        <h4 class="inline"> Education </h4>
      </div>
        <fieldset disabled>
          <div class="form-group required ">
          <label class="control-label" for="disabledTextInput">Your School</label>
          <p class="text-danger" v-if="notAllStanfordFilledOut">Must Input Information Related To Stanford</p>
          <input id="disabledTextInput" class="form-control" type="text" v-model="stanfordEducation" v-on:focus="toggleStanfordFilledOut()">
        </div>
    </fieldset>
        <div class="row">
          <div class="form-group required col-md-6">
              <label class="control-label">Major/Program</label>
              <input  class="form-control" type="text" placeholder="Major" v-model="stanfordDescription" v-on:focus="toggleStanfordFilledOut()">
          </div>
          <div class="form-group required col-md-6">
              <label class="control-label">Graduation Year (or expected)</label>
              <input  class="form-control" type="text" placeholder="Graduation Year" v-model="stanfordGraduation" v-on:focus="toggleStanfordFilledOut()">
          </div>
        </div>
      </div>
      <div v-for="(education, key) in educationData">
        <hr>
        <div>
          <h5 class="inline"> Education  {{key + 2}} </h5>
          <span class="hand-hover" title="Delete This Education" @click.prevent="deleteEducation(key)"> <i class="fa fa-minus-circle fa-2x icon-minus-color"></i></span>
        </div>
        <fieldset>
          <div class="form-group ">
          <label>Your School</label>
          <input class="form-control" type="text" placeholder="School" v-model="educationData[key].school">
        </div>
    </fieldset>
        <div class="row">
          <div class="form-group col-md-6">
              <label>Major/Program</label>
              <input  class="form-control" type="text" placeholder="Major" v-model="educationData[key].major">
          </div>
          <div class="form-group col-md-6">
              <label>Graduation Year (or expected)</label>
              <input  class="form-control" type="text" placeholder="Graduation Year" v-model="educationData[key].gradYear">
          </div>
        </div>
      </div>
      <div class="flex-content">
        <button class="btn btn-success" @click.prevent="addEducation()"> Add More Education </button>
      </div>
      <hr>
      <div class="form-group ">
      <label>GPA (Will Only Be Shared With Investors and Employers)</label>
      <input class="form-control" type="text" placeholder="GPA" v-model="gpa">
    </div>
      <hr>
      <div>
        <div>
        <h4 class="inline"> Test Scores </h4>
        <p> This won't be shared with other students. Only with investors and employers. </p>
      </div>

      <div v-for="(test, key) in testData">
        <hr v-if="testData.length >1">
        <div>
        <h5 class="inline"> Test  {{key + 1}} </h5>
        <span class="hand-hover" title="Delete This Test" @click.prevent="deleteTestData(key)"> <i class="fa fa-minus-circle fa-2x icon-minus-color"></i></span>
      </div>
        <div class="row">
          <div class="form-group col-md-6">
              <label>Test</label>
              <input  class="form-control" type="text" placeholder="Test" v-model="testData[key].test">
          </div>
          <div class="form-group col-md-6">
              <label>Score</label>
              <input  class="form-control" type="text" placeholder="Score" v-model="testData[key].score">
          </div>
        </div>
      </div>
      <div class="flex-content">
        <button v-if="educationData.length == 0" class="btn btn-success" @click.prevent="addTestData()"> Add A Test</button>
        <button v-if="educationData.length != 0" class="btn btn-success" @click.prevent="addTestData()"> Add More Scores </button>
      </div>

      </div>
      <div class="margin-top-shrunk">
        <div class="float-l">
          <button class="btn btn-primary" @click.prevent="toSecondScreen()">Previous Screen</button>
        </div>
        <div class="float-r">
          <button class="btn btn-primary float-r" @click.prevent="toFourthScreen()">Next Screen</button>
      </div>
    </div>
</form>

    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import OnboardingFunctions from '../scripts/onboarding.js'
import OnboardingService from '../../../services/onboardingService.js'
export default {
  name: 'StudentMainOnboarding',
  data () {
    return {
      stanfordEducation: 'Stanford University',
      stanfordGraduation: '',
      stanfordDescription: '',
      educationData: [],
      testData: [],
      gpa: '',
      notAllStanfordFilledOut: false
    }
  },
  computed: {
    ...mapGetters({
      onboardingSoFar: 'getOnboardingData'
    }),
    stanfordEdIsIssue () {
      if (this.stanfordEducation.length == 0 || this.stanfordGraduation.length == 0 || this.stanfordDescription.length == 0) {
        return true
      }
      return false
    }
  },
  methods: {
    toSecondScreen () {
      this.$router.push('/student-onboarding/2')
    },
    toFourthScreen () {
      let result = {}
      let stanfordEducation = {}
      stanfordEducation.school = this.stanfordEducation
      stanfordEducation.description = this.stanfordDescription
      stanfordEducation.gradYear = this.stanfordGraduation
      result.stanford_education = stanfordEducation
      let otherEducation = {}
      otherEducation.education = this.educationData
      result = OnboardingFunctions.joinObjects(result, otherEducation)
      result.gpa = this.gpa
      let testInformation = {}
      testInformation.tests = this.testData
      result = OnboardingFunctions.joinObjects(result, testInformation)
      if (!this.stanfordEdIsIssue) {
        this.$store.dispatch('onboarding', result)
        this.$router.push('/student-onboarding/4')
      } else {
        this.notAllStanfordFilledOut = true
      }
    },
    addEducation () {
      this.educationData.push({school: '', major: '', gradYear: ''})
    },
    addTestData () {
      this.testData.push({test: '', score: ''})
    },
    deleteTestData (index) {
      this.testData.splice(index, 1)
    },
    deleteEducation (index) {
      this.educationData.splice(index, 1)
    },
    toggleStanfordFilledOut () {
      this.notAllStanfordFilledOut = false
    }
  }
}

</script>

<style scoped>
.ask-color{
  background-color: #FF420E;
  color: white;
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
@media (min-width: 767px) {
  .float-l{
    float: left;
    margin-left: 0px;
  }
  .float-r{
    float: right;
    margin-right: 0px;
  }

}

@media (max-width: 767px) {
  .float-l{
    display: flex;
    justify-content: center;
    margin-bottom:2.5%;
  }
  .float-r{
    display: flex;
    justify-content: center;
  }

}
.float-right{
  float:right;
}
.hand-hover:hover{
  cursor: pointer;
}
hr{
height: 1px;
color: #123455;
background-color: #123455;
border: none;

}
.icon-minus-color{
  color: red;
}
.icon-plus-color{
  color: green;
}
.img-restricted{
  height: 200px;
  width: 200px;
}
.inline{
  display: inline;
}
.left-margin{
  margin-left: 5%;
}
.margin-top{
  margin-top: 5%;
}
.margin-top-shrunk{
  margin-top: 2.5%;
}

.margin-20{
  margin-left:20%;
  margin-right: 20%;
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
.top-margin{
  margin-top: 2.5%;
}

.form-group.required .control-label:after {
  content:"*";
  color:red;
}

</style>
