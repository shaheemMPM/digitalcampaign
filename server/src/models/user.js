import mongoose from 'mongoose';

const { Schema } = mongoose;

const schemaOptions = {
	timestamps: true,
	toJSON: {
		virtuals: true,
		transform: function (doc, ret) {
			delete ret._id;
		},
	},
	minimize: false,
	strict: false,
};

const userSchema = new Schema(
	{
		sslcRegNo: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"],
			index: true,
		},
		fullName: String,
		mobile: String,
		school: String,
		batch: String,
		momento: String,
	},
	schemaOptions
);

// Duplicate the ID field.
userSchema.virtual('id').get(function () {
	if (this._id) return this._id.toHexString();
});

userSchema.methods.toJSON = function () {
	return {
		id: this._id,
		sslcRegNo: this.sslcRegNo,
		fullName: this.fullName,
		mobile: this.mobile,
		school: this.school,
		batch: this.batch,
		momento: this.momento,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
	};
};

const User = mongoose.model('User', userSchema);

export default User;
