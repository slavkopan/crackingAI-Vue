<template>
  <div class="flex-row individual-prob align-items-start" v-if="render">
    <div class="col-md-6 col-sm-12 flex-content">
      <div class="w-100">
        <div
          class="mx-auto no-left-margin no-right-margin no-right-padding no-left-padding margin-top center-mobile">
          <div class="problem-title mb-2 col-sm-12 pl-0">
            <span class="mr-2"><b-icon icon="circle-fill" font-scale="1"  variant="warning"></b-icon></span><p>{{question.title}}</p>
          </div>
          <div class="accordion w-100" id="accordion-1">
            <div class="card no-padding">
              <h5 class="card-title">
                <a class="collapsed" data-toggle="collapse"
                  href="#collapse-1-1">Problem</a>
              </h5>
              <div id="collapse-1-1" class="collapse show" data-parent="#accordion-1">
                <div>
                  <div class="card-body card-space" v-html="compiledQuestion"></div>
                </div>
              </div>
            </div>
            <div class="card">
              <h5 class="card-title">
                <a class="collapsed" data-toggle="collapse"
                  href="#collapse-1-2">Solution</a>
              </h5>
              <div id="collapse-1-2" class="collapse"
                data-parent="#accordion-1">
                <div class="card-body card-space" v-html="compiledQuestionSolution"></div>
              </div>
            </div>
            <div class="card">
              <div class="card-title d-flex align-items-center justify-content-between">
                <div class="d-flex sort-recent-voted align-items-center justify-content-start">
                  <h5 class="m-0">
                    <a class="collapsed pr-0" data-toggle="collapse" href="#collapse-1-3">Discussion</a>
                  </h5>
                  <div style="display: flex;" v-if="isDiscussionOpened">
                    <h5 class="m-0 px-3" v-on:click="filterUpdate('recent')" v-bind:class="{ 'selected-sort': current === 1 }">Most Recent</h5><span style="color: #999999;">|</span>
                    <h5 class="m-0 px-3" v-on:click="filterUpdate('votes')" v-bind:class="{ 'selected-sort': current === 2 }">Most Voted</h5>
                  </div>
                </div>
                <div class="comment-div" v-if="!addComment && isDiscussionOpened">
                  <b-button class="add-btn" @click="$bvModal.show('commentModal')">Add comment</b-button>
                </div>
              </div>
              <div id="collapse-1-3" class="collapse"
                data-parent="#accordion-1">
                <div class="card-body card-space scrolling-card">
                  <form class="input-line w-100">
                    <div class="form-group mb-0">
                      <div>
                      <b-modal id="commentModal" class="custom-modal" size="xl" hide-footer hide-header centered>
                        <b-container fluid>
                          <form @submit="submitComment">
                            <b-row>
                            <button type="button" class="close" aria-label="Close" @click="$bvModal.hide('commentModal')">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            </b-row>
                              <div class="col-lg-3 col-md-3 p-0 mb-5 mt-3">
                                <label class="topic-title" for="input-live">Topic Title</label>
                                <b-form-input
                                  id="input-live"
                                  placeholder="Write title here"
                                  trim
                                  @focus="showCommentButton()"
                                  required
                                  v-model="commentTitle"
                                ></b-form-input>
                              </div>
                            <b-row>
                              <b-col md="6" lg="6" class="common-padding">
                                <div>
                                  <label class="topic-title">COMMENT</label>
                                  <b-form-textarea 
                                  @focus="showCommentButton()"
                                   v-model="userComment"
                                  rows="20" 
                                  placeholder="Write comment here"
                                  required no-resize>
                                  </b-form-textarea>
                                  <b-row class="justify-content-center mt-4">
                                    <b-button class="preview-btn" btn pill @click="commentPreview()">Preview</b-button>
                                  </b-row>
                                </div>
                              </b-col>
                              <b-col md="6" lg="6" class="common-padding">
                                <div>
                                  <label class="preview-title">
                                    PREVIEW
                                  </label>
                                  <div class="common preview-code p-2 custom-preview" v-html="previewComment"></div>
                                    <div class="footer-buttons">
                                      <b-button class="cancel-btn" @click="$bvModal.hide('commentModal')">Cancel</b-button>
                                      <input type="submit" class="comment-submit-btn ml-4" name="Add Comment" value="Add Comment">
                                    </div>
                                </div>
                              </b-col>
                            </b-row>
                          </form>
                          </b-container>
                      </b-modal>
                    </div>
                    </div>
                  </form>
                  <ul class="list-group" v-if="commentsInPage.length > 0">
                    <li v-for="(answer, index) in commentsInPage" :key="index"
                      class="list-group-item side-margin pseudo message vote-panel-parent stretch-height">
                      <div class="d-flex flex-row justify-content-start">
                        <div class="d-flex flex-row align-items-center align-self-baseline">
                            <span class="align-self-baseline"><b-avatar v-bind:src="answer.answered_by.img_add" alt></b-avatar></span>
                          <div class="d-flex flex-column-reverse ml-3">
                            <div class="row align-items-center ml-0 mt-3 mb-2">
                              <div class="d-flex align-items-center mr-4">
                                <b-icon icon="caret-up-fill" class="mr-1"></b-icon>
                                <p v-bind:class="{'user-upvoted-text': userUpvoted(answer)}">{{countUpvotes(answer)}}</p>
                              </div>
                              <div class="d-flex align-items-center mr-3">
                                <i class="fa fa-comment mr-2"></i>
                                <p>{{(answer.comments && answer.comments.length) ? answer.comments.length : "0"}}</p>
                              </div>
                              <div class="d-flex align-items-center mr-3">
                                <button class="btn btn-sm cus-arrow-btn"
                                  v-bind:class="{'user-upvoted-button': userUpvoted(answer)}">
                                  <i class="fa fa-thumbs-up cus-fa-arror"
                                    @click="upvote(answer)"
                                    v-bind:class="{'user-upvoted': userUpvoted(answer)}"></i>
                                </button>
                                <button
                                  class="btn btn-sm cus-arrow-btn cus-btn-bottom"
                                  v-bind:class="{'user-downvoted-button': userDownvoted(answer)}">
                                  <i class="fa fa-thumbs-down cus-fa-arror"
                                    v-bind:class="{'user-downvoted': userDownvoted(answer)}"
                                    @click="downvote(answer)"></i>
                                </button>
                              </div>
                              <div class="d-flex align-items-center mr-3" :style="{ cursor: 'pointer' }"
                                @click.prevent="routeIndividualDiscussion(answer.id)">
                                <a href="#" class="show-thread">Show this thread</a>
                              </div>
                            </div>
                            <div>
                              <div class="auther-info"> <p class="comment-title">{{ answer.title }} </p>
                              <small  v-if="answer.answered_by.username">@{{ answer.answered_by.username}} created {{ answer.createdDate.stringFormat}}</small>
                              </div>
                              <!-- <div class="answer-content"><p>{{ answer.content.substring(0, 100)+"..."}}</p></div> -->
                              <div class="answer-content"><div class="comment-html" v-html="showLimitedAnswer(answer.content)"></div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <h4 v-if="commentsInPage.length === 0" class="no-comment">No Comment Yet</h4>

                  <!-- <div
                    class="d-flex flex-row align-items-center justify-content-center mt-4">
                    <button class="btn btn-sm" :class="{
                        'user-upvoted-button': pagination.page > 0
                      }" :disabled="pagination.page <= 0"
                      @click="pagination.page --">
                      <i class="fa fa-chevron-left fa-2x cus-fa-arror"></i>
                    </button>
                    <div :style="{
                      width: '40px',
                      textAlign: 'center'
                    }">
                      <p class="block-this">{{pagination.page + 1}}</p>
                    </div>
                    <button class="btn btn-sm" :class="{
                        'user-upvoted-button': pagination.page < pagination.pageCount - 1
                      }"
                      :disabled="pagination.page >= pagination.pageCount - 1"
                      @click="pagination.page ++">
                      <i class="fa fa-chevron-right fa-2x cus-fa-arror"></i>
                    </button>
                  </div> -->
                  <!-- <p class="text-center margin-top-25"> Page
                    {{pagination.page + 1}} of {{pagination.pageCount}} </p> -->
                </div>
              </div>
            </div>
            <div class="card">
              <h5 class="card-title">
                <a class="collapsed" data-toggle="collapse"
                  href="#collapse-1-4">Companies</a>
              </h5>
              <div id="collapse-1-4" class="collapse"
                data-parent="#accordion-1">
                <div class="card-body card-space" v-html="compiledQuestionSolution"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!question.coding" class="col-md-6 col-sm-12  flex-content">
      <div class="w-100">
        <form class="input-line w-100">
          <div class="form-group your-solution">
            <label>Your Solution</label>
            <textarea class="common form-control preserve-format p-2" rows="20"
              @blur="saveText()" placeholder="Write Solution Here"
              v-model="userSolution"
              @keydown.tab.prevent="tabber($event)"></textarea>
              <div class="common hide-dom preview-code p-2" v-html="compiledUserSolution"></div>
              <div class="col-md-12 mt-4">
                <div class="flex-content">
                  <div class="button-container">
                    <b-button pill v-if="mode" @click='toggle()'>Write</b-button>
                    <b-button pill v-if="!mode" @click='toggle()'>Preview</b-button>
                    <b-button pill v-if="!question.completed"
                    @click.prevent="toggleComplete()">Mark Complete</b-button>
                    <b-button pill v-if="question.completed"
                    @click.prevent="toggleComplete()">Mark Incomplete</b-button>
                </div>
                </div>
              </div>
          </div>
        </form>
      </div>
      <!-- <div class="common hide-dom col-md-4 flex-content display-preview">
        <div class="w-100">
          <form class="input-line w-100">
            <div class="form-group">
              <label>Marked Solution</label>
              <div common hide-dom v-html="compiledUserSolution"></div>
            </div>
          </form>
        </div>
      </div> -->
    </div>
    <div v-show="question.coding"
      class="python-interpreter col-md-6 col-sm-12 flex-content">
      <div class="python-interpreter__body">
        <div class="python-interpreter__editor">
          <div class="editor-area">
            <textarea id="code"></textarea>
          </div>
        </div>
        <!-- Output/Error section -->
        <div class="python-interpreter__output">
          <div class="output--toolbox">
            <h3 class="output--toolbox--header">Output</h3>
            <button @click="runCode" class="run-btn"
              :disabled="isRunButtonDisabled">Run</button>
          </div>
          <div class="output--info">
            <div class="output--header">
              Info: <small>{{ infoDisplay }}</small>
            </div>
          </div>
          <div class="output--code">
            <pre :class="{ 'run-error': isError }" class="output--code--result"
              v-html="resultDisplay"></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProblemService from '../services/problemService.js';
