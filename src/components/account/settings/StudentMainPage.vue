<template>
  <div>
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
    <div class="margin-20">
      <form class="input-line">
        <div class="flex-content">
          <h2>Account Information </h2>
        </div>

        <div class = "flex-content">
          <div class= "">
            <img :src="userProfileImgSrc" alt="..." class="rounded-circle img-restricted">
          </div>
        </div>

          <div class="row">
            <div class="form-group col-md-6">
                <label>First Name</label>
                <input  class="form-control" type="text" placeholder="First Name" v-model="userFirstName">
            </div>
            <div class="form-group col-md-6">
                <label>Last Name</label>
                <input  class="form-control" type="text" placeholder="Last Name" v-model="userLastName">
            </div>
          </div>

          <div class="form-group ">
              <label>Headline</label>
              <input class="form-control" type="text" placeholder="Headline" v-model="userHeadline">
          </div>

          <div class="form-group required ">
              <label class="control-label">Location</label>
              <p>City, Region, etc (ex: San Francisco Bay Area) </p>
              <input class="form-control" type="text" placeholder="Location" v-model="userLocation" v-on:focus="toggleNotValid()">
          </div>

          <div class="form-group required ">
              <label class="control-label">Email</label>
              <input class="form-control" type="text" placeholder="Email" v-model="userEmail" v-on:focus="toggleNotValid()">
          </div>

          <div class="form-group required ">
              <label class="control-label">Stanford Email</label>
              <input class="form-control" type="text" placeholder="Stanford Email" v-model="stanfordEmail" v-on:focus="toggleNotValid()">
          </div>

          <div>
          <h4 class="inline"> Experiences </h4>
        </div>

        <div v-for="(experience, key) in experiences">
          <hr>
          <div>
            <h5 class="inline"> Experience  {{key + 1}} </h5>
            <span class="hand-hover" title="Delete This Experience" @click.prevent="deleteExperience(key)"> <i class="fa fa-minus-circle fa-2x icon-minus-color"></i></span>
          </div>
          <div class="form-group ">
              <label>Title</label>
              <input class="form-control" type="text" placeholder="Experience Title" v-model="experiences[key].title">
          </div>
          <div class="form-group ">
              <label>Company</label>
              <input class="form-control" type="text" placeholder="Company Name" v-model="experiences[key].company">
          </div>
            <div class="form-group">
              <label>Description</label>
              <textarea class="form-control" rows="4" placeholder="Experience Description" v-model="experiences[key].description"></textarea>
            </div>
          <div class="row">
            <div class="form-group col-md-6">
                <label>Year Start</label>
                <input  class="form-control" type="text" placeholder="Start" v-model="experiences[key].start">
              </div>
            <div class="form-group col-md-6">
              <label>Year End</label>
              <input  class="form-control" type="text" placeholder="End" v-model="experiences[key].end">
          </div>
        </div>
      </div>
      <div class="flex-content">
        <button v-if="experiences.length == 0" class="btn btn-success" @click.prevent="addExperience()"> Add An Experience </button>
        <button v-if="experiences.length != 0" class="btn btn-success" @click.prevent="addExperience()"> Add Another Experience </button>
      </div>

      <div>
        <div>
        <h4 class="inline"> Education </h4>
      </div>
        <fieldset disabled>
          <div class="form-group ">
          <label for="disabledTextInput">Your School</label>
          <input id="disabledTextInput" class="form-control" type="text" v-model="stanfordEducation">
        </div>
    </fieldset>
        <div class="row">
          <div class="form-group col-md-6">
              <label>Major/Program</label>
              <input  class="form-control" type="text" placeholder="Major" v-model="stanfordDescription">
          </div>
          <div class="form-group col-md-6">
              <label>Graduation Year (or expected)</label>
              <input  class="form-control" type="text" placeholder="Graduation Year" v-model="stanfordGraduation">
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

      <div>
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
      <div class="form-group">
        <label>How Do You Spend Your Free Time?</label>
        <textarea class="form-control" rows="4" placeholder="Tell us more" v-model="userFreeTime"></textarea>
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

      </div>
          <div v-if="updatedProfile" class="flex-content">
          <h4 class="text-success"> Successfully Updated Profile! </h4>
          </div>
          <div class="flex-content">
          <button class="btn btn-primary" @click.prevent.prevent="updateAccount()">Update Profile</button>

        </div>

        </form>

    </div>
  </div>

  </div>

</template>

