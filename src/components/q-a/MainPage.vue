<template>
  <div>
    <div class="left-margin">
      <h2>Ask Student Garage </h2>
    </div>

    <div class="left-margin">
      <h6>Ask our network of student entrepreneurs, investors, and advisors. </h6>
    </div>

    <div class="flex-row top-margin">
      <div class="center-mobile" >
        <button type="button" class="btn btn-lg btn-success" data-toggle="modal" data-target="#modal-default">Ask a Question</button>
      </div>
    </div>

   <div class="modal fade" id="modal-default" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Have a Question?</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click.prevent="toggleAsked()">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

              <div v-if="!userHasQuestion">
                <div class="modal-body">
                  <form class="input-line">
                          <div class="form-group">
                          <label>Question</label>
                          <input class="form-control" type="text" placeholder="Ask Your Question" v-model='questionAsked'>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal" @click.prevent="toggleAsked()">Close</button>
                  <button type="button" @click.prevent = "ask()" class="btn btn-primary">Ask</button>
                </div>
            </div>

            <div v-if="userHasQuestion">
              <div class="modal-body">
                <p> Question Asked! </p>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" @click.prevent="toggleAsked()">Close</button>
              </div>
          </div>

              </div>
            </div>
          </div>

    <div class="flex-row top-margin">
      <div class="form-group input-group w-80">
                <input type="text" class="form-control" placeholder="Search for questions..." v-model="questionQuery" @keyup.enter="queryQuestions()">
                <div class="input-group-append ml-4">
                  <button class="btn btn-primary" type="button" @click ="queryQuestions()">Go!</button>
                </div>
      </div>
    </div>
    <div class="flex-content"> <img src="../../../static/assets/img/algolia/search-by-algolia-light.svg"> </div>

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

    <div v-if="questions.length == 0">
      <p> No Current Questions </p>
    </div>

    <div v-if="questions.length > 0">
    <div class = "row left-margin right-margin">
      <div v-for="question in paginatedData"  class = "col-md-6 top-margin">
        <div class="card border">
            <div class="card-body">
              <h5 class="card-title">{{question.title}}</h5>
              <button type="button" class="btn btn-md btn-primary" @click="goToQuestion(question.id)">{{question.answers.length}} Answers </button>
            </div>
        </div>
      </div>
    </div>
    <button :disabled="pageNumber === 0"  class="btn btn-primary float-l" @click.prevent="prevPage()"><i class="fa fa-arrow-left"></i>Previous </button>
    <button :disabled="pageNumber >= pageCount -1"  class="btn btn-primary float-r" @click.prevent="nextPage()">Next <i class="fa fa-arrow-right"></i></button>
  </div>
  </div>

</template>
<script>
import QuestionService from '../../services/questionService.js'
import UserService from '../../services/userService.js'
import { SemipolarSpinner } from 'epic-spinners'
export default {
  name: 'QAMain',
  components: {
    SemipolarSpinner
  },
  data () {
    return {
      questionAsked: '',
      userHasQuestion: false,
      questionQuery: '',
      questions: [],
      showSpinner: true,
      pageNumber: 0,
      size: 20
    }
  },
  computed: {
    pageCount () {
      let l = this.questions.length,
        s = this.size
      return Math.floor(l / s)
    },
    paginatedData () {
      const start = this.pageNumber * this.size,
        end = start + this.size
      return this.questions
        .slice(start, end)
    }
  },
  methods: {
    ask () {
      let curUserId = UserService.getCurrentUserId()
      QuestionService.askQuestion(curUserId, this.questionAsked)
      this.userHasQuestion = true
      this.getQuestions()
    },
    queryQuestions () {
      let self = this
      QuestionService.queryQuestions(this.questionQuery).then(function (hits) {
        self.questions = hits
        self.questionQuery = ''
      })
    },
    goToQuestion (id) {
      console.log(id)
      this.$router.push({ name: 'IndividualQuestionView', params: { id }})
    },
    getQuestions () {
      var self = this
      QuestionService.getQuestions().then(function (querySnapshot) {
        self.questions = querySnapshot.docs.map(doc => {
          let question = doc.data()
          question.id = doc.id
          return question
        })
        self.questions.sort(function (a, b) {
          return b.createdDate - a.createdDate
        })
        self.showSpinner = false
      })
    },
    nextPage () {
      this.pageNumber++
    },
    prevPage () {
      this.pageNumber--
    },
    toggleAsked () {
      console.log(this.userHasQuestion)
      if (this.userHasQuestion == true) this.userHasQuestion = false
      this.questionAsked = ''
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

.float-l{
  float: left;
  margin-left: 0px;
}
.float-r{
  float: right;
  margin-right: 0px;
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