import UserService from '../services/userService.js';
import { mapGetters } from 'vuex';
import marked from 'marked';
import hljs from 'highlight.js';
import CodeMirror from "codemirror";
import "codemirror/addon/display/autorefresh";
import "codemirror/mode/python/python.js";
import 'highlight.js/styles/solarized-dark.css';
export default {
  name: 'HelloWorld',
  data() {
    return {

      previewComment: null,
      topicTitle: '',
      mode: false,

      userSolution: '',
      comments: [],
      question: {content:'', solution:'',completed:false},
      userComment: '',
      addComment: false,
      discussion: {
        id: '12345'
      },
      commentTitle: '',
      pagination: {
        page: 0,
        count: 0,
        pageCount: 0,
        rowsPerPage: 50
      },
      render: false,
      current: 1,
      options: [{
          text: 'Most Recent',
          value: 1,
        },
        {
          text: 'Upvotes',
          value: 2,
        },
      ],
      codeMirrorInstance: null,
      isRunButtonDisabled: true,
      pyodideWorker: null,
      resultDisplay: "",
      infoDisplay: null,
      isError: false,
      curr_test_case: 0,
      num_test_cases_passed: 0,
      failed_test_cases: [],
      encountered_error: false,
      isDiscussionOpened: false
    }
  },
  watch: {
    comments: {
      handler: function(val, oldval) {
        this.pagination.count = this.comments.length
        this.pagination.pageCount = Math.ceil(this.comments.length / this
          .pagination.rowsPerPage)

        if (this.pagination.pageCount && this.pagination.page >= this
          .pagination.pageCount) {
          this.pagination.page = this.pagination.pageCount - 1
        }

        if (this.pagination.page < 0) {
          this.pagination.page = 0
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      loggedIn: 'loggedIn'
    }),
    commentsInPage() {
      return this.comments.slice(this.pagination.page * this.pagination
        .rowsPerPage, (this.pagination.page + 1) * this.pagination.rowsPerPage
      ).sort((a, b) => {
        if (this.current === 1) {
          return b.createdDate.ms - a.createdDate.ms
        } else if (this.current === 2) {
          return Object.keys(b.upvotes).reduce((acc, cur) => acc + b
            .upvotes[cur], 0) - Object.keys(a.upvotes).reduce((acc,
            cur) => acc + a.upvotes[cur], 0)
        }
        return 0
      })
    },
    compiledUserSolution() {
      const self = this;
      return marked(self.userSolution, {
        sanitize: true
      });
    },
    compiledQuestionSolution() {
      const self = this;
      if (this.question.solution.length == 0) {
        this.question.solution = "# No Solution Uploaded Yet."
      }
      this.question.solution = this.question.solution.replace(/newline/g, '\n')
      return marked(self.question.solution, {
        highlight(code) {
          return hljs.highlight('python', code).value;
        },
        sanitize: true
      });
    },
    compiledQuestion() {
      const self = this;
      this.question.content = this.question.content.replace(/newline/g, '\n')
      return marked(self.question.content, {
        sanitize: true
      });
    },
    
  },
  mounted() {
    let self = this

    this.update()

    if (self.loggedIn) {
      ProblemService.getUserSolution(this.$route.params.id).then(function(
        result) {
        if (result !== 0) {
          self.userSolution = result.userSolution
          self.codeMirrorInstance.setValue(self.userSolution)
        }
      })
    }
    this.codeMirrorInstance = this.initCodeMirror();
    this.initPyodide();
    marked.setOptions({
          highlight: function(code) {
              return hljs.highlight('python', code).value;
            }
        });

    $('#collapse-1-3').on('shown.bs.collapse', function () {
      self.isDiscussionOpened = true;
    })

    $('#collapse-1-3').on('hidden.bs.collapse', function () {
      self.isDiscussionOpened = false;
    }) 
  },
  methods: {
    initCodeMirror() {
      let self = this
      let codeMirrorInstance = CodeMirror.fromTextArea(document.getElementById(
        "code"), {
        mode: "python",
        lineNumbers: true,
        gutter: true,
        lineWrapping: true,
        autoRefresh: true
      });
      codeMirrorInstance.refresh()
      codeMirrorInstance.on("blur", function(){
        if (self.loggedIn) {
          ProblemService.createSolution(self.$route.params.id, codeMirrorInstance.getValue())
        }
      });
      if (codeMirrorInstance.getValue().length == 0) {
        codeMirrorInstance.setValue("import numpy as np\n\ndef solution(" + this.question.function_args + "):\n  pass")
      }
      codeMirrorInstance.setSize("100%", "100%");
      codeMirrorInstance.replaceRange("\n".repeat(25), CodeMirror.Pos(codeMirrorInstance.lastLine()))
      return codeMirrorInstance;
    },
    initPyodide() {
      let firstRun = true;
      this.infoDisplay = "Please wait, initializing...";
      //const pyodideWorker = new Worker("../assets/js/pyodide/web.worker.js");
      // const pyodideWorker = new Worker("/static/assets/js/pyodide.worker.js");
      const pyodideWorker = new Worker("/static/assets/js/webworker.js");
      pyodideWorker.onerror = e => {
        this.resultDisplay +=
          `error at ${e.filename}, Line: ${e.lineno}, ${e.message}`;
        this.isError = true;
      };
      pyodideWorker.addEventListener("message", e => {
        const {
          result,
          error,
          res
        } = e.data;
        if (this.encountered_error) {
          return
        }
        if (result && result.length > 2) {
          let parsed_result = result.substring(1, result.length - 3) + '\n'
          this.resultDisplay += parsed_result
        }
        if (error) {
          this.encountered_error = true
          let parsedError = this.getParsedError(error)
          this.resultDisplay += parsedError
        }
        else if (res == null && !firstRun) {
          this.resultDisplay += 'Error: function did not return anything.'
          this.encountered_error = true
        }
        this.isRunButtonDisabled = false;
        if (firstRun) {
          this.infoDisplay = "Initialized, you can run your code now";
          firstRun = false;
        } else if (this.is_final_test_case() || this.encountered_error) {
          this.infoDisplay = "Run Complete";
          this.isRunButtonDisabled = false;
        }
        if (res != null) {
          // Parse result to remove extra quotes and spaces.

          // this is the output to std. We are not using it currently.
          // let parsed_result = result.substring(1, result.length - 3)


          let solution = Object.values(this.question.test_cases)[this
            .curr_test_case]

          if (res.toString() == solution.toString()) {
            this.num_test_cases_passed++;
          } else {
            this.failed_test_cases.push(Object.keys(this.question
              .test_cases)[this.curr_test_case])
          }

          if (this.is_final_test_case()) {
            this.render_display()
          }
         
          // this.resultDisplay = JSON.parse(result).replace("\n", "<br>");
          this.isError = false;
        }

        this.curr_test_case++;

      });
      pyodideWorker.postMessage({
        python: "import sys; import io; sys.stdout = io.StringIO(); sys.stderr = io.StringIO();"
      });
      this.pyodideWorker = pyodideWorker;
    },
    async runCode() {
      this.encountered_error = false
      this.curr_test_case = 0;
      this.num_test_cases_passed = 0;
      this.failed_test_cases = [];
      this.resultDisplay = "";
      this.isRunButtonDisabled = true;
      for (let i = 0; i < Object.keys(this.question.test_cases).length; i++) {
        //let run_code = '\nprint(solution())'
        if (this.encountered_error) {
          break
        }
        let run_code = '\n' + Object.keys(this.question.test_cases)[i]
        let val = this.codeMirrorInstance.getValue().concat(run_code)
        this.pyodideWorker.postMessage({
          python: val
        });
        this.infoDisplay =
          "Please wait, it may take quite a while if your code imports third party packages.";
      }
    },
    is_final_test_case() {
      return this.curr_test_case === Object.values(this.question.test_cases)
        .length - 1
    },
    render_display() {
      this.resultDisplay += "<br>Passed " + this.num_test_cases_passed + "/" +
        Object.values(this.question.test_cases).length + " test cases."
      if (this.num_test_cases_passed == Object.values(this.question.test_cases).length) {
        this.question.completed = false
        this.toggleComplete()
      }
    },
    getParsedError(error) {
      // break the textblock into an array of lines
      var lines = error.split('\n');
      // remove one line, starting at the first position
      lines.splice(1, 3);
      // join the array back into a single string
      var newtext = lines.join('\n');
      return newtext
    },
    update() {
      let self = this
      ProblemService.getQuestion(this.$route.params
          .id) // re-render the question so user sees their answer
        .then(function(snapshot) {
          let question = snapshot.data()
          question.id = snapshot.id
          self.question = {
            ...question
          }
          if (!UserService.getCurrentUser()) {
            self.question.completed = false
          } else {
            self.question.completed = UserService.getCurrentUser().completedQuestions[
              snapshot.id
            ]
          }
          self.codeMirrorInstance.setValue("import numpy as np\n\ndef solution(" + self.question.function_args + "):\n  pass")
        })

      ProblemService.getDiscussion(this.$route.params.id, false).then(function(
        data
      ) {
        let commentIDs = data.comments
        self.comments = []
        commentIDs.forEach(function(id) {
          ProblemService.getComments(id).then(function(commentResult) {
            let comment = commentResult.data()
            if(comment) {
              comment.id = commentResult.id
              UserService.getUserProfile(comment.userID)
              .then(function(user) {
                comment.answered_by = user
                self.comments.push(comment)
              })
            }
          })
        })
      })
    },
    downvote(answer) {
      let self = this;
      if (!this.loggedIn) {
        this.$modal.show('login', {
          auto_prompt: true,
          show_reason: 'can downvote comments'
        })
      } else {
        ProblemService.downvoteAnswer(answer.id).then(function(message) {
          if (answer.upvotes[UserService.getCurrentUserId()] == -1) {
            delete answer.upvotes[UserService.getCurrentUserId()]
          } else {
            answer.upvotes[UserService.getCurrentUserId()] = -1
          }
          self.$forceUpdate();
          //self.update()
        })
      }
    },
    upvote(answer) {
      let self = this;
      if (!this.loggedIn) {
        this.$modal.show('login', {
          auto_prompt: true,
          show_reason: 'can upvote comments'
        })
      } else {
        ProblemService.upvoteAnswer(answer.id).then(function(message) {
          if (answer.upvotes[UserService.getCurrentUserId()] == 1) {
            delete answer.upvotes[UserService.getCurrentUserId()]
          } else {
            answer.upvotes[UserService.getCurrentUserId()] = 1
          }
          self.$forceUpdate();
          //self.update();
        })
      }
    },
    getReaction(answer) {
      let curUserId = UserService.getCurrentUserId()
      let reaction = answer.reactions().get(curUserId)
      return reaction
    },
    countUpvotes(answer) {
      let score = 0
      for (let reaction in answer.upvotes) {
        score += parseInt(answer.upvotes[reaction])
      }
      return score
    },
    markComplete() {
    },

    routeIndividualDiscussion(id) {
      this.$router.push({
        name: 'IndividualDiscussionView',
        params: {
          id
        }
      })
    },
    mapUsersToAnswers(answers) {
      // this.answers = answers;
      // this.answers.forEach(function(answer){
      // UserService.getUserProfileStatus(answer.answererId).then(function(user){
      //   if(user.isStudent){
      //     UserService.getUserIsStudent(answer.answererId).then(function(student){
      //       answer.answered_by = student;
      //     });
      //   } else if(user.isInvestor){
      //     UserService.getUserIsInvestor(answer.answererId).then(function(investor){
      //       answer.answered_by = investor;
      //     });
      //     }
      //   })
      // });
    },
    answerQuestion() {
      let curUserId = UserService.getCurrentUserId()
      let curUser = UserService.getCurrentUser()
      let answer = {}
      answer.answererId = curUserId
      answer.content = this.userAnswer
      answer.questionId = this.question.id
      answer.createdDate = new Date().getTime()
      answer.upvotes = {}
      QuestionService.postAnswer(answer, this.question.id, this.update)
      QuestionService.notifyUser(this.questionAsker.phone_number, curUser)
      this.userAnswer = ''
    },
    userUpvoted(answer) {
      if (!UserService.getCurrentUser()) return false
      let curUserId = UserService.getCurrentUserId()
      let upvotes = answer.upvotes
      if (upvotes.hasOwnProperty(curUserId)) {
        if (upvotes[curUserId] == 1) return true
      }
      return false
    },
    userDownvoted(answer) {
      if (!UserService.getCurrentUser()) return false
      let curUserId = UserService.getCurrentUserId()
      let upvotes = answer.upvotes
      if (upvotes.hasOwnProperty(curUserId)) {
        if (upvotes[curUserId] == -1) return true
      }
      return false
    },
    isCurrentUser(id) {
      return false
      /*
          let curUserId = UserService.getCurrentUserId();
          return id == curUserId; */
    },
    saveText() {
      if (this.loggedIn) {
        ProblemService.createSolution(this.$route.params.id, this.userSolution)
      }
    },
    tabber(event) {
      let text = this.userSolution,
        originalSelectionStart = event.target.selectionStart,
        textStart = text.slice(0, originalSelectionStart),
        textEnd = text.slice(originalSelectionStart)
      this.userSolution = `${textStart}\t${textEnd}`
      event.target.value = this
        .userSolution // required to make the cursor stay in place.
      event.target.selectionEnd = event.target.selectionStart =
        originalSelectionStart + 1
    },
    toggleComplete() {
      const self = this;
      if (!this.loggedIn) {
        this.$modal.show('login', {
          auto_prompt: true,
          show_reason: 'save your solution'
        })
      } else {
        if (this.question.completed == true) {
          this.question.completed = false;
        } else {
          this.question.completed = true;
        }
        ProblemService.indicateCompleteness(
          this.$route.params.id,
          this.question.completed,
          function(){
            self.$forceUpdate();
          }
        )
      }
    },
    showCommentButton() {
      this.commentButtonShow = true
    },
    submitComment(e) {
      e.preventDefault();
      if (!this.loggedIn || UserService.getCurrentUser() == null) {
        this.$bvModal.hide('commentModal');
        this.$modal.show('login', {
          auto_prompt: true,
          show_reason: 'comment'
        })
      } else if(!UserService.getCurrentUser().username || UserService.getCurrentUser().username == ''){
        this.$modal.show('username', {
          auto_prompt: true,
        })
      }else {
        let questionID = this.$route.params.id
        const self = this
        ProblemService.submitComment(questionID, this.userComment, this
          .commentTitle, self.update)
        self.userComment = ''
        self.commentTitle = ''
        self.previewComment=''
        this.$bvModal.hide('commentModal');
      }
    },
    userWantsToComment() {
      this.addComment = true
    },
    toggle(){
      this.mode = !this.mode
      $('.common').toggleClass("hide-dom");
    },
    filterUpdate(type) {
      this.current = (type == 'recent') ? 1 : 2;
    },
    showLimitedAnswer(comment) {
      if (comment.length > 100) {
        comment = comment.substring(0, 100) + "...";
      }
      const markup = marked(comment);
      var edited_markup = markup;
      var splitted = edited_markup.split("\n");
      if (splitted.length > 1){        
        edited_markup = splitted[0] + "\n" + splitted[1];
        if (splitted.length > 3){
          edited_markup += "<p>...</p>";
        }
      }
      return edited_markup;
    },
    commentPreview(){
      // this.previewComment = this.userComment;
      this.previewComment = marked(this.userComment);
    },
    // isDiscussionOpen() {
    //   return $("#collapse-1-3").hasClass("show");
    // }
  }
}
</script>

<style scoped>
@import '../assets/css/IndividualProblem.css';
@import url("../../node_modules/codemirror/lib/codemirror.css");
</style>
