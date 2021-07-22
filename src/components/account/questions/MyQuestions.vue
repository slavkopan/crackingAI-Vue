<template>
  <div>
    <div class="left-margin">
      <h2>Your Questions </h2>
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

    <div class = "left-margin right-margin" v-if="questions.length == 0">
      <p> No Current Questions </p>
    </div>

    <div v-if="questions.length >0">
    <div class = "row left-margin right-margin">
      <div v-for="question in questions"  class = "col-md-6 top-margin">
        <div class="card border">
            <div class="card-body">
              <h5 class="card-title">{{question.title}}</h5>
              <button type="button" class="btn btn-md btn-primary" @click="goToQuestion(question.id)">{{question.answers.length}} Answers </button>
            </div>
        </div>
      </div>
    </div>
  </div>
  </div>

</template>
<script>
import QuestionService from '../../../services/questionService.js'
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
      questionQuery: '',
      questions: [],
      showSpinner: true
    }
  },
  methods: {
    queryQuestions () {
      console.log(this.questionQuery)
    },
    goToQuestion (id) {
      console.log(id)
      this.$router.push({ name: 'IndividualQuestionView', params: { id }})
    },
    getQuestions () {
      var self = this
      let curUserId = UserService.getCurrentUserId()
      QuestionService.getAllQuestionsByCurrentUser(curUserId).then(function (querySnapshot) {
        self.questions = querySnapshot.docs.map(doc => {
          let question = doc.data()
          question.id = doc.id
          return question
        })
        self.showSpinner = false
      })
    }
  },
  mounted () {
    this.getQuestions()
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

.right-margin{
  margin-right: 5%;
}
.top-margin{
  margin-top: 2.5%;
}

</style>
