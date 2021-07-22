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
    <!-- Profile Image -->
  <div v-if="!showSpinner">
    <div class="">
    <div class = "row align-items-center justify-content-center student-profile">
      <div class = "">
        <div class="card-img" :style="{ backgroundImage: 'url(' + student.profile_img_add + ')' }">
        </div>
      </div>

      <!-- Bio-->
      <div class= "left-margin student-bio">
        <div class= "">
          <h2>{{student.first_name}} {{student.last_name}}</h2>
        </div>

        <div class= "">
          <h5> {{student.headline}} </h5>
        </div>

        <div class= "">
          <span> <i class="fa fa-map-pin"></i></span>
          <span v-if="!hasLocation()"> {{student.location}} </span>

        </div>

        <div class="social negative-left-margin">
          <a v-if="!emptyString(student.facebookLink)" class="social-facebook" :href="student.facebookLink" target="_blank"><i class="fa fa-facebook"></i></a>
          <a v-if="!emptyString(student.twitterLink)" class="social-twitter" :href="student.twitterLink" target="_blank"><i class="fa fa-twitter"></i></a>
          <a v-if="!emptyString(student.linkedinLink)" class="social-linkedin" :href="student.linkedinLink" target="_blank"><i class="fa fa-linkedin"></i></a>
          <a v-if="!emptyString(student.gitHubLink)" class="social-github" :href="student.gitHubLink" target="_blank"><i class="fa fa-github"></i></a>
        </div>

      </div>
    </div>
  </div>

      <div>
            <div class="col-md-12 mx-auto no-left-margin no-right-margin no-right-padding no-left-padding margin-top center-mobile">

              <div class="accordion w-100" id="accordion-1">
                <div class="card no-padding">
                  <h5 class="card-title">
                    <a class="collapsed" data-toggle="collapse" href="#collapse-1-1">Experiences</a>
                  </h5>

                  <div id="collapse-1-1" class="collapse" data-parent="#accordion-1">
                    <div v-if="student.experiences.length > 0">
                    <div class="card-body" v-for="(experience, key) in student.experiences">
                      <h4>{{experience.title}} </h4>
                      <h5>{{experience.company}} </h5>
                      <h6> <span> {{experience.start}} - </span>
                      <span> {{experience.end}} </span> </h6>
                      <p>{{experience.description}} </p>
                      <hr v-if="key < student.experiences.length -1">
                    </div>
                    <div v-if="student.experiences.length == 0">
                      No Current Experiences To Show
                    </div>
                  </div>
                  </div>
                </div>
                <div class="card">
                  <h5 class="card-title">
                    <a class="collapsed" data-toggle="collapse" href="#collapse-1-2">Education</a>
                  </h5>

                  <div id="collapse-1-2" class="collapse" data-parent="#accordion-1">
                    <div class="card-body">
                      <h4>{{student.stanford_education.school}} </h4>
                      <h5>{{student.stanford_education.description}} </h5>
                      <p> Graduation Year (or expected): {{student.stanford_education.gradYear}} </p>
                    </div>
                    <hr v-if="student.education.length > 0">
                    <div class="card-body" v-for="(education, key) in student.education">
                      <h4>{{education.school}} </h4>
                      <h5>{{education.description}} </h5>
                      <p> Graduation Year (or expected): {{education.gradYear}} </p>
                      <hr v-if="key < student.education.length -1">
                    </div>
                    <div class="card-body" v-if="isInvestorOrEmployer()">
                      <h4 class="theme-bold"> GPA: {{student.gpa}} </h4>
                    </div>
                    <div v-if="isInvestorOrEmployer()">
                    <div class="card-body" v-if="student.tests.length > 0">
                      <h4 class="theme-bold"> Test Scores </h4>
                      <div class="" v-for="(test, key) in student.tests">
                        <h4>{{test.title}} </h4>
                        <h5>{{test.score}} </h5>
                        <hr v-if="key < student.tests.length -1">
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
                <div class="card">
                  <h5 class="card-title">
                    <a class="collapsed" data-toggle="collapse" href="#collapse-1-3">Additional Information</a>
                  </h5>

                  <div id="collapse-1-3" class="collapse" data-parent="#accordion-1">
                    <div class="card-body">
                      <h4> How I Spend My Free Time </h4>
                      <p>{{student.free_time}} </p>
                      <div v-if="!hasCoolThings()">
                        <h4> Other Things You Should Know </h4>
                        <p>{{student.other_things_me}} </p>
                      </div>
                      <div>
                        <h4> Email</h4>
                        <p>{{student.email}} </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div class="margin-top-small">
            <h4> My Locker </h4>
            <p v-if="student.lockerItems.length >0"> Cool things I want you to see </p>
            <div v-if="student.lockerItems.length >0">
              <carousel-3d :controlsVisible = "true">
                <slide v-for="(item, key) in student.lockerItems" class="black-background" v-bind:key="item.title" :index="key">
                  <a v-bind:href="item.link" target="_blank">
                  <h1 class="text-white">{{item.title}}</h1>
                  <p v-if="!emptyString(item.link)"> (Click Here to Learn More) </p>
                  </a>
                  <h6 class="text-white"> <span> {{item.start}} - </span>
                  <span> {{item.end}} </span> </h6>
                  <p> {{item.description}} </p>
                </slide>
              </carousel-3d>
            </div>
            <div v-if="student.lockerItems.length == 0">
              {{student.first_name}}'s Locker Is Currently Empty
            </div>
          </div>
      </div>
    </div>
  </div>

