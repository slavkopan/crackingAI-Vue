<template>
  <div class="container-fluid min-height-discussion">
    <div class="row" v-if="loaded">
      <div class="col-md-1">
        <div class="back-btn align-items-center">
          <a href="#" @click="$router.go(-1)">
            <b-icon font-scale="0.5" icon="chevron-left" class="pt-1"></b-icon>
            <span class="">Back</span>
          </a>
        </div>
      </div>
      <div class="col-md-11">
        <div class="discussion-container">
          <!-- <div class="disc-header">
            <div class="header-title">
              <h6>{{discussion.title}}</h6>
            </div>
            <div class="action-btn">
              <svg viewBox="0 0 24 24" width="1em" height="1em" class="icon__3Su4">
                <path fill-rule="evenodd"
                  d="M17 5V2l5 5h-9a2 2 0 0 0-2 2v8H9V9a4 4 0 0 1 4-4h4zm3 14V9h2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3v2H4v14h16z" />
              </svg>
              <svg viewBox="0 0 24 24" width="1em" height="1em" class="icon__3Su4">
                <path fill-rule="evenodd"
                  d="M12 22c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2zm6-6l2 2v1H4v-1l2-2v-5c0-3.08 1.64-5.64 4.5-6.32V4c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v.68C16.37 5.36 18 7.93 18 11v5zm-2 1v-6c0-2.48-1.51-4.5-4-4.5S8 8.52 8 11v6h8z" />
              </svg>
              <svg viewBox="0 0 24 24" width="1em" height="1em" class="icon__3Su4">
                <path fill-rule="evenodd"
                  d="M1 22L12 2l11 20H1zm18.617-2L12 6.15 4.383 20h15.234zM13 19h-2v-2h2v2zm0-3h-2v-5h2v5z" />
              </svg>
            </div>
          </div> -->
          <div class="disc-body">
            <!-- <div class="vote-panel">
            <div class="flex-upvote">
              <div>
                <button class="btn btn-sm cus-arrow-btn"
                          v-bind:class="{'user-upvoted-button': userUpvoted()}">
                  <i
                    class="fa fa-sort-up fa-2x cus-fa-arror"
                    @click="upvote()"
                    v-bind:class="{'user-upvoted': userUpvoted()}"
                  ></i>
                </button>
              </div>
              <div class="flex-upvote-score">
                <p
                  class="block-this"
                  v-bind:class="{'user-upvoted-text': userUpvoted()}"
                >{{countUpvotes()}}</p>
              </div>
              <div>
                <button class="btn btn-sm cus-arrow-btn cus-btn-bottom"
                        v-bind:class="{'user-downvoted-button': userDownvoted()}">
                  <i
                    class="fa fa-sort-down fa-2x cus-fa-arror"
                    v-bind:class="{'user-downvoted': userDownvoted()}"
                    @click="downvote()"
                  ></i>
                </button>
              </div>
            </div>
          </div> -->
            <div class="d-flex flex-row">
              <div class="d-flex flex-row align-items-center">
                <!-- <img
                class="ms-avatar-hero inline person-avatar"
                :src="discussion.answered_by.img_add"
                alt
              /> -->
                <span class="avatar-position">
                  <b-avatar :src="discussion.answered_by ? discussion.answered_by.img_add : ''" alt></b-avatar>
                </span>
                <div class="d-flex flex-column-reverse ml-3">
                  <div class="row align-items-center ml-0 mt-3">
                    <div class="d-flex align-items-center mr-3">
                      <b-icon icon="caret-up-fill" class="mr-1"></b-icon>
                      <p v-bind:class="{'user-upvoted-text': userUpvoted()}">{{countUpvotes()}}</p>
                    </div>
                    <div class="d-flex align-items-center mr-3">
                      <i class="fa fa-comment mr-2"></i>
                      <p>{{(discussion.comments && discussion.comments.length) ? discussion.comments.length : "0"}}</p>
                    </div>
                    <div class="d-flex align-items-center mr-3 comment-vote-section">
                      <button class="btn btn-sm cus-arrow-btn"
                        v-bind:class="{'user-upvoted-button': userUpvoted()}">
                        <i class="fa fa-thumbs-up cus-fa-arror" @click="upvote()"
                          v-bind:class="{'user-upvoted': userUpvoted()}"></i>
                      </button>
                      <button class="btn btn-sm cus-arrow-btn"
                        v-bind:class="{'user-downvoted-button': userDownvoted()}">
                        <i class="fa fa-thumbs-down cus-fa-arror"
                          v-bind:class="{'user-downvoted': userDownvoted()}" @click="downvote()"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    <div class="discussion-title"> <p>{{ discussion.title }} </p>
                      <small>
                        <small v-if="discussion.answered_by && discussion.answered_by.username">@{{ discussion.answered_by.username}}
                          <small
                            v-if="!discussion.answered_by && !discussion.answered_by.username">
                            {{ discussion.answered_by.first_name}} {{ discussion.answered_by.last_name}}</small>created
                          </small>
                          <small v-if="'createdDate' in discussion"> {{discussion.createdDate.stringFormat}} </small>
                      </small>
                    </div>
                    <div class="answer-content">
                      <!-- <p>{{ discussion.content}}</p> -->
                      <div v-html="showCommentMarkDown(discussion.content)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right-icons">
              <!-- <b-icon icon="heart" class="mx-3"></b-icon>
              <b-icon icon="upload" class="mx-3"></b-icon> -->
              <b-img src="/static/assets/img/icon/favorite.png" class="mx-2"></b-img>
              <b-img src="/static/assets/img/icon/share.png" class="mx-2"></b-img>
            </div>
          </div>
          <div class="replies">
              <div class="d-flex sort-recent-voted">
                <label>Replies</label>
                <h5 class="m-0 px-3" v-on:click="filterUpdate('recent')" v-bind:class="{ 'selected-sort': current === 1 }">Most Recent</h5>
                <span style="color: #999999;">|</span>
                <h5 class="m-0 pl-3" v-on:click="filterUpdate('votes')" v-bind:class="{ 'selected-sort': current === 2 }">Most Voted</h5>
              </div>
              <div>
                <b-button class="reply-btn" @click="$bvModal.show('discussionModal')">Add Reply</b-button>
                <b-modal id="discussionModal" class="custom-modal" size="xl" hide-footer hide-header centered>
                <b-container fluid>  
                  <b-row>
                    <button type="button" class="close" aria-label="Close" @click="$bvModal.hide('discussionModal')">
                        <span aria-hidden="true">&times;</span>
                    </button>
                  </b-row>
                  <b-row class="mt-3"> 
                    <form style="display: contents;" @submit="submitComment">
                      <b-col md="6" lg="6" class="common-padding">
                        <div>
                          <label class="topic-title">COMMENT</label>
                          <!-- <b-form-textarea required v-model="userComment" rows="20" no-resize required>
                          </b-form-textarea> -->
                          <textarea class="form-control" v-model="userComment" rows="20" no-resize required>
                            
                          </textarea>
                          <b-row class="justify-content-center mt-4">
                            <b-button class="preview-btn" btn pill @click="replyPreview()">Preview</b-button>
                          </b-row>
                        </div>
                      </b-col>
                      <b-col md="6" lg="6" class="common-padding">
                        <div >
                          <label class="preview-title">
                            PREVIEW
                          </label>
                          <!-- <b-form-textarea rows="20" no-resize></b-form-textarea> -->
                          <div class="common preview-code p-2 custom-preview" v-html="previewComment"></div>
                          <div class="footer-buttons">
                            <b-button class="cancel-btn" @click="$bvModal.hide('discussionModal')">Cancel</b-button>
                            <!-- <b-button type="submit" class="add-btn ml-4" @click.prevent = "submitComment()">Add Comment</b-button> -->
                            <input type="submit" class="add-btn ml-4" name="Add Comment" value="Add Comment">
                          </div>
                        </div>
                      </b-col>
                    </form>
                  </b-row>
                  </b-container>
                  </b-modal>
              </div>
          </div>
          <div>
            <ul class="list-group" v-if="repliesInPage.length > 0">
              <li v-for="(answer, index) in repliesInPage" :key="index"
                class="list-group-item side-margin pseudo message vote-panel-parent stretch-height">
                <div class="d-flex flex-row justify-content-start" :style="{ cursor: 'pointer', paddingBottom: '10px' }">
                  <div class="d-flex flex-row align-items-center">
                    <span class="avatar-position">
                      <b-avatar :src="answer.answered_by.img_add" alt></b-avatar>
                    </span>
                    <div class="d-flex flex-column-reverse ml-3">
                      <div class="row align-items-center ml-0 mt-2">
                        <div class="d-flex align-items-center mr-3">
                          <b-icon icon="caret-up-fill" class="mr-1"></b-icon>
                          <p v-bind:class="{'user-upvoted-text': userUpvotedReply(answer)}">{{countReplyUpvotes(answer)}}</p>
                        </div>
                        <div class="d-flex align-items-center mr-3 vote-section">
                          <button class="btn btn-sm cus-arrow-btn"
                            v-bind:class="{'user-upvoted-button': userUpvotedReply(answer)}">
                            <i class="fa fa-thumbs-up cus-fa-arror" @click="commentUpvote(answer)"
                              v-bind:class="{'user-upvoted': userUpvotedReply(answer)}"></i>
                          </button>
                          <button class="btn btn-sm cus-arrow-btn"
                            v-bind:class="{'user-downvoted-button': userDownvoted(answer)}">
                            <i class="fa fa-thumbs-down cus-fa-arror"
                              v-bind:class="{'user-downvoted': userDownvotedReply(answer)}" @click="commentDownvote(answer)"></i>
                          </button>
                        </div>
                      </div>
                      <div>
                        <div class="commenter-name">
                          <p v-if="answer.answered_by && answer.answered_by.username">@{{ answer.answered_by.username}}</p>
                          <p v-if="!answer.answered_by && !answer.answered_by.username">@
                              {{ answer.answered_by.first_name}}{{ answer.answered_by.last_name}}</p>
                          <small> Posted
                            <small v-if="'createdDate' in answer">{{ answer.createdDate.stringFormat}}</small>
                          </small>
                        </div>
                        <div class="commenter-comment mt-2">
                          <!-- <p>{{ answer.content}}</p> -->
                          <p v-html="showReplyMarkDown(answer.content)"></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </li>
            </ul>
            <h4 v-if="repliesInPage.length === 0" class="no-comment">No Replies Yet</h4>
          </div>
          <!--  <div class="disc-footer">
          <div class="comment-counter">
            <svg viewBox="0 0 24 24" width="1em" height="1em">
              <path
                fill-rule="evenodd"
                d="M8.995 22a.955.955 0 0 1-.704-.282.955.955 0 0 1-.282-.704V18.01H3.972c-.564 0-1.033-.195-1.409-.586A1.99 1.99 0 0 1 2 15.99V3.97c0-.563.188-1.032.563-1.408C2.94 2.188 3.408 2 3.972 2h16.056c.564 0 1.033.188 1.409.563.375.376.563.845.563 1.409V15.99a1.99 1.99 0 0 1-.563 1.432c-.376.39-.845.586-1.409.586h-6.103l-3.709 3.71c-.22.187-.454.281-.704.281h-.517zm.986-6.01v3.1l3.099-3.1h6.948V3.973H3.972V15.99h6.01zm-3.99-9.013h12.018v2.018H5.991V6.977zm0 4.037h9.014v1.972H5.99v-1.972z"
              />
            </svg>Comments: 1
          </div>
          <div class="sorts-part">
            <P class="active">Best</P>
            <P>Most Votes</P>
            <P>Newest to Oldest</P>
            <P>Oldest to Newest</P>
          </div>
        </div> -->
        </div>
      </div>
    </div>
    <div v-if="loaded">

    </div>
    <!-- <div>
      <p class="text-center">{{discussion.content}}</p>
      <div class="flex-row">
        <h5
          class="inline"
        >Asked by: {{discussion.answered_by.first_name}} {{discussion.answered_by.last_name}}</h5>
        <img
          class="avatar avatar-lg left-margin-small"
          :src="discussion.answered_by.profile_img_add"
          alt="avatar"
        />
      </div>

      <div class="side-margin-10">
        <div class="vote-panel">
          <button
            class="bordered btn btn-sm"
            @click="upvote()"
            v-bind:class="{'user-upvoted': userUpvoted()}"
          >
            <i class="fa fa-thumbs-up" v-bind:class="{'user-upvoted': userUpvoted()}"></i>
            <p
              v-if="countUpvotes() >= 0"
              class="inline"
              v-bind:class="{'user-upvoted': userUpvoted()}"
            >{{countUpvotes()}}</p>
          </button>

          <button
            class="btn btn-sm bordered-red"
            @click="downvote()"
            v-bind:class="{'user-downvoted': userDownvoted()}"
          >
            <i class="fa fa-thumbs-down" v-bind:class="{'user-downvoted': userDownvoted()}"></i>
          </button>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
  import ProblemService from '../services/problemService.js'
  import UserService from '../services/userService.js'
  import { mapGetters } from 'vuex'
  export default {
    name: 'IndividualDiscussionView',
    components: {},
    data() {
      return {
        previewComment: null,
        discussion: {
          answered_by: {
            first_name: '',
            last_name: '',
            img_add: ''
          },
          title: ''
        },
        loaded: false,
        userComment: '',
        current: 1
      }
    },
    computed: {
      ...mapGetters({
        loggedIn: 'loggedIn'
      }),
      repliesInPage() {
        // console.log(this.comments)
        return this.discussion.comments.sort((a, b) => {
          if (this.current === 1) {
            return b.createdDate.ms - a.createdDate.ms
          } else if (this.current === 2) {
            b.upvotes = b.upvotes ? b.upvotes : {};
            a.upvotes = a.upvotes ? a.upvotes : {};
            return Object.keys(b.upvotes).reduce((acc, cur) => acc + b
              .upvotes[cur], 0) - Object.keys(a.upvotes).reduce((acc,
              cur) => acc + a.upvotes[cur], 0)
          }
          return 0
        })
      },
    },
    mounted() {
      this.update(false)
    },
    methods: {
      downvote() {
        let self = this
        if (!this.loggedIn) {
          this.$modal.show('login', {
            auto_prompt: true,
            show_reason: 'can downvote comments'
          })
        } else {

          ProblemService.downvoteAnswer(this.$route.params.id).then(function(message) {
            if (self.discussion.upvotes[UserService.getCurrentUserId()] == -1) {
              delete self.discussion.upvotes[UserService.getCurrentUserId()]
            } else {
              self.discussion.upvotes[UserService.getCurrentUserId()] = -1
            }
            self.$forceUpdate();
            //self.update()
          })
        }
      },
      upvote() {
        let self = this
        if (!this.loggedIn) {
          this.$modal.show('login', {
            auto_prompt: true,
            show_reason: 'can upvote comments'
          })
        } else {
          ProblemService.upvoteAnswer(this.$route.params.id).then(function (message) {
            if (self.discussion.upvotes[UserService.getCurrentUserId()] == 1) {
              delete self.discussion.upvotes[UserService.getCurrentUserId()]
            } else {
              self.discussion.upvotes[UserService.getCurrentUserId()] = 1
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
      countUpvotes() {
        let score = 0
        for (let reaction in this.discussion.upvotes) {
          score += parseInt(this.discussion.upvotes[reaction])
        }
        return score
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
      userUpvoted() {
        let self = this
        if (!UserService.getCurrentUser()) return false
        let curUserId = UserService.getCurrentUserId()
        let upvotes = self.discussion.upvotes
        if (upvotes.hasOwnProperty(curUserId)) {
          if (upvotes[curUserId] == 1) return true
        }
        return false
      },
      userDownvoted() {
        let self = this
        if (!UserService.getCurrentUser()) return false
        let curUserId = UserService.getCurrentUserId()
        let upvotes = self.discussion.upvotes
        if (upvotes.hasOwnProperty(curUserId)) {
          if (upvotes[curUserId] == -1) return true
        }
        return false
      },
      userUpvotedReply(answer) {
        let self = this
        if (!UserService.getCurrentUser()) return false
        let curUserId = UserService.getCurrentUserId()
        let upvotes = answer.upvotes ? answer.upvotes : {};
        if (upvotes.hasOwnProperty(curUserId)) {
          if (upvotes[curUserId] == 1) return true
        }
        return false
      },
      userDownvotedReply(answer) {
        let self = this
        if (!UserService.getCurrentUser()) return false
        let curUserId = UserService.getCurrentUserId()
        let upvotes = answer.upvotes ? answer.upvotes : {};
        if (upvotes.hasOwnProperty(curUserId)) {
          if (upvotes[curUserId] == -1) return true
        }
        return false
      },
      isCurrentUser(id) {
        let curUserId = UserService.getCurrentUserId()
        return id == curUserId
      },
      setQuestionDelete() {
        this.questionDeleted = true
      },
      update(refresh) {
        const self = this
        const id = this.$route.params.id
        ProblemService.getComments(id).then(function (commentResult) {
          // console.log("COMMENT", commentResult.data());
          self.discussion = commentResult.data()
          UserService.getUserProfile(self.discussion.userID).then(function (user) {
            if (user) {
              self.discussion.answered_by = user;
            }
            if (refresh) {
              self.discussion.upvotes = commentResult.data().upvotes
            }
            // console.log(self.discussion)
          })
          if (self.discussion && self.discussion.comments && Array.isArray(self.discussion.comments)) {
            self.discussion.comments.forEach((comment, index) => {
              UserService.getUserProfile(comment.userID).then(function (user) {
                comment.answered_by = user
                if (!comment.title) {
                  comment.title = comment.answered_by.first_name + " " + comment.answered_by.last_name;
                }
                if (index == self.discussion.comments.length - 1) {
                  self.loaded = true;
                }
              })
            })
          } else {            self.discussion.comments = [];
            let screenLoad = setInterval(checkUser, 1000);

            function checkUser() {
              if (self.discussion.answered_by) {
                self.loaded = true;
                clearInterval(screenLoad);
              }
            }
          }
        })
      },
      submitComment(e) {
        e.preventDefault();
        let self = this;
        if (!this.loggedIn) {
          this.$bvModal.hide('discussionModal');
          this.$modal.show('login', {
            auto_prompt: true,
            show_reason: 'comment'
          })
        } else if (!UserService.getCurrentUser().username || UserService.getCurrentUser().username == '') {
          this.$modal.show('username', {
            auto_prompt: true,
          })
        } else {
          if (!self.discussion.comments) {
            self.discussion.comments = [];
          }
          let commentToAdd = Object.assign({}, {
            attachmentID: this.$route.params.id,
            userID: UserService.getCurrentUserId(),
            content: self.userComment,
            createdDate: ProblemService.getDate()
          })
          self.discussion.comments.push(commentToAdd);
          ProblemService.commentToComment(this.$route.params.id, self.discussion.comments);
           self.userComment = ''
           self.previewComment=''
          this.$bvModal.hide('discussionModal');
        }
        
      },
      replyPreview() {
        this.previewComment = marked(this.userComment, {
          sanitize: true
        });
      },
      showReplyMarkDown(comment) {
        const markup = marked(comment, {
          sanitize: true
        });
        return markup;
      },
      showCommentMarkDown(content) {
        const markup = marked(content);
        return markup;
      },
      countReplyUpvotes(answer) {
        let score = 0
        for (let reaction in answer.upvotes) {
          score += parseInt(answer.upvotes[reaction])
        }
        return score
      },
      commentUpvote(answer){
        if (!this.loggedIn) {
          this.$modal.show('login', {
            auto_prompt: true,
            show_reason: 'can upvote comments'
          })
        } else {
          let comments = this.discussion.comments;
          this.discussion.comments.forEach((obj, i) => {
            if (obj === answer) {
              // matched so upvote this reply and update all replies for it.
              let upvotes = answer.upvotes;
              if (upvotes == undefined || upvotes == {} || upvotes == null || upvotes == "") {
                upvotes = {};
                upvotes[UserService.getCurrentUserId()] = 1;
              }else if (upvotes[UserService.getCurrentUserId()] == 1) {
                delete upvotes[UserService.getCurrentUserId()]
              } else {
                upvotes[UserService.getCurrentUserId()] = 1
              }
              answer.upvotes = upvotes;
              comments[i].upvotes = upvotes;
            }
          });

          ProblemService.updateVote(this.$route.params.id, comments).then( (message) => {
            this.update(true);
          })
        }
      },
      commentDownvote(answer){
        if (!this.loggedIn) {
          this.$modal.show('login', {
            auto_prompt: true,
            show_reason: 'can upvote comments'
          })
        } else {
          let comments = this.discussion.comments;
          this.discussion.comments.forEach((obj, i) => {
            if (obj === answer) {
              // matched so upvote this reply and update all replies for it.
              let upvotes = answer.upvotes;
              if (upvotes == undefined || upvotes == {} || upvotes == null || upvotes == "") {
                upvotes = {};
                upvotes[UserService.getCurrentUserId()] = 1;
              }else if (upvotes[UserService.getCurrentUserId()] == -1) {
                delete upvotes[UserService.getCurrentUserId()]
              } else {
                upvotes[UserService.getCurrentUserId()] = -1
              }
              answer.upvotes = upvotes;
              comments[i].upvotes = upvotes;
            }
          });

          ProblemService.updateVote(this.$route.params.id, comments).then((message) => {
            this.update(true);
          })
        }
      },
      filterUpdate(type) {
        this.current = (type == 'recent') ? 1 : 2;
      },
    },
  }

</script>

<style scoped>
@import '../assets/css/IndividualDiscussion.css';
</style>