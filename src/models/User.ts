import {Schema, model} from 'mongoose';
import bcrypt from 'bcrypt';

let UserSchema,
    schemaOptions;




schemaOptions = {
    toObject: {
        virtuals: true
    }
    ,toJSON: {
        virtuals: true
    },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
};

UserSchema = new Schema({
    cod: {
        type: Number,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Scribe the Full name']
    },
    active:{
        type:Boolean,
        default: false
    },
    tokenActived:{
        type:Boolean,
        default: false
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
        validate: {
            validator: function (v:string) {
                return /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,4}$/.test(v);
            },
            message: '{VALUE} is not a valid email for autenticate!'
        },
        required: [true, 'Scribe a Email']
    },
    password: {
        type: String,
        required: [true, 'Scribe a password']
    },
    deleted_at: {type: Date, default: null}
}, schemaOptions);

// Execute before each user.save() call
UserSchema.pre('save', function(next:any) {
    let user = this;
    if(this.isModified('password') || this.isNew){
        bcrypt.genSalt(10, function (error:any, salt:any){
            if(error){
                console.error(error);
                next(error);
            }else{
                bcrypt.hash(user.password, salt, function (error, hash){
                    if (error) {
                        console.error(error);
                        next(error);
                    }else{
                        user.password = hash;
                        console.info("hashing the password!");
                        next();
                    }
                });
            }
        });
    }else{
        console.info("the password dont changed!");
        next();
    }
});

export = model('User', UserSchema);