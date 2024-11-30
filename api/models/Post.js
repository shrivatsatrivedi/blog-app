const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: { type: String, required: true },       // Required title
    summary: { type: String, required: true },     // Required summary
    content: { type: String, required: true },     // Required content
    cover: { data: Buffer, contentType: String,  },  
    author :{type:Schema.Types.ObjectId, ref:'User'},    // Required cover path (path to the uploaded file)
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;