<script>
import UserService from '../../../services/userService.js'
import { SemipolarSpinner } from 'epic-spinners'
export default {
  name: 'AccountSettingsMain',
  components: {
    SemipolarSpinner
  },
  data () {
    return {
      curUser: {},
      userFirstName: '',
      userLastName: '',
      userProfileImgSrc: '',
      userHeadline: '',
      experiences: [],
      educationData: [],
      testData: [],
      lockerItems: [],
      userFreeTime: '',
      gitHubLink: '',
      userEmail: '',
      stanfordEmail: '',
      stanfordEducation: '',
      stanfordDescription: '',
      stanfordGraduation: '',
      userLocation: '',
      phoneNumber: '',
      other_things_me: '',
      linkedinLink: '',
      facebookLink: '',
      twitterLink: '',
      gpa: '',
      showSpinner: true,
      updatedProfile: false
    }
  },
  methods: {
    updateAccount () {
      let update = {}
      update.first_name = this.userFirstName
      update.last_name = this.userLastName
      update.profile_img_add = this.userProfileImgSrc
      update.headline = this.userHeadline
      update.location = this.userLocation
      update.experiences = this.experiences
      update.education = this.educationData
      update.tests = this.testData
      update.lockerItems = this.lockerItems
      update.free_time = this.userFreeTime
      update.gitHubLink = this.gitHubLink
      update.email = this.userEmail
      update.stanfordEmail = this.stanfordEmail
      update.phone_number = this.phoneNumber
      update.facebookLink = this.facebookLink
      update.twitterLink = this.twitterLink
      update.linkedinLink = this.linkedinLink
      update.other_things_me = this.other_things_me
      update.gpa = this.gpa
      update.stanford_education = {}
      update.stanford_education.school = this.stanfordEducation
      update.stanford_education.description = this.stanfordDescription
      update.stanford_education.gradYear = this.stanfordGraduation
      let result = this.getFormatedUpdateData(update)
      let curUserId = UserService.getCurrentUserId()
      UserService.updateStudent(curUserId, result, this.profileUpdated)
    },
    getFormatedUpdateData (update) {
      let result = {
        first_name: update.first_name,
        last_name: update.last_name,
        profile_img_add: update.profile_img_add,
        headline: update.headline,
        experiences: update.experiences,
        education: update.education,
        tests: update.tests,
        lockerItems: update.lockerItems,
        free_time: update.free_time,
        gitHubLink: update.gitHubLink,
        email: update.email,
        stanfordEmail: update.stanfordEmail,
        facebookLink: update.facebookLink,
        twitterLink: update.twitterLink,
        linkedinLink: update.linkedinLink,
        phone_number: update.phone_number,
        other_things_me: update.other_things_me,
        location: update.location,
        gpa: update.gpa,
        stanford_education: {
          school: update.stanford_education.school,
          description: update.stanford_education.description,
          gradYear: update.stanford_education.gradYear
        }
      }
      console.log('result for update', result)
      return result
    },
    addExperience () {
      this.experiences.push({title: '', company: '', description: '', start: '', end: ''})
    },
    deleteExperience (index) {
      this.experiences.splice(index, 1)
    },
    deleteEducation (index) {
      this.educationData.splice(index, 1)
    },
    addEducation () {
      this.educationData.push({school: '', major: '', gradYear: ''})
    },
    deleteTestData (index) {
      this.testData.splice(index, 1)
    },
    addTestData () {
      this.testData.push({test: '', score: ''})
    },
    deleteItem (index) {
      this.lockerItems.splice(index, 1)
    },
    invalidLink (link) {
      if (link == '') return false
      let checkHttp = link.substring(0, 7)
      console.log('http', link.substring(0, 7))
      if (checkHttp == 'http://') return false
      let checkHttps = link.substring(0, 8)
      if (checkHttps == 'https://') return false
      console.log('https', link.substring(0, 8))
      return true
    },
    addItem () {
      this.lockerItems.push({title: '', link: '', description: '', start: '', end: ''})
    },
    profileUpdated () {
      this.updatedProfile = true
    }
  },
  mounted () {
    let curUserId = UserService.getCurrentUserId()
    let self = this
    UserService.getUserIsStudent(curUserId).then(function (student) {
      self.showSpinner = false
      self.curUser = student

      self.userFirstName = self.curUser.first_name

      self.userLastName = self.curUser.last_name

      self.userProfileImgSrc = self.curUser.profile_img_add

      self.userHeadline = self.curUser.headline

      self.experiences = self.curUser.experiences

      self.educationData = self.curUser.education

      self.testData = self.curUser.tests

      self.lockerItems = self.curUser.lockerItems

      self.userFreeTime = self.curUser.free_time

      self.gitHubLink = self.curUser.gitHubLink

      self.stanfordEducation = self.curUser.stanford_education.school

      self.stanfordDescription = self.curUser.stanford_education.description

      self.stanfordGraduation = self.curUser.stanford_education.gradYear

      self.userEmail = self.curUser.email
      self.phoneNumber = self.curUser.phone_number
      self.stanfordEmail = self.curUser.stanfordEmail
      self.userLocation = self.curUser.location
      self.facebookLink = self.curUser.facebookLink
      self.twitterLink = self.curUser.twitterLink
      self.other_things_me = self.curUser.other_things_me
      self.linkedinLink = self.curUser.linkedinLink
      self.gpa = self.curUser.gpa
    })
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
.top-margin-5{
  margin-top: 5%
}

</style>
