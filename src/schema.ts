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

// }

// Table superadmins {
//   id ObjectId [pk]
//   user ObjectId [ref:>users.id,unique]
//   name string
//   email string
//   profile_image string

// }

// Table admins {
//   id ObjectId [pk]
//   user ObjectId [ref:>users.id]
//   name string
//   email string
//   profile_image string
//   isActive boolean
// }

// Table Audiotopic {
//   id ObjectId [pk]
//   name string
//   image string
// }

// Table audios {
//   id ObjectId [pk]
//   audioTopic ObjectId [ref:> Audiotopic.id]
//   title string
//   cover_image string
//   totalPlay number
//   duration number

// }

// Table playlists {
//   id ObjectId [pk]
//   name string
//   description string
//   tags string[]
//   cover_image string
//   audios Object[] [ref:> audios.id]
//   totalDuration number
// }

// Table AudioBookmark {
//   id ObjectId [pk]
//   audio ObjectId [ref:> audios.id]
//   user ObjectId [ref:> normalusers.id]
// }

// Table Project {
//   id ObjectId
//   name string
//   description string
//   cover_image string
//   joinControll enum("Public","Private")
//   ower ObjectId [ref:> normalusers.id]
// }

// Table ProjectMumber {
//   id ObjectId [pk]
//   user ObjectId [ref:> normalusers.id]
//   project ObjectId [ref:> normalusers.id]
//   type enum('Producer','Consumer')
//   role string
// }

// Table ProjectJoinRequest {
//   id ObjectId [pk]
//   user ObjectId [ref:> normalusers.id]
//   project ObjectId [ref:> normalusers.id]
//   status  enum("pending",'rejected','accepted')
// }

// Table ProjectDocument {
//   id ObjectId [pk]
//   addedBy ObjectId [ref:> normalusers.id]
//   project ObjectId [ref:> Project.id]
//   document_url string
// }

// Table ProjectImage {
//   id ObjectId [pk]
//   addedBy ObjectId [ref:> normalusers.id]
//   project ObjectId [ref:> Project.id]
//   image_url string
// }

// Table reports {
//   reportFrom ObjectId [ref:>normalusers.id]
//   reportTo ObjectId [ref:> normalusers.id]
//   type string
//   descripton string
// }
