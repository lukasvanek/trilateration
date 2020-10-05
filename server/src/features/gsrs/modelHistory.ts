import mongoose from 'mongoose'

const GsrsHistorySchema = new mongoose.Schema(
  {
    profileId: String,
    displayName: String,
    aboutMe: String,
    age: Number,
    showAge: Boolean,
    ethnicity: Number,
    lookingFor: Array,
    relationshipStatus: Number,
    grindrTribes: Array,
    bodyType: Number,
    lastTestedDate: Date,
    height: Number,
    weight: Number,
    socialNetworks: Object,
    instagram: String, // added
    facebook: String, // added
    twitter: String, // added
    showDistance: Boolean,
    profileImageMediaHash: String,
    seen: Date,
    seenLatLng: Array, // added
    usCity: String, // added
    usState: String, // added
    city: String, // added
    country: String, // added
    distance: Number,
    medias: Array,
    identity: Object,
    lastChatTimestamp: Date,
    hasFaceRecognition: Boolean,
    hashtags: Array,
    lastUpdatedTime: Date,
    meetAt: Array,
  },
  { timestamps: true },
)

GsrsHistorySchema.index({ profileId: 1 })
GsrsHistorySchema.index({ height: 1 })

const GsrsHistory = mongoose.model('gsrs', GsrsHistorySchema)

export default GsrsHistory
