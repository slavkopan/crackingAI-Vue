<template>
  <div>
    <div class="margin-20">
      <form class="input-line">
      <div>
        <div class="flex-content">
          <h3> Final Information </h3>
        </div>
        <div>
        <h4 class="inline"> Locker Items </h4>
        <p> Locker Items are a way to showcase cool things you've done to investors and students. These
          are things such as awards, publications you've written, past projects (you'll be able to post your most recent and current projects after
          you finish onboarding). </p>
      </div>

      <div v-for="(items, key) in lockerItems">
        <hr>
        <div>
          <h5 class="inline"> Item {{key + 1}} </h5>
          <span class="hand-hover" title="Delete This Item" @click.prevent="deleteItem(key)"> <i class="fa fa-minus-circle fa-2x icon-minus-color"></i></span>
        </div>
        <div class="form-group ">
            <label>Title</label>
            <input class="form-control" type="text" placeholder="Item Title" v-model="lockerItems[key].title">
        </div>
        <div class="form-group ">
            <label>Link</label>
            <div v-if="invalidLink(lockerItems[key].link)">
              <p class="text-danger"> Link must begin with http:// or https://</p>
            </div>
            <input class="form-control inline" type="text" placeholder="Item Link" v-model="lockerItems[key].link">
        </div>
          <div class="form-group">
            <label>Description</label>
            <textarea class="form-control" rows="4" placeholder="Item Description" v-model="lockerItems[key].description"></textarea>
          </div>
        <div class="row">
          <div class="form-group col-md-6">
              <label>Year Start</label>
              <input  class="form-control" type="text" placeholder="Start" v-model="lockerItems[key].start">
            </div>
          <div class="form-group col-md-6">
            <label>Year End</label>
            <input  class="form-control" type="text" placeholder="End" v-model="lockerItems[key].end">
        </div>
      </div>
      </div>
      <div class="flex-content">
        <button v-if="lockerItems.length == 0" class="btn btn-success" @click.prevent="addItem()"> Add An Item </button>
        <button v-if="lockerItems.length != 0" class="btn btn-success" @click.prevent="addItem()"> Add Another Item </button>
      </div>
    </div>

    <hr>

    <div class="form-group">
        <label>Phone Number</label>
        <p class="black"> Be notified when someone messages you, responds to your question, or comments on your project </p>
        <input class="form-control" type="text" placeholder="Phone Number" v-model="phoneNumber">
    </div>

    <hr>

    <div>
      <div class="form-group required">
        <label class="control-label">How Do You Spend Your Free Time?</label>
        <p class="black">This question gives both investors and students more of an insight into who you are </p>
        <p class="text-danger" v-if="invalidFreeTime">Must Fill Out This Field</p>
        <textarea class="form-control" rows="4" placeholder="Tell us more" v-model="userFreeTime" v-on:focus="toggleNoFreeTime()">></textarea>
      </div>
    </div>

    <div>
      <div class="form-group">
        <label>Anything Else We Should Know About You? </label>
        <textarea class="form-control" rows="4" placeholder="Anything else?" v-model="other_things_me"></textarea>
      </div>
    </div>

    <hr>
    <h4 class="inline"> Social Links </h4>
    <p> Want to show off your Github commits? Or Want More Facebook Friends? </p>

    <div class="row">
      <div class="form-group col-md-6">
        <label>Link To GitHub Account</label>
        <input class="form-control" type="text" placeholder="Link" v-model="gitHubLink">
      </div>
      <div class="form-group col-md-6">
        <label>Link To LinkedIn Account</label>
        <input class="form-control" type="text" placeholder="Link" v-model="linkedinLink">
      </div>
    </div>

    <div class="row">
      <div class="form-group col-md-6">
        <label>Link To Facebook Account</label>
        <input class="form-control" type="text" placeholder="Link" v-model="facebookLink">
      </div>
      <div class="form-group col-md-6">
        <label>Link To Twitter Account</label>
        <input class="form-control" type="text" placeholder="Link" v-model="twitterLink">
      </div>
    </div>

    <div class="margin-top-shrunk margin-bottom-2-5">
      <div class="float-l">
        <button class="btn btn-primary" @click.prevent="toThirdScreen()">Previous Screen</button>
    </div>
    <div class="float-r">
      <button  class="btn btn-primary" @click.prevent="onboardingFinished()">Finish Onboarding</button>
  </div>
  </div>
        </form>

    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { formatNumber } from 'libphonenumber-js'
import OnboardingFunctions from '../scripts/onboarding.js'
import OnboardingService from '../../../services/onboardingService.js'
export default {
  name: 'StudentMainOnboarding',
  data () {
    return {
      userFreeTime: '',
      lockerItems: [],
      gitHubLink: '',
      other_things_me: '',
      phoneNumber: '',
      linkedinLink: '',
      twitterLink: '',
      facebookLink: '',
      invalidFreeTime: false
    }
  },
  computed: {
    ...mapGetters({
      onboardingSoFar: 'getOnboardingData'
    }),
    userFreeTimeIsValid () {
      return this.userFreeTime.length > 0
    }
  },
  mounted () {
    let linkedinData = OnboardingService.getLinkedinOnboardingData()
    this.linkedinLink = this.checkForNull(linkedinData.publicProfileUrl)
  },
  methods: {
    onboardingFinished () {
      let result = {}
      let lockerData = {}
      lockerData.lockerItems = this.lockerItems
      result = OnboardingFunctions.joinObjects(result, lockerData)
      result.free_time = this.userFreeTime
      result.garage_projects = []
      result.linkedinLink = this.linkedinLink
      result.gitHubLink = this.gitHubLink
      result.twitterLink = this.twitterLink
      result.facebookLink = this.facebookLink
      result.other_things_me = this.other_things_me
      result.phone_number = this.getPhoneNumber(this.phoneNumber)
      result.onboarded = true

      if (this.userFreeTimeIsValid) {
        this.$store.dispatch('finishStudentOnboarding', result)
      } else {
        this.invalidFreeTime = true
      }
    },
    addItem () {
      this.lockerItems.push({title: '', link: '', description: '', start: '', end: ''})
    },
    deleteItem (index) {
      this.lockerItems.splice(index, 1)
    },
    invalidLink (link) {
      if (link == '') return false
      let checkHttp = link.substring(0, 7)
      if (checkHttp == 'http://') return false
      let checkHttps = link.substring(0, 8)
      if (checkHttps == 'https://') return false
      return true
    },
    toThirdScreen () {
      this.$router.push('/student-onboarding/3')
    },
    checkForNull (field) {
      if (!field) return ''
      else return field
    },
    toggleNoFreeTime () {
      this.invalidFreeTime = false
    },
    getPhoneNumber (string) {
      let newString = string.match(/[0-9]{0,14}/g)

      if (newString === null) {
        return ''
      }

      // Join parts returned from RegEx match
      newString = newString.join('')

      // Start number with "+"
      return newString
    }
  }
}

</script>

<style scoped>
.ask-color{
  background-color: #FF420E;
  color: white;
}

.black{
  color:black;
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
.margin-bottom-2-5{
  margin-bottom: 2.5%;
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
