//   Table users{

//     id ObjectId [pk]

//     profileId string

//     email string

//     role enum('admin', 'user', 'superAdmin ')

//     phone string

//     password string

//     passwordChangedAt  Date

//     isBlocked  boolean

//     verifyCode number

//     resetCode number

//     isVerified boolean

//     isResetVerified boolean

//     codeExpireIn Date

//     isActive boolean

//     isDeleted boolean

//     appleId string

//     googleId string

// }

//  Table normalusers {

//   id ObjectId [pk]

//   user ObjectId [ref: > users.id]

//   name string

//   email string

//   phone string

//   profile_image string
//   createdAt Date
//   updatedAt Date

// }

// Table superadmins {

//   id ObjectId [pk]

//   user ObjectId [ref:>users.id,unique]

//   name string

//   email string

//   profile_image string

//   createdAt Date
//   updatedAt Date

// }

// Table admins {

//   id ObjectId [pk]

//   user ObjectId [ref:>users.id]

//   name string

//   email string

//   profile_image string

//   isActive boolean

//   createdAt Date
//   updatedAt Date

// }

// Table Donner {

//   id ObjectId [pk]

//   user ObjectId [ref:> normalusers.id]

//   amount number
//   createdAt Date
//   updatedAt Date
// }

// Table Audiotopic {

//   id ObjectId [pk]

//   name string

//   image string
//   createdAt Date
//   updatedAt Date
// }

// Table SkillCategory {

//   id ObjectId [pk]

//   name string

//   image string
//   createdAt Date
//   updatedAt Date
// }

// Table Audio {

//   id ObjectId [pk]

//   audioTopic ObjectId [ref:> Audiotopic.id]

//   title string

//   cover_image string

//   totalPlay number

//   duration number
//   createdAt Date
//   updatedAt Date

// }

// Table playlists {

//   id ObjectId [pk]

//   name string

//   description string

//   tags string[]

//   cover_image string

//   audios Object[] [ref:> Audio.id]

//   totalDuration number
//   createdAt Date
//   updatedAt Date
// }

// Table AudioBookmark {

//   id ObjectId [pk]

//   audio ObjectId [ref:> Audio.id]

//   user ObjectId [ref:> normalusers.id]
//   createdAt Date
//   updatedAt Date
// }

// Table AudioRating {

//   id ObjectId [pk]

//   audio ObjectId [ref:> Audio.id]

//   user ObjectId [ref:> normalusers.id]

//   comment string

//   rating number
//   createdAt Date
//   updatedAt Date
// }

// Table Project {

//   id ObjectId

//   name string

//   description string

//   cover_image string

//   joinControll enum("Public","Private")

//   ower ObjectId [ref:> normalusers.id]

//   status enum("Ongoing","Canceled","Completed")
//   createdAt Date
//   updatedAt Date
// }

// Table ProjectMumber {

//   id ObjectId [pk]

//   user ObjectId [ref:> normalusers.id]

//   project ObjectId [ref:> normalusers.id]

//   type enum('Producer','Consumer')

//   role string
//   createdAt Date
//   updatedAt Date
// }

// Table ProjectJoinRequest {

//   id ObjectId [pk]

//   user ObjectId [ref:> normalusers.id]

//   project ObjectId [ref:> normalusers.id]

//   status  enum("pending",'rejected','accepted')
//   createdAt Date
//   updatedAt Date
// }

// Table ProjectDocument {

//   id ObjectId [pk]

//   addedBy ObjectId [ref:> normalusers.id]

//   project ObjectId [ref:> Project.id]

//   document_url string
//   createdAt Date
//   updatedAt Date
// }

// Table ProjectImage {

//   id ObjectId [pk]

//   addedBy ObjectId [ref:> normalusers.id]

//   project ObjectId [ref:> Project.id]

//   image_url string
//   createdAt Date
//   updatedAt Date
// }

//  Table Bond {

//   id ObjectId [pk]

//   user ObjectId [ref:> normalusers.id]

//   title string

//   type enum("Give",'Get')

//   tag string
//   createdAt Date
//   updatedAt Date

//  }

// Table Report {

//   reportFrom ObjectId [ref:>normalusers.id]

//   reportTo ObjectId  [ref:> normalusers.id]

//   type string

//   descripton string
//   createdAt Date
//   updatedAt Date
// }

// Table TermsAndCondition {

//   id ObjectId [pk]

//   description string

// }

// Table PrivacyPolicy {

//   id ObjectId [pk]

//   description string
//   createdAt Date
//   updatedAt Date
// }

// Table FAQ {

//   id ObjectId [pk]

//   question string

//   answer string
//   createdAt Date
//   updatedAt Date
// }

// Table Institution {

//   id ObjectId [pk ]

//   user ObjectId [ref:> normalusers.id]
//   createdAt Date
//   updatedAt Date
// }

// Table Transaction {
//   id ObjectId [pk]
//   user ObjectId [ref:> normalusers.id]
//   type string
//   amount number
//   transactionId string
//   createdAt Date
//   updatedAt Date
// }

// Table Conversation {
//   id ObjectId [pk]
//   participants ObjectId[] [ref:> normalusers.id]
//   lastMessage ObjectId [ref:> Message.id]
//   type enum("one-to-one","group")
//   institution ObjectId [ref: > Institution.id] // nullable
//   project OjbectId [ref:> Project.id] // nullable
//   chatGroup OjbectId [ref:> ChatGroup.id]
//   createdAt Date
//   updatedAt Date
// }

// Table Message {
//   id OjbectId [pk]
//   text string
//   imageUrls string[]
//   videoUrls string[]
//   pdfUrls string[]
//   sender ObjectId [ref:> normalusers.id]
//   seenBy ObjectId[] [ref:> normalusers.id]
//   conversationId ObjectId [ref:> Conversation.id]
//   createdAt Date
//   updatedAt Date
// }

// Table ChatGroup {
//   id ObjectId [pk]
//   name string
//   coverImage string
//   mumbers ObjectId[] [ref:> normalusers.id]
//   createdAt Date
//   updatedAt Date
// }

// Ref: "Audio"."title" < "ProjectMumber"."role"

// Ref: "Audio"."audioTopic" < "Report"."type"

// Ref: "Project"."cover_image" < "ProjectMumber"."role"

// Ref: "Project"."cover_image" < "ProjectMumber"."project"

// Ref: "Project"."cover_image" < "ProjectMumber"."user"