</template>

<script>
import UserService from '../../services/userService.js'
import { SemipolarSpinner } from 'epic-spinners'
export default {
  name: 'StudentProfile',
  components: {
    SemipolarSpinner
  },
  data () {
    return {
      student: {},
      showSpinner: true
    }
  },
  mounted () {
    const curUserId = UserService.getCurrentUserId()
    let self = this
    UserService.getUserIsStudent(curUserId).then(function (student) {
      console.log('student', student)
      self.student = student
      self.showSpinner = false
    })
  },
  methods: {
    addStudent () { // just wanted to test the firestore database
      // StudentService.addStudent();
      console.log('this was just testing')
    },
    isInvestorOrEmployer () {
      let currentUser = UserService.getCurrentUser()
      return currentUser.isInvestor == true
    },
    hasLocation () {
      return this.emptyString(this.student.location)
    },
    hasCoolThings () {
      return this.emptyString(this.student.other_things_me)
    },
    emptyString (str) {
      return str.replace(/^\s+|\s+$/g, '').length == 0
    }
  }
}
</script>

<style scoped>
.black-background{
  background-color: black;
  color: white;
}
.date{
  display: inline;
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
hr{
height: 1px;
color: black;
background-color: black;
border: none;
}
.img-restricted{
  height: 200px;
  width: 200px;
}
.left-margin{
  margin-left: 5%;
}
.left-margin-small{
  margin-left: 2.5%;
}
.margin-top{
  margin-top: 5%;
}
.margin-top-small{
  margin-top: 2.5%;
}
.negative-left-margin{
  margin-left: -3%;
}
.no-left-margin{
  margin-left: 0 !important;
}
.no-left-padding{
  padding-left: 0 !important;
}
.no-right-margin{
  margin-right: 0 !important;
}
.no-right-padding{
  padding-right: 0 !important;
}
.theme-bold{
  font-weight: bold;
}
.theme-blue{
  color: #50a1ff !important;
}

.card-img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-size: cover;
  margin: 0 auto;
  background-position: center;
}

@media (max-width:400px){
  .center-mobile{
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 575px) {
  .student-profile {
    flex-direction: column;
  }

  .student-bio {
    text-align: center;
    margin-left: 0;
    margin-top: 20px;
  }
}

.top-margin-5{
  margin-top: 5%
}
</style>
