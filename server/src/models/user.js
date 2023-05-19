import mongoose from "mongoose";

const { Schema } = mongoose;

const schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (_doc, ret) {
      delete ret._id;
    },
  },
  minimize: false,
  strict: false,
};

const userSchema = new Schema(
  {
    examRegNo: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      index: true,
    },
    studentName: String,
    schoolName: String,
    grade: String,
    // firstLanguage: String,
    // english: String,
    // physics: String,
    // chemistry: String,
    // bioCs: String,
    // maths: String,
    // total: String,
    // mobile: String,
    // batch: String,
    photo: String,
  },
  schemaOptions
);

// Duplicate the ID field.
userSchema.virtual("id").get(function () {
  if (this._id) return this._id.toHexString();
});

userSchema.methods.toJSON = function () {
  return {
    id: this._id,
    examRegNo: this.examRegNo,
    studentName: this.studentName,
    schoolName: this.schoolName,
    grade: this.grade,
    // firstLanguage: this.firstLanguage,
    // english: this.english,
    // physics: this.physics,
    // chemistry: this.chemistry,
    // bioCs: this.bioCs,
    // maths: this.maths,
    // total: this.total,
    // mobile: this.mobile,
    // batch: this.batch,
    photo: this.photo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model("User", userSchema);

export default User;
