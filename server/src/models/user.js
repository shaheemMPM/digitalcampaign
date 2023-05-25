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
    dob: String,
    studentName: String,
    fatherName: String,
    motherName: String,
    schoolCode: String,
    groupName: String,
    subjects: String,
    percentage: String,
    mobile: String,
    batch: String,
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
    dob: this.dob,
    studentName: this.studentName,
    fatherName: this.fatherName,
    motherName: this.motherName,
    schoolCode: this.schoolCode,
    groupName: this.groupName,
    subjects: this.subjects,
    percentage: this.percentage,
    mobile: this.mobile,
    batch: this.batch,
    photo: this.photo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model("User", userSchema);

export default User;
